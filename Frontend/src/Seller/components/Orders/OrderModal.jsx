import React from 'react';
import { X, Printer, MapPin, Phone, CreditCard, CheckCircle } from 'lucide-react';

const OrderModal = ({ selectedOrder, showModal, setShowModal, getStatusColor }) => {
  if (!showModal || !selectedOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Order Invoice</h2>
            <div className="flex gap-2">
              <a
                href={`/print-invoice?orderId=${selectedOrder._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </a>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 print:p-0">
          {/* Invoice Header */}
          <div className="border-b-2 border-gray-300 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h1 className="text-3xl font-bold text-purple-600">AgriMart</h1>
                <p className="text-gray-600 text-sm">Professional Agriculture E-commerce</p>
              </div>
              <div className="text-right">
                <p className="text-gray-800 font-semibold">INVOICE</p>
                <p className="text-gray-700 text-sm">Order ID: {selectedOrder._id}</p>
                <p className="text-gray-700 text-sm">Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bill From */}
            <div>
              <p className="text-gray-800 font-bold text-sm mb-2">BILL FROM:</p>
              <div className="text-gray-700 text-sm">
                <p className="font-semibold">AgriMart Platform</p>
                <p>Agricultural E-commerce Services</p>
              </div>
            </div>

            {/* Ship To */}
            {selectedOrder.shippingAddress && (
              <div>
                <p className="text-gray-800 font-bold text-sm mb-2">SHIP TO:</p>
                <div className="text-gray-700 text-sm bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedOrder.shippingAddress.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {selectedOrder.shippingAddress.phone}
                  </p>
                  <p>{selectedOrder.shippingAddress.line1}</p>
                  {selectedOrder.shippingAddress.line2 && <p>{selectedOrder.shippingAddress.line2}</p>}
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                  <p>Pincode: {selectedOrder.shippingAddress.pincode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Items Table */}
          <div>
            <p className="text-gray-800 font-bold text-sm mb-3">ORDER ITEMS:</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="px-4 py-3 text-left text-gray-800 font-semibold text-sm">Item</th>
                    <th className="px-4 py-3 text-center text-gray-800 font-semibold text-sm">Qty</th>
                    <th className="px-4 py-3 text-right text-gray-800 font-semibold text-sm">Price</th>
                    <th className="px-4 py-3 text-right text-gray-800 font-semibold text-sm">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="px-4 py-3 text-gray-800 text-sm">{item.product?.title || 'N/A'}</td>
                      <td className="px-4 py-3 text-center text-gray-800 text-sm">{item.qty}</td>
                      <td className="px-4 py-3 text-right text-gray-800 text-sm">₹{item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-gray-800 font-semibold text-sm">₹{(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          {selectedOrder.totals && (
            <div className="flex justify-end">
              <div className="w-full md:w-64 space-y-2 border border-gray-300 p-4 rounded-lg bg-gray-50">
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Subtotal:</span>
                  <span>₹{selectedOrder.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Tax (18% GST):</span>
                  <span>₹{selectedOrder.totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Shipping:</span>
                  <span>₹{selectedOrder.totals.shipping.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-2 flex justify-between text-gray-800">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-bold text-lg text-purple-600">₹{selectedOrder.totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Status & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t-2 border-gray-300">
            <div>
              <p className="text-gray-800 font-semibold text-sm mb-2">Status:</p>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                {selectedOrder.status}
              </span>
            </div>
            <div>
              <p className="text-gray-800 font-semibold text-sm mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Method:
              </p>
              <p className="text-gray-700 text-sm">{selectedOrder.payment?.method || 'N/A'}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600 text-xs pt-4 border-t border-gray-300 print:text-gray-800 print:text-center">
            <p>Thank you for your business!</p>
            <p>For support, contact: support@agrimart.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;