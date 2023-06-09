from flask import Flask
from intuitlib.client import AuthClient
from quickbooks import QuickBooks
from quickbooks.objects import Invoice, SalesItemLine, SalesItemLineDetail, Customer, Item
from decouple import config

app = Flask(__name__)

# QuickBooks client setup
auth_client = AuthClient(
    client_id=config("CLIENT_ID"),
    client_secret=config("CLIENT_SECRET"),
    environment=config("QUICKBOOK_ENV"),
    redirect_uri='https://developer.intuit.com/v2/OAuth2Playground/RedirectUrl',
)

client = QuickBooks(
    auth_client=auth_client,
    refresh_token=config("REFRESH_TOKEN"),
    company_id=config("REALM_ID")
)


@app.route('/invoices', methods=['GET'])
def get_invoices():
    invoices = Invoice.all(qb=client)
    return {"invoices": [invoice.to_dict() for invoice in invoices]}


@app.route('/invoices', methods=['POST'])
def create_invoice():
    detail = SalesItemLineDetail()
    detail.ItemRef = Item.get("1", qb=client).to_ref()
    detail.Qty = 1
    detail.UnitPrice = 10

    line = SalesItemLine()
    line.Amount = 10
    line.SalesItemLineDetail = detail

    invoice = Invoice()
    invoice.CustomerRef = Customer.get("1", qb=client).to_ref()
    invoice.Line.append(line)

    invoice.save(qb=client)

    return {"invoice": invoice.to_dict()}

@app.route('/invoices/<int:invoice_id>', methods=['PUT'])
def update_invoice(invoice_id):
    invoice = Invoice.get(invoice_id, qb=client)

    new_total_amount = 100

    difference = new_total_amount - invoice.TotalAmt

    line_item = invoice.Line[0]
    line_item.Amount += difference

    if line_item.SalesItemLineDetail.Qty != 0:
        line_item.SalesItemLineDetail.UnitPrice = line_item.Amount / line_item.SalesItemLineDetail.Qty
    else:
        line_item.SalesItemLineDetail.UnitPrice = 0

    invoice.TotalAmt += difference

    invoice.save(qb=client)

    return {"invoice": invoice.to_dict()}

if __name__ == '__main__':
    app.run(port=5000, debug=True)
