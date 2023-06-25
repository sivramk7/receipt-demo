import React from 'react';
import InvoiceField from './InvoiceField';

const InvoiceItem = ({ id, len, name, qty, code, subTotalCustom, price, onDeleteItem, onEdtiItem, isMobileScreen }) => {
  const deleteItemHandler = () => {
    onDeleteItem(id);
  };

  const myCustomSubtotal = (event) => {
    const target = event.target;
    const name = target.name;
    const uniqueValue = target.getAttribute('unique');
    const lenNo = uniqueValue.split("_");
    const priceInput = document.querySelector(`input[unique="price_${lenNo[1]}"]`);
    const qtyInput = document.querySelector(`input[unique="qty_${lenNo[1]}"]`);
    const subtotalInput = document.querySelector(`input[unique="subtotal_${lenNo[1]}"]`);

  
    if (name === "price" && priceInput && qtyInput) {
      const price = parseFloat(priceInput.value);
      const qty = parseFloat(qtyInput.value);
      const subtotal = isNaN(price) || isNaN(qty) ? 0 : price * qty;
      subtotalInput.value = `${subtotal}`;
    } else if (name === "qty" && priceInput && qtyInput) {
      const price = parseFloat(priceInput.value);
      const qty = parseFloat(qtyInput.value);
      const subtotal = isNaN(price) || isNaN(qty) ? 0 : price * qty;
      subtotalInput.value = `${subtotal}`;
    }
  };

  return (
    <>
    {
      isMobileScreen === true ? 
      <>
        <tr className="border-b border-gray-200">
          <th className="py-3">Item</th>
          <td className="pl-3 w-full" colSpan={2}>
            <input
              className='invoiceItemCustom'
              type="text"
              placeholder="Item name"
              min="1"
              name="name"
              unique={"name_"+id}
              id={id}
              value={name}
              onChange={(event) => {onEdtiItem(event); myCustomSubtotal(event);}}
              required
            />
            {/* <InvoiceField
              onEditItem={(event) => onEdtiItem(event)}
              cellData={{
                className: "invoiceItemCustom",
                placeholder: 'Item name',
                type: 'text',
                name: 'name',
                id: id,
                value: name,
              }}
            /> */}
          </td>
          {/* <td rowSpan={3} className="pl-2">
            <button
              className="rounded-md bg-red-500 p-2 text-white shadow-sm transition-colors duration-200 hover:bg-red-600"
              onClick={deleteItemHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </td> */}
        </tr>
        {/* Editing Start */}
        <tr className="border-b border-gray-200">
          <th className="py-3">QTY</th>
          <th className="py-3" style={{paddingLeft: "80px"}}>Code</th>
        </tr>
        <tr className="border-b border-gray-200">
          <td>
            <input
              style={{width: '90px'}}
              type="number"
              placeholder="Quantity"
              min="1"
              name="qty"
              unique={"qty_"+id}
              id={id}
              value={qty}
              onChange={(event) => {onEdtiItem(event); myCustomSubtotal(event);}}
              required
            />
          </td>
          <td style={{paddingLeft: "80px"}}>
            <input
              style={{width: '90px'}}
              type="text"
              placeholder="Code"
              unique={"code_"+id}
              name="code"
              id={id}
              value={code}
              onChange={(event) => {onEdtiItem(event); myCustomSubtotal(event);}}
              required
            />
          </td>
        </tr>
        {/* For Price and Subtotal Start */}
        <tr className="border-b border-gray-200">
          <th className="py-3">PRICE</th>
          <th className="py-3" style={{paddingLeft: "80px"}}>Subtotal</th>
        </tr>
        <tr className="border-b border-gray-200">
          <td className="relative min-w-[100px] md:min-w-[150px]">
            <span className="absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400 sm:left-4">
              $
            </span>
            <input
              style={{width: '90px'}}
              className='text-right'
              type="number"
              placeholder="Price"
              min= '0.01'
              step= '0.01'
              name= 'price'
              unique={"price_"+id}
              id={id}
              value={price}
              onChange={(event) => {onEdtiItem(event); myCustomSubtotal(event);}}
              required
            />
          </td>
          <td style={{paddingLeft: "80px"}}>
            <input
              style={{width: '90px'}}
              readonly="true"
              placeholder="Subtotal"
              unique={"subtotal_"+id}
              min="1"
              name="subTotalCustom"
              id={id}
              onChange={(event) => {onEdtiItem(event); myCustomSubtotal(event);}}
              required
            />
          </td>
        </tr>
        {/* For Price and Subtotal End */}
        {/* Editing End */}
        <tr>
          <td colSpan={3}>
            <hr className="my-2 border-none bg-gray-500 h-px w-full" />
          </td>
        </tr>
      </>
      :
      <tr>
        <td className="w-full">
          <InvoiceField
            onEditItem={(event) => onEdtiItem(event)}
            cellData={{
              placeholder: 'Item name',
              type: 'text',
              name: 'name',
              id: id,
              value: name,
            }}
          />
        </td>
        <td className="min-w-[65px] md:min-w-[80px]">
          <InvoiceField
            onEditItem={(event) => onEdtiItem(event)}
            cellData={{
              type: 'number',
              min: '1',
              name: 'qty',
              id: id,
              value: qty,
            }}
          />
        </td>
        <td className="relative min-w-[100px] md:min-w-[150px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-2 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400 sm:left-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <InvoiceField
            onEditItem={(event) => onEdtiItem(event)}
            cellData={{
              className: 'text-right',
              type: 'number',
              min: '0.01',
              step: '0.01',
              name: 'price',
              id: id,
              value: price,
            }}
          />
        </td>
        <td className="flex items-center justify-center">
          <button
            className="rounded-md bg-red-500 p-2 text-white shadow-sm transition-colors duration-200 hover:bg-red-600"
            onClick={deleteItemHandler}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </td>
      </tr>
    }
    </>
  );
};

export default InvoiceItem;
