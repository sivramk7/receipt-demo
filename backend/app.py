import json
import requests
import openai
from decouple import config

from flask import Flask, request, jsonify
from google.api_core.client_options import ClientOptions
from google.cloud import documentai_v1 as documentai
from google.oauth2 import service_account
from flask_cors import CORS


# Edit By Sayed
import time
from pdf2image import convert_from_path
import io
from flask import send_file
import os
from google.cloud import vision
from PIL import Image
from threading import Thread
from io import BytesIO
import base64
# End Edit By Sayed


openai.api_key = config("OPENAI_KEY")
openai.organization = config("OPENAI_ORG")
app = Flask(__name__)
CORS(app)

PROCESSORS = {
    "invoice": "5ad196c7d2038188",
    "expense": "19f428b10a5af1db",
    "t4-tax-document": "2e1d3d05ee3b0bcf",
    "bank-statement": "8ef05a0f90e1ccb8",
}

invoice_columns = ["total_amount", "total_tax_amount", "currency", "supplier_name"]

m = []

# Edit By Sayed
dir_path = os.path.dirname(os.path.realpath(__file__))
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]=dir_path + "/t4-form-sample-project-b2e0ce2a20d8.json"

client = vision.ImageAnnotatorClient()
glabeldata = None
iou_thresh = 0.6

# End Edit By Sayed


@app.route("/search/", methods=["POST"])
def search():
    system_role = (
        "You are an AI Assistant who helps answer questions based on provided OCR text."
        "The provided OCR text can be from an invoice, expense bill or a T4 tax document."
    )
    ocr_text = request.json["ocr_text"]
    previous_messages = request.json["context"]
    prompt = request.json["prompt"]
    messages = (
        [
            {"role": "system", "content": system_role},
            {"role": "user", "content": f"Here is the OCR Text: {ocr_text}"},
        ]
        + previous_messages
        + [{"role": "user", "content": prompt}]
    )
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
    )
    return jsonify(completion)


@app.route("/upload/", methods=["POST"])
def upload_file():
    file_data = request.files["file"]
    file_content = file_data.read()
    file_type = file_data.mimetype
    document_type = request.form["file_type"]

    project_id = "t4-form-sample-project"
    location = "us"
    processor_id = PROCESSORS.get(document_type, PROCESSORS["invoice"])
    creds = "./creds.json"
    if document_type == "bank-statement":
        creds = "./bank.json"
        project_id = "afto-sample-project1"

    # Create gcp client using creds.json
    opts = ClientOptions(api_endpoint=f"{location}-documentai.googleapis.com")
    credentials = service_account.Credentials.from_service_account_file(creds)
    client = documentai.DocumentProcessorServiceClient(
        credentials=credentials,
        client_options=opts,
    )

    # create processor path
    name = client.processor_path(project_id, location, processor_id)

    # create the document object
    document = documentai.RawDocument(content=file_content, mime_type=file_type)

    # create request to send
    gcp_request = documentai.ProcessRequest(
        name=name,
        raw_document=document,
    )

    # process the document
    result = client.process_document(
        request=gcp_request,
    )

    result_document = result.document
    response = json.loads(documentai.Document.to_json(result_document))
    # if document_type == "invoice":
    #     invoice_data = {}
    #     for entity in response.get("entities", {}):
    #         if entity["type"] not in invoice_columns:
    #             continue
    #         invoice_data[entity["type"]] = entity["mentionText"]
    #     saved_invoice_data = requests.post("http://localhost:5001/invoice", json=invoice_data)
    #     print(saved_invoice_data.json())

    # return the response as JSON
    return jsonify(response)


# Edit By Sayed
def detect_text():
    global client, glabeldata

    if glabeldata is None:
        return
    if glabeldata["process"]:
        return

    print("\nGougle Cloud Response")
    # path = glabeldata["name"]
    data = glabeldata["data"]
    new_data = []
    for d in data:
        path = d["filename"]
        with open(path, 'rb') as image_file:
            content = image_file.read()

        image = vision.Image(content=content)

        response = client.text_detection(image=image)
        texts = response.text_annotations

        textdata = []
        print("\tFile : ", path)
        for text in texts:
            vertices = [[vertex.x,vertex.y] for vertex in text.bounding_poly.vertices]

            if vertices.__len__() > 3:
                x = min([a for [a, _] in vertices])
                y = min([a for [_, a] in vertices])
                w = max([a for [a, _] in vertices]) - x
                h = max([a for [_, a] in vertices]) - y
                textdata.append({"text" : text.description, "rect" : [x, y, w, h]})
                print("\trect : ", [x, y, w, h], "\ttext : ", text.description)
        new_data.append({"filename" : path, "textdata": textdata})

    glabeldata["data"] = new_data
    glabeldata["process"] = True

    print("gcloud processed")


