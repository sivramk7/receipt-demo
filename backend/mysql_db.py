from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:test@localhost/docai'
db = SQLAlchemy(app)
ma = Marshmallow(app)

class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    total_amount = db.Column(db.String(255))
    total_tax_amount = db.Column(db.String(255))
    currency = db.Column(db.String(100))
    supplier_name = db.Column(db.String(255))

    def __init__(self, total_amount, total_tax_amount, currency, supplier_name):
        self.total_amount = total_amount
        self.total_tax_amount = total_tax_amount
        self.currency = currency
        self.supplier_name = supplier_name

class InvoiceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Invoice
        include_relationships = True
        load_instance = True

invoice_schema = InvoiceSchema()
invoices_schema = InvoiceSchema(many=True)

@app.route('/invoice', methods=['POST'])
def add_invoice():
    total_amount = request.json['total_amount']
    total_tax_amount = request.json['total_tax_amount']
    currency = request.json['currency']
    supplier_name = request.json['supplier_name']

    new_invoice = Invoice(total_amount, total_tax_amount, currency, supplier_name)

    db.session.add(new_invoice)
    db.session.commit()

    return invoice_schema.jsonify(new_invoice)

@app.route('/invoice', methods=['GET'])
def get_invoices():
    all_invoices = Invoice.query.all()
    result = invoices_schema.dump(all_invoices)
    return jsonify(result)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)
