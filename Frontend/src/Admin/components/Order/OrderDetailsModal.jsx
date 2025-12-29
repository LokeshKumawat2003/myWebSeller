import React from 'react';
import { X, Printer, DollarSign, MapPin, Phone, CreditCard } from 'lucide-react';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'packed': return 'bg-orange-100 text-orange-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Order Invoice</h2>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Invoice Header */}
          <div className="border-b-2 border-gray-300 pb-4">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h1 className="text-3xl font-bold text-indigo-600">AgriMart</h1>
                <p className="text-gray-600 text-sm">Professional Agriculture E-commerce</p>
              </div>
              <div className="text-right">
                <p className="text-gray-900 font-semibold">INVOICE</p>
                <p className="text-gray-600 text-sm">Order ID: {order._id}</p>
                <p className="text-gray-600 text-sm">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-2 gap-8">
            {/* Bill From */}
            <div>
              <p className="text-gray-900 font-semibold text-sm mb-3">BILL FROM:</p>
              <div className="text-gray-700 text-sm">
                <p className="font-semibold">AgriMart Platform</p>
                <p>Agricultural E-commerce Services</p>
              </div>
            </div>

            {/* Ship To */}
            {order.shippingAddress && (
              <div>
                <p className="text-gray-900 font-semibold text-sm mb-3">SHIP TO:</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{order.shippingAddress.name}</p>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{order.shippingAddress.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <div>
                        <p>{order.shippingAddress.line1}</p>
                        {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                        <p>Pincode: {order.shippingAddress.pincode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Items Table */}
          <div>
            <p className="text-gray-900 font-semibold text-sm mb-4">ORDER ITEMS:</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-300">
                    <th className="px-4 py-3 text-left text-gray-900 font-semibold text-sm">Item</th>
                    <th className="px-4 py-3 text-center text-gray-900 font-semibold text-sm">Qty</th>
                    <th className="px-4 py-3 text-right text-gray-900 font-semibold text-sm">Price</th>
                    <th className="px-4 py-3 text-right text-gray-900 font-semibold text-sm">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 text-sm">{item.product?.title || 'N/A'}</td>
                      <td className="px-4 py-3 text-center text-gray-900 text-sm">{item.qty}</td>
                      <td className="px-4 py-3 text-right text-gray-900 text-sm">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-gray-900 font-semibold text-sm">${(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          {order.totals && (
            <div className="flex justify-end">
              <div className="w-80 space-y-3 border border-gray-300 p-4 rounded-lg bg-gray-50">
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Subtotal:</span>
                  <span>${order.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Tax (18% GST):</span>
                  <span>${order.totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Shipping:</span>
                  <span>${order.totals.shipping.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-3 flex justify-between text-gray-900">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-bold text-lg text-indigo-600">${order.totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Status & Payment */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-300">
            <div>
              <p className="text-gray-900 font-semibold text-sm mb-2">Order Status:</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm mb-2">Payment Method:</p>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">{order.payment?.method || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600 text-sm pt-4 border-t border-gray-300">
            <p className="font-medium">Thank you for your business!</p>
            <p>For support, contact: support@agrimart.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;