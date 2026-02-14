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
      <div className="luxury-bg rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 luxury-border sticky top-0 luxury-bg rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold luxury-text-primary">Order Invoice</h2>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 luxury-accent hover:bg-luxury-accent text-white rounded-lg font-medium transition-colors"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              <button
                onClick={onClose}
                className="p-2 luxury-text-secondary hover:luxury-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Invoice Header */}
          <div className="border-b-2 luxury-border pb-4">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h1 className="text-3xl font-bold luxury-accent">kalaqx</h1>
                <p className="luxury-text-secondary text-sm">Professional Agriculture E-commerce</p>
              </div>
              <div className="text-right">
                <p className="luxury-text-primary font-semibold">INVOICE</p>
                <p className="luxury-text-secondary text-sm">Order ID: {order._id}</p>
                <p className="luxury-text-secondary text-sm">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-2 gap-8">
            {/* Bill From */}
            <div>
              <p className="luxury-text-primary font-semibold text-sm mb-3">BILL FROM:</p>
              <div className="luxury-text-secondary text-sm">
                <p className="font-semibold">kalaqx Platform</p>
                <p>Agricultural E-commerce Services</p>
              </div>
            </div>

            {/* Ship To */}
            {order.shippingAddress && (
              <div>
                <p className="luxury-text-primary font-semibold text-sm mb-3">SHIP TO:</p>
                <div className="luxury-bg-secondary p-4 rounded-lg">
                  <p className="font-semibold luxury-text-primary mb-2">{order.shippingAddress.name}</p>
                  <div className="space-y-1 text-sm luxury-text-secondary">
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
            <p className="luxury-text-primary font-semibold text-sm mb-4">ORDER ITEMS:</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse luxury-border">
                <thead>
                  <tr className="luxury-bg-secondary luxury-border">
                    <th className="px-4 py-3 text-left luxury-text-primary font-semibold text-sm">Item</th>
                    <th className="px-4 py-3 text-center luxury-text-primary font-semibold text-sm">Qty</th>
                    <th className="px-4 py-3 text-right luxury-text-primary font-semibold text-sm">Price</th>
                    <th className="px-4 py-3 text-right luxury-text-primary font-semibold text-sm">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="luxury-border hover:bg-luxury-bg-secondary">
                      <td className="px-4 py-3 luxury-text-primary text-sm">{item.product?.title || 'N/A'}</td>
                      <td className="px-4 py-3 text-center luxury-text-primary text-sm">{item.qty}</td>
                      <td className="px-4 py-3 text-right luxury-text-primary text-sm">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right luxury-text-primary font-semibold text-sm">${(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          {order.totals && (
            <div className="flex justify-end">
              <div className="w-80 space-y-3 luxury-border p-4 rounded-lg luxury-bg-secondary">
                <div className="flex justify-between luxury-text-secondary">
                  <span className="font-medium">Subtotal:</span>
                  <span>${order.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between luxury-text-secondary">
                  <span className="font-medium">Tax (18% GST):</span>
                  <span>${order.totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between luxury-text-secondary">
                  <span className="font-medium">Shipping:</span>
                  <span>${order.totals.shipping.toFixed(2)}</span>
                </div>
                <div className="border-t-2 luxury-border pt-3 flex justify-between luxury-text-primary">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-bold text-lg luxury-accent">${order.totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Status & Payment */}
          <div className="grid grid-cols-2 gap-6 pt-4 luxury-border">
            <div>
              <p className="luxury-text-primary font-semibold text-sm mb-2">Order Status:</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div>
              <p className="luxury-text-primary font-semibold text-sm mb-2">Payment Method:</p>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 luxury-text-secondary" />
                <span className="luxury-text-secondary">{order.payment?.method || 'N/A'}</span>
              </div>
            </div>
          </div>

          {order.awb && (
            <div className="pt-4 luxury-border">
              <p className="luxury-text-primary font-semibold text-sm mb-2">Shipping Details:</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="luxury-text-secondary text-sm">AWB Number:</p>
                  <p className="font-medium">{order.awb}</p>
                </div>
                <div>
                  <p className="luxury-text-secondary text-sm">Courier:</p>
                  <p className="font-medium">{order.courierName || 'N/A'}</p>
                </div>
              </div>
              {order.trackingUrl && (
                <div className="mt-2">
                  <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 bg-luxury-accent hover:bg-luxury-accent-hover text-white rounded-lg text-sm font-medium transition-colors">
                    Track Shipment
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="text-center luxury-text-secondary text-sm pt-4 luxury-border">
            <p className="font-medium">Thank you for your business!</p>
            <p>For support, contact: support@kalaqx.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;