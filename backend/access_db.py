from flask import Flask, request, jsonify
import pyodbc
from marshmallow import Schema, fields

app = Flask(__name__)

class InvoiceSchema(Schema):
    id = fields.Int()
    currency = fields.Str()
    total_amount = fields.Str()
    total_tax_amount = fields.Str()
    supplier_name = fields.Str()

invoice_schema = InvoiceSchema()
invoices_schema = InvoiceSchema(many=True)

def get_db_conn():
    conn = pyodbc.connect(r'DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=C:\Users\parry\OneDrive\Documents\docai.accdb;')
    return conn

@app.route('/invoice', methods=['POST'])
def add_invoice():
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO invoices ([currency], total_amount, total_tax_amount, [supplier_name])
        VALUES (?, ?, ?, ?)
    """, (request.json['currency'], request.json['total_amount'], request.json['total_tax_amount'], request.json['supplier_name']))
    conn.commit()
    return invoice_schema.dump(request.json), 201

@app.route('/invoice', methods=['GET'])
def get_invoices():
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM invoices")
    rows = cursor.fetchall()
    invoices = [dict(zip([column[0] for column in cursor.description], row)) for row in rows]
    return jsonify(invoices_schema.dump(invoices))

if __name__ == '__main__':
    app.run(port=5001)
