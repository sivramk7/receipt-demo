import json

from flask import Flask, request, jsonify
from google.api_core.client_options import ClientOptions
from google.cloud import documentai_v1 as documentai
from google.oauth2 import service_account

app = Flask(__name__)


@app.route("/upload/", methods=["POST"])
def upload_file():
    file_data = request.files["file"]
    file_content = file_data.read()
    file_type = file_data.mimetype

    project_id = "sample-receipt-project"
    location = "us"
    processor_id = "7dd34994d311ea28"

    # Create gcp client using creds.json
    opts = ClientOptions(api_endpoint=f"{location}-documentai.googleapis.com")
    credentials = service_account.Credentials.from_service_account_file("./creds.json")
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
