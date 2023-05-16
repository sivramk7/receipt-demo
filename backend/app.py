import json
import openai
from decouple import config

from flask import Flask, request, jsonify
from google.api_core.client_options import ClientOptions
from google.cloud import documentai_v1 as documentai
from google.oauth2 import service_account
from flask_cors import CORS

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

m = []


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

    # return the response as JSON
    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
