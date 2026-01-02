import React from 'react';
import { X, Printer, MapPin, Phone, CreditCard, CheckCircle } from 'lucide-react';

const OrderModal = ({ selectedOrder, showModal, setShowModal, getStatusColor }) => {
  if (!showModal || !selectedOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#e6ddd2]">
        <div className="p-6 border-b border-[#e6ddd2] sticky top-0 bg-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-light italic text-[#3b3b3b] font-serif">Order Invoice</h2>
            <div className="flex gap-2">
              <a
                href={`/print-invoice?orderId=${selectedOrder._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#9c7c3a] hover:bg-[#8a6a2f] text-white rounded-lg transition-colors flex items-center gap-2 font-light italic font-serif"
              >
                <Printer className="w-4 h-4" />
                Print
              </a>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#666] hover:text-[#3b3b3b] text-2xl p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 print:p-0">
          {/* Invoice Header */}
          <div className="border-b-2 border-[#e6ddd2] pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h1 className="text-3xl font-light italic text-[#9c7c3a] font-serif">kalaqx</h1>
                <p className="text-[#666] text-sm italic font-serif">Professional Agriculture E-commerce</p>
              </div>
              <div className="text-right">
                <p className="text-[#3b3b3b] font-light italic font-serif">INVOICE</p>
                <p className="text-[#666] text-sm italic font-serif">Order ID: {selectedOrder._id}</p>
                <p className="text-[#666] text-sm italic font-serif">Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bill From */}
            <div>
              <p className="text-[#3b3b3b] font-light italic text-sm mb-2 font-serif">BILL FROM:</p>
              <div className="text-[#666] text-sm italic font-serif">
                <p className="font-light">kalaqx Platform</p>
                <p>Agricultural E-commerce Services</p>
              </div>
            </div>

            {/* Ship To */}
            {selectedOrder.shippingAddress && (
              <div>
                <p className="text-[#3b3b3b] font-light italic text-sm mb-2 font-serif">SHIP TO:</p>
                <div className="text-[#666] text-sm bg-[#fbf7f2] p-4 rounded-lg border border-[#e6ddd2]">
                  <p className="font-light italic flex items-center gap-2 font-serif">
                    <MapPin className="w-4 h-4 text-[#9c7c3a]" />
                    {selectedOrder.shippingAddress.name}
                  </p>
                  <p className="flex items-center gap-2 italic font-serif">
                    <Phone className="w-4 h-4 text-[#9c7c3a]" />
                    {selectedOrder.shippingAddress.phone}
                  </p>
                  <p className="italic font-serif">{selectedOrder.shippingAddress.line1}</p>
                  {selectedOrder.shippingAddress.line2 && <p className="italic font-serif">{selectedOrder.shippingAddress.line2}</p>}
                  <p className="italic font-serif">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                  <p className="italic font-serif">Pincode: {selectedOrder.shippingAddress.pincode}</p>
                  <p className="italic font-serif">{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Items Table */}
          <div>
            <p className="text-[#3b3b3b] font-light italic text-sm mb-3 font-serif">ORDER ITEMS:</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-[#e6ddd2]">
                <thead>
                  <tr className="bg-[#fbf7f2] border-b border-[#e6ddd2]">
                    <th className="px-4 py-3 text-left text-[#666] italic text-sm font-serif">Item</th>
                    <th className="px-4 py-3 text-center text-[#666] italic text-sm font-serif">Qty</th>
                    <th className="px-4 py-3 text-right text-[#666] italic text-sm font-serif">Price</th>
                    <th className="px-4 py-3 text-right text-[#666] italic text-sm font-serif">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx} className="border-b border-[#e6ddd2]">
                      <td className="px-4 py-3 text-[#3b3b3b] text-sm italic font-serif">{item.product?.title || 'N/A'}</td>
                      <td className="px-4 py-3 text-center text-[#3b3b3b] text-sm italic font-serif">{item.qty}</td>
                      <td className="px-4 py-3 text-right text-[#3b3b3b] text-sm italic font-serif">₹{item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-[#9c7c3a] font-light italic text-sm font-serif">₹{(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          {selectedOrder.totals && (
            <div className="flex justify-end">
              <div className="w-full md:w-64 space-y-2 border border-[#e6ddd2] p-4 rounded-lg bg-[#fbf7f2]">
                <div className="flex justify-between text-[#666] italic font-serif">
                  <span className="font-light">Subtotal:</span>
                  <span className="italic">₹{selectedOrder.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#666] italic font-serif">
                  <span className="font-light">Tax (18% GST):</span>
                  <span className="italic">₹{selectedOrder.totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#666] italic font-serif">
                  <span className="font-light">Shipping:</span>
                  <span className="italic">₹{selectedOrder.totals.shipping.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-[#e6ddd2] pt-2 flex justify-between text-[#3b3b3b]">
                  <span className="font-light italic text-lg font-serif">Total:</span>
                  <span className="font-light italic text-lg text-[#9c7c3a] font-serif">₹{selectedOrder.totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Status & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-[#e6ddd2]">
            <div>
              <p className="text-[#3b3b3b] font-light italic text-sm mb-2 font-serif">Status:</p>
              <span className={`px-3 py-1 rounded-full text-xs font-light italic font-serif ${getStatusColor(selectedOrder.status)}`}>
                {selectedOrder.status}
              </span>
            </div>
            <div>
              <p className="text-[#3b3b3b] font-light italic text-sm mb-2 flex items-center gap-2 font-serif">
                <CreditCard className="w-4 h-4 text-[#9c7c3a]" />
                Payment Method:
              </p>
              <p className="text-[#666] text-sm italic font-serif">{selectedOrder.payment?.method || 'N/A'}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-[#666] text-xs pt-4 border-t border-[#e6ddd2] print:text-[#3b3b3b] print:text-center italic font-serif">
            <p>Thank you for your business!</p>
            <p>For support, contact: support@kalaqx.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;