import React from 'react';
import Logo from './Logo';

export default function InvoicePrint({ order }) {
  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#fbf7f2]">
        <p className="text-[#3b3b3b] text-xl">No order data available</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-[#fbf7f2] text-[#9c7c3a]';
      case 'packed': return 'bg-[#fbf7f2] text-[#9c7c3a]';
      case 'shipped': return 'bg-[#fbf7f2] text-[#9c7c3a]';
      case 'out_for_delivery': return 'bg-[#fbf7f2] text-[#9c7c3a]';
      case 'delivered': return 'bg-[#9c7c3a] text-white';
      case 'cancelled': return 'bg-[#e6ddd2] text-[#3b3b3b]';
      default: return 'bg-[#fbf7f2] text-[#3b3b3b]';
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf7f2] p-4 print:bg-white print:p-0">
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
          className="px-6 py-2 bg-[#9c7c3a] hover:bg-[#8a6a2f] text-white font-semibold rounded-lg transition text-sm font-serif"
        >
          🖨️ Print Invoice
        </button>
      </div>

      {/* A4 Half Page Invoice Container */}
      <div className="print-container max-w-2xl mx-auto bg-white border print:border-0 print:shadow-none shadow-lg rounded-lg print:rounded-none print-invoice p-2.5">
        {/* Header - Compact */}
        <div className="border-b border-[#e6ddd2] pb-1 mb-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <div>
                <h1 className="text-lg font-serif font-medium text-[#9c7c3a] leading-tight">kalaqx</h1>
                <p className="text-[#666] font-serif text-xs leading-tight">Agriculture E-commerce</p>
              </div>
            </div>
            <div className="text-right text-xs">
              <p className="font-serif font-bold text-[#3b3b3b] leading-tight">INVOICE</p>
              <p className="text-[#3b3b3b] font-serif text-xs leading-tight">ID: {order._id?.substring(0, 12)}</p>
              <p className="text-[#3b3b3b] font-serif text-xs leading-tight">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Bill From & Ship To - Compact */}
        <div className="grid grid-cols-2 gap-2 mb-1 text-xs">
          {/* Bill From */}
          <div>
            <p className="text-[#3b3b3b] font-serif font-bold text-xs mb-0.5 border-b border-[#e6ddd2]">BILL FROM</p>
            <div className="text-[#3b3b3b]">
              <p className="font-serif font-semibold leading-tight text-xs">kalaqx</p>
              <p className="text-[#666] font-serif text-xs leading-tight">E-commerce</p>
            </div>
          </div>

          {/* Ship To */}
          {order.shippingAddress && (
            <div>
              <p className="text-[#3b3b3b] font-serif font-bold text-xs mb-0.5 border-b border-[#e6ddd2]">SHIP TO</p>
              <div className="text-[#3b3b3b] text-xs bg-[#fbf7f2] p-0.5 rounded border-l-2 border-[#9c7c3a] leading-tight">
                <p className="font-serif font-semibold text-xs leading-tight">{order.user?.name || order.shippingAddress.name}</p>
                <p className="text-[#666] font-serif text-xs leading-tight">📞 {order.user?.phone || order.shippingAddress.phone}</p>
                <p className="text-[#666] font-serif text-xs leading-tight">{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && (
                  <p className="text-[#666] font-serif text-xs leading-tight">{order.shippingAddress.line2}</p>
                )}
                <p className="text-[#666] font-serif text-xs leading-tight">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Items Table - Compact */}
        <div className="mb-1">
          <p className="text-[#3b3b3b] font-serif font-bold text-xs mb-0.5 border-b border-[#e6ddd2]">ITEMS</p>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#9c7c3a] text-white">
                <th className="px-0.5 py-0.5 text-left font-serif font-bold text-xs">Item</th>
                <th className="px-0.5 py-0.5 text-center font-serif font-bold text-xs">Qty</th>
                <th className="px-0.5 py-0.5 text-right font-serif font-bold text-xs">Price</th>
                <th className="px-0.5 py-0.5 text-right font-serif font-bold text-xs">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.slice(0, 3).map((item, idx) => (
                <tr key={idx} className="border-b border-[#e6ddd2]">
                  <td className="px-0.5 py-0.5 text-[#3b3b3b] font-serif text-xs">{item.product?.title || `Item ${idx + 1}`}</td>
                  <td className="px-0.5 py-0.5 text-center text-[#3b3b3b] font-serif font-semibold text-xs">{item.qty}</td>
                  <td className="px-0.5 py-0.5 text-right text-[#3b3b3b] font-serif text-xs">${item.price.toFixed(2)}</td>
                  <td className="px-0.5 py-0.5 text-right text-[#3b3b3b] font-serif font-semibold text-xs">${(item.price * item.qty).toFixed(2)}</td>
                  <td className="px-0.5 py-0.5 text-right text-black text-xs">${item.price.toFixed(2)}</td>
                  <td className="px-0.5 py-0.5 text-right text-black font-semibold text-xs">${(item.price * item.qty).toFixed(2)}</td>
                </tr>
              ))}
              {order.items?.length > 3 && (
                <tr className="border-b border-[#e6ddd2]">
                  <td colSpan="4" className="px-0.5 py-0.5 text-center text-[#3b3b3b] font-serif text-xs">
                    +{order.items.length - 3} more item(s)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals - Compact */}
        <div className="mb-1 p-1 bg-[#fbf7f2] rounded border border-[#e6ddd2] text-xs">
          {order.totals && (
            <div className="space-y-0">
              <div className="flex justify-between leading-tight">
                <span className="text-[#3b3b3b] font-serif font-semibold text-xs">Subtotal:</span>
                <span className="text-[#3b3b3b] font-serif font-bold text-xs">${order.totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between leading-tight">
                <span className="text-[#3b3b3b] font-serif font-semibold text-xs">Tax (18%):</span>
                <span className="text-[#3b3b3b] font-serif font-bold text-xs">${order.totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between leading-tight">
                <span className="text-[#3b3b3b] font-serif font-semibold text-xs">Shipping:</span>
                <span className="text-[#3b3b3b] font-serif font-bold text-xs">${order.totals.shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#e6ddd2] pt-0 flex justify-between bg-[#9c7c3a] text-white p-0.5 rounded font-serif font-bold text-xs">
                <span>TOTAL:</span>
                <span>${order.totals.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Status & Payment - Compact */}
        <div className="grid grid-cols-2 gap-1 mb-1 text-xs">
          <div className="p-0.5 bg-[#fbf7f2] rounded border border-[#e6ddd2]">
            <p className="text-[#3b3b3b] font-serif font-bold text-xs mb-0.5">Status</p>
            <p className={`px-1 py-0 rounded text-xs font-serif font-bold inline-block ${getStatusColor(order.status)}`}>
              {order.status?.toUpperCase() || 'PENDING'}
            </p>
          </div>
          <div className="p-0.5 bg-[#fbf7f2] rounded border border-[#e6ddd2]">
            <p className="text-[#3b3b3b] font-serif font-bold text-xs mb-0.5">Payment</p>
            <p className="text-[#3b3b3b] font-serif text-xs font-semibold">
              {order.payment?.method === 'cod' ? 'Cash on Delivery' : order.payment?.method === 'online' ? 'Online Payment' : 'N/A'}
            </p>
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="border-t border-[#e6ddd2] pt-0.5 text-center text-xs">
          <p className="text-[#3b3b3b] font-serif font-semibold text-xs leading-tight">Thank you for your business!</p>
          <p className="text-[#666] font-serif text-xs leading-tight">support@kalaqx.com</p>
        </div>
      </div>
    </div>
  );
}
