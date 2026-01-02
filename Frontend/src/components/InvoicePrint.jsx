import React from 'react';

export default function InvoicePrint({ order }) {
  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-black text-xl">No order data available</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'packed': return 'bg-orange-100 text-orange-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 print:bg-white print:p-0">
      <style>{`
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
            width: 210mm;
            height: 297mm;
          }
          .print-container {
            width: 210mm;
            height: 148.5mm;
            margin: 0;
            padding: 10px;
            box-shadow: none;
            page-break-after: always;
            page-break-inside: avoid;
            border: none;
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .print-invoice {
            padding: 10px !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          table {
            page-break-inside: avoid;
            border-collapse: collapse;
            width: 100%;
          }
          tr {
            page-break-inside: avoid;
          }
          .space-y-0 > * + * {
            margin-top: 0 !important;
          }
        }
      `}</style>

      {/* Print Button */}
      <div className="mb-4 no-print text-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition text-sm"
        >
          🖨️ Print Invoice
        </button>
      </div>

      {/* A4 Half Page Invoice Container */}
      <div className="print-container max-w-2xl mx-auto bg-white border print:border-0 print:shadow-none shadow-lg rounded-lg print:rounded-none print-invoice p-2.5">
        
        {/* Header - Compact */}
        <div className="border-b border-gray-300 pb-1 mb-1">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <h1 className="text-xl font-bold text-purple-600 leading-tight">kalaqx</h1>
              <p className="text-gray-700 font-semibold text-xs leading-tight">Agriculture E-commerce</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-black leading-tight">INVOICE</p>
              <p className="text-black leading-tight">ID: {order._id?.substring(0, 12)}</p>
              <p className="text-black leading-tight">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Bill From & Ship To - Compact */}
        <div className="grid grid-cols-2 gap-2 mb-1 text-xs">
          {/* Bill From */}
          <div>
            <p className="text-black font-bold text-xs mb-0.5 border-b border-purple-300">BILL FROM</p>
            <div className="text-black">
              <p className="font-semibold leading-tight text-xs">kalaqx</p>
              <p className="text-gray-700 text-xs leading-tight">E-commerce</p>
            </div>
          </div>

          {/* Ship To */}
          {order.shippingAddress && (
            <div>
              <p className="text-black font-bold text-xs mb-0.5 border-b border-blue-300">SHIP TO</p>
              <div className="text-black text-xs bg-blue-50 p-0.5 rounded border-l-2 border-blue-500 leading-tight">
                <p className="font-semibold text-xs leading-tight">{order.user?.name || order.shippingAddress.name}</p>
                <p className="text-gray-700 text-xs leading-tight">📞 {order.user?.phone || order.shippingAddress.phone}</p>
                <p className="text-gray-700 text-xs leading-tight">{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && (
                  <p className="text-gray-700 text-xs leading-tight">{order.shippingAddress.line2}</p>
                )}
                <p className="text-gray-700 text-xs leading-tight">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Items Table - Compact */}
        <div className="mb-1">
          <p className="text-black font-bold text-xs mb-0.5 border-b border-purple-300">ITEMS</p>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-0.5 py-0.5 text-left font-bold text-xs">Item</th>
                <th className="px-0.5 py-0.5 text-center font-bold text-xs">Qty</th>
                <th className="px-0.5 py-0.5 text-right font-bold text-xs">Price</th>
                <th className="px-0.5 py-0.5 text-right font-bold text-xs">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.slice(0, 3).map((item, idx) => (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="px-0.5 py-0.5 text-black text-xs">{item.product?.title || `Item ${idx + 1}`}</td>
                  <td className="px-0.5 py-0.5 text-center text-black font-semibold text-xs">{item.qty}</td>
                  <td className="px-0.5 py-0.5 text-right text-black text-xs">${item.price.toFixed(2)}</td>
                  <td className="px-0.5 py-0.5 text-right text-black font-semibold text-xs">${(item.price * item.qty).toFixed(2)}</td>
                </tr>
              ))}
              {order.items?.length > 3 && (
                <tr className="border-b border-gray-300">
                  <td colSpan="4" className="px-0.5 py-0.5 text-center text-black text-xs">
                    +{order.items.length - 3} more item(s)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals - Compact */}
        <div className="mb-1 p-1 bg-gray-50 rounded border border-gray-300 text-xs">
          {order.totals && (
            <div className="space-y-0">
              <div className="flex justify-between leading-tight">
                <span className="text-black font-semibold text-xs">Subtotal:</span>
                <span className="text-black font-bold text-xs">${order.totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between leading-tight">
                <span className="text-black font-semibold text-xs">Tax (18%):</span>
                <span className="text-black font-bold text-xs">${order.totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between leading-tight">
                <span className="text-black font-semibold text-xs">Shipping:</span>
                <span className="text-black font-bold text-xs">${order.totals.shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-400 pt-0 flex justify-between bg-purple-600 text-white p-0.5 rounded font-bold text-xs">
                <span>TOTAL:</span>
                <span>${order.totals.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Status & Payment - Compact */}
        <div className="grid grid-cols-2 gap-1 mb-1 text-xs">
          <div className="p-0.5 bg-gray-50 rounded border border-gray-300">
            <p className="text-black font-bold text-xs mb-0.5">Status</p>
            <p className={`px-1 py-0 rounded text-xs font-bold inline-block ${getStatusColor(order.status)}`}>
              {order.status?.toUpperCase() || 'PENDING'}
            </p>
          </div>
          <div className="p-0.5 bg-gray-50 rounded border border-gray-300">
            <p className="text-black font-bold text-xs mb-0.5">Payment</p>
            <p className="text-black text-xs font-semibold">
              {order.payment?.method === 'cod' ? 'Cash on Delivery' : order.payment?.method === 'online' ? 'Online Payment' : 'N/A'}
            </p>
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="border-t border-gray-300 pt-0.5 text-center text-xs">
          <p className="text-black font-semibold text-xs leading-tight">Thank you for your business!</p>
          <p className="text-gray-700 text-xs leading-tight">support@kalaqx.com</p>
        </div>
      </div>
    </div>
  );
}