def get_iou(bb1, bb2):
    """
    :param bb1: x, y, w, h : source box (master)
    :param bb2: x, y, w, h : target box (slave)
    :return:
    """
    assert bb1[0] < bb1[0] + bb1[2]
    assert bb1[1] < bb1[1] + bb1[3]
    assert bb2[0] < bb2[0] + bb2[2]
    assert bb2[1] < bb2[1] + bb2[3]

    # determine the coordinates of the intersection rectangle
    x_left = max(bb1[0], bb2[0])
    y_top = max(bb1[1], bb2[1])
    x_right = min(bb1[0] + bb1[2], bb2[0] + bb2[2])
    y_bottom = min(bb1[1] + bb1[3], bb2[1] + bb2[3])

    if x_right < x_left or y_bottom < y_top:
        return 0.0

    # The intersection of two axis-aligned bounding boxes is always an
    # axis-aligned bounding box
    intersection_area = (x_right - x_left) * (y_bottom - y_top)

    # compute the area of both AABBs
    bb1_area = bb1[2] * bb1[3]
    bb2_area = bb2[2] * bb2[3]

    # compute the intersection over union by taking the intersection
    # area and dividing it by the sum of prediction + ground-truth
    # areas - the interesection area
    iou = intersection_area / float(bb2_area)
    assert iou >= 0.0
    assert iou <= 1.0
    return iou


def resize_image(image, swidth):
    (wimage, himage) = image.size

    if wimage > swidth:
        # it has to resize the image
        scale = wimage / swidth
        image = image.resize((swidth, int(himage / scale)))

    return image


@app.route('/upload-label', methods=['POST'])
def upload_label():
    global glabeldata, iou_thresh

    try:
        data = request.get_json()

        while not glabeldata["process"]:
            time.sleep(0.001)

        print("-"*20)
        # print("File : ", glabeldata["name"])

        filename = data['filename']
        for d in data['data']:
            for p in glabeldata["data"]:
                if filename != p["filename"]:
                    continue
                rect = [d["left"], d["top"], d["width"], d["height"]]
                result = []
                for g in p["textdata"]:
                    iou = get_iou(rect, g["rect"])
                    if iou > iou_thresh:
                        result.append(g)
                if result.__len__() > 0:
                    result = sorted(result, key=lambda a:a["rect"][0])
                    text = ""
                    for r in result:
                        text += r["text"] + " "
                    print("text : ", text, ",\tlabel : ", d["label"], ",\trect(x,y,w,h) : ", rect)

        return 'Ok', 200
    except:
        return 'Fail', 500


@app.route('/upload-file', methods=['POST'])
def edit_upload_file():
    global glabeldata
    try:
        file = request.files['file']
        swidth = int(request.form.get('screenWidth'))

        swidth = 1400 if swidth is None else swidth

        type = file.content_type.lower()
        data = []

        # get image
        if type.endswith("webp") or type.endswith("jfif"):
            image_data = file.read()
            image_io = BytesIO(image_data)

            # Open the image using Pillow
            image = Image.open(image_io)

            # Convert the image to the desired format (e.g., JPEG)
            image = image.convert('RGB')

            image = resize_image(image, swidth)

            fname = os.path.splitext(file.filename)[0] + ".png"
            image.save(fname, 'PNG')
            with open(fname, 'rb') as f:
                fdata = f.read()
            image_data = io.BytesIO(fdata)
            data.append({
                            'filename': fname,
                            'image': base64.b64encode(image_data.getvalue()).decode('utf-8')
                        })
        if type.endswith("jpg") or type.endswith("jpeg") or type.endswith("png") or type.endswith("bmp"):
            image = Image.open(file)
            image = resize_image(image, swidth)

            fname = os.path.splitext(file.filename)[0] + ".png"
            image.save(fname, 'PNG')
            with open(fname, 'rb') as f:
                fdata = f.read()
            image_data = io.BytesIO(fdata)
            data.append({
                'filename': fname,
                'image': base64.b64encode(image_data.getvalue()).decode('utf-8')
            })
        if type.endswith("pdf"):
            file.save("temp.pdf")
            images = convert_from_path('temp.pdf', 500)

            if images is not None:
                for cnt in range(images.__len__()):
                    image = images[cnt]
                    fname = os.path.splitext(file.filename)[0] + f"_{cnt}.png"
                    image.save(fname, 'PNG')
                    with open(fname, 'rb') as f:
                        fdata = f.read()
                    image_data = io.BytesIO(fdata)
                    data.append({
                            'filename': fname,
                            'image': base64.b64encode(image_data.getvalue()).decode('utf-8')
                        })

        if data.__len__() == 0:
            return 'Fail', 500

        glabeldata = {"data" : data, "process" : False}
        thread = Thread(target=detect_text)
        thread.start()

        response = jsonify(data)

        # Set the appropriate Content-Type header
        response.headers['Content-Type'] = 'application/json'

        return response

    except:
        print("error")
        return 'Fail', 500


@app.route('/pdf_to_image/', methods=['POST'])
def pdf_to_image():
    global glabeldata
    try:
        file = request.files['file']
        type = file.content_type.lower()
        data = []

        # get image
        if type.endswith("pdf"):
            file.save("temp.pdf")
            images = convert_from_path('temp.pdf', 500)

            if images is not None:
                for cnt in range(images.__len__()):
                    image = images[cnt]
                    fname = os.path.splitext(file.filename)[0] + f"_{cnt}.png"
                    image.save(fname, 'PNG')
                    with open(fname, 'rb') as f:
                        fdata = f.read()
                    image_data = io.BytesIO(fdata)
                    data.append({
                            'filename': fname,
                            'image': base64.b64encode(image_data.getvalue()).decode('utf-8')
                        })

        if data.__len__() == 0:
            return 'No page', 500

        response = jsonify(data)

        # Set the appropriate Content-Type header
        response.headers['Content-Type'] = 'application/json'

        return response

    except :
        print("error")
        return 'exception', 500


# End Edit By Sayed


if __name__ == "__main__":
    app.run(debug=True)
