import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const location = useLocation();
  const { orderId, orderDetails, cartItems, shippingAddress, paymentMethod } = location.state || {};

  const subtotal = cartItems?.reduce((sum, item) => sum + (item.price * item.qty), 0) || 0;
  const tax = subtotal * 0.18;
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + tax + shipping;

  return (
    <Layout>
      <div className="min-h-screen bg-[#fbf7f2]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#9c7c3a] rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-[#fbf7f2]" />
            </div>
            <h1 className="text-3xl font-serif font-medium text-[#9c7c3a] mb-2 tracking-[2px]">Order Placed Successfully!</h1>
            <p className="text-[#3b3b3b] font-sans">Thank you for your purchase. Your order has been confirmed.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="space-y-6">
              {/* Order Info */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e6ddd2]">
                <h2 className="text-xl font-serif font-medium text-[#9c7c3a] mb-4 flex items-center gap-2 tracking-[1px]">
                  <Package className="w-5 h-5 text-[#9c7c3a]" />
                  Order Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#3b3b3b] font-sans">Order ID:</span>
                    <span className="font-serif font-medium text-[#9c7c3a]">{orderId || 'DEMO-' + Date.now()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3b3b3b] font-sans">Order Date:</span>
                    <span className="font-serif font-medium text-[#9c7c3a]">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3b3b3b] font-sans">Payment Method:</span>
                    <span className="font-serif font-medium text-[#9c7c3a]">
                      {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3b3b3b] font-sans">Status:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-serif font-medium bg-[#9c7c3a] text-[#fbf7f2]">
                      Processing
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e6ddd2]">
                <h2 className="text-xl font-serif font-medium text-[#9c7c3a] mb-4 flex items-center gap-2 tracking-[1px]">
                  <Truck className="w-5 h-5 text-[#9c7c3a]" />
                  Shipping Address
                </h2>
                {shippingAddress && (
                  <div className="text-[#3b3b3b] font-sans">
                    <p className="font-serif font-medium text-[#9c7c3a]">{shippingAddress.name}</p>
                    <p>{shippingAddress.line1}</p>
                    {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                    <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
                    {shippingAddress.phone && <p className="mt-2">📞 {shippingAddress.phone}</p>}
                    {shippingAddress.email && <p>✉️ {shippingAddress.email}</p>}
                  </div>
                )}
              </div>

              {/* What's Next */}
              <div className="bg-[#9c7c3a] rounded-xl p-6">
                <h3 className="text-lg font-serif font-medium text-[#fbf7f2] mb-3 tracking-[1px]">What's Next?</h3>
                <div className="space-y-3 text-[#fbf7f2] font-sans">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#fbf7f2] rounded-full flex items-center justify-center text-sm font-serif font-bold text-[#9c7c3a]">1</div>
                    <div>
                      <p className="font-serif font-medium">Order Processing</p>
                      <p className="text-sm">We're preparing your order for shipment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#fbf7f2] rounded-full flex items-center justify-center text-sm font-serif font-bold text-[#9c7c3a]">2</div>
                    <div>
                      <p className="font-serif font-medium">Shipping</p>
                      <p className="text-sm">Your order will be shipped within 2-3 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#fbf7f2] rounded-full flex items-center justify-center text-sm font-serif font-bold text-[#9c7c3a]">3</div>
                    <div>
                      <p className="font-serif font-medium">Delivery</p>
                      <p className="text-sm">Track your package and get delivery updates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e6ddd2]">
                <h3 className="text-xl font-serif font-medium text-[#9c7c3a] mb-4 tracking-[1px]">Order Summary</h3>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {cartItems?.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <img
                        src={item.product?.images?.[0] || '/placeholder.jpg'}
                        alt={item.product?.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-serif font-medium text-[#9c7c3a] truncate">
                          {item.product?.title || 'Product'}
                        </h4>
                        <p className="text-sm text-[#3b3b3b] font-sans">Qty: {item.qty}</p>
                      </div>
                      <p className="text-sm font-serif font-medium text-[#9c7c3a]">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-[#e6ddd2] pt-4 space-y-2">
                  <div className="flex justify-between text-sm font-sans text-[#3b3b3b]">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-sans text-[#3b3b3b]">
                    <span>Tax (18%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-sans text-[#3b3b3b]">
                    <span>Shipping:</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-serif font-medium border-t border-[#e6ddd2] pt-2 text-[#9c7c3a]">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  to="/orders"
                  className="block w-full bg-[#9c7c3a] hover:bg-[#8a6a2f] text-[#fbf7f2] font-serif font-medium py-3 px-6 rounded-lg transition-colors text-center tracking-[0.5px]"
                >
                  View My Orders
                </Link>
                <Link
                  to="/"
                  className="block w-full bg-[#fbf7f2] hover:bg-[#e6ddd2] text-[#9c7c3a] font-serif font-medium py-3 px-6 rounded-lg transition-colors text-center flex items-center justify-center gap-2 border-2 border-[#9c7c3a] tracking-[0.5px]"
                >
                  <Home className="w-5 h-5" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}