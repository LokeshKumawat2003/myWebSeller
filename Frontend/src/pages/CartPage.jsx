import React, { useState, useEffect } from 'react';
import { getCart, deleteCartItem, updateCartItem, checkoutOrder, getAuthToken } from '../services/api';
import AddressManagement from '../MainWeb/components/AddressManagement';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await getCart();
      // Handle both direct array response and object with items property
      if (Array.isArray(data)) {
        setCartItems(data);
      } else if (data && data.items && Array.isArray(data.items)) {
        setCartItems(data.items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      setError('Failed to load cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await deleteCartItem(itemId);
      setCartItems(cartItems.filter(item => item._id !== itemId));
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  const handleUpdateQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartItem(itemId, { qty: newQty });
      setCartItems(cartItems.map(item =>
        item._id === itemId ? { ...item, qty: newQty } : item
      ));
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await checkoutOrder({
        items: cartItems.map(item => ({
          product: item.product?._id || item.product,
          seller: item.seller?._id || item.seller,
          qty: item.qty,
          price: item.price
        })),
        shippingAddress,
        payment: {
          method: paymentMethod,
          status: paymentMethod === 'cod' ? 'pending' : 'paid'
        }
      });
      alert('Order placed successfully! Order ID: ' + response.order._id);
      setCartItems([]);
      setShowCheckout(false);
      // Redirect to orders page
      window.location.href = '/user-dashboard?tab=orders';
    } catch (err) {
      setError(err.message || 'Checkout failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + tax + shipping;

  if (!getAuthToken()) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow p-8 max-w-md w-full text-center">
          <p className="text-black text-lg mb-4">Please login to view your cart</p>
          <a href="/user-login" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <a href="/user-dashboard" className="text-2xl font-bold text-purple-600">
            🛒 Shopping Cart
          </a>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-black py-8">Loading...</p>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-black">Items ({cartItems.length})</h2>
              </div>
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-6 flex gap-4">
                    {item.product?.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product?.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    {!item.product?.images?.[0] && (
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-2xl">
                        🛍️
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-black">{item.product?.title || 'Product'}</h3>
                      <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQty(item._id, item.qty - 1)}
                        className="px-2 py-1 border rounded text-black hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="text-black font-semibold w-8 text-center">{item.qty}</span>
                      <button
                        onClick={() => handleUpdateQty(item._id, item.qty + 1)}
                        className="px-2 py-1 border rounded text-black hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-black font-bold">${(item.price * item.qty).toFixed(2)}</p>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6 h-fit">
              <h2 className="text-2xl font-bold text-black mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-black">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-black">
                  <span>Tax (18%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-black">
                  <span>Shipping:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-xl font-bold text-black mb-6">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg"
              >
                Proceed to Checkout
              </button>
              <a href="/user-dashboard" className="block text-center mt-3 text-purple-600 hover:text-purple-700 font-semibold">
                Continue Shopping
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-black text-xl mb-4">Your cart is empty</p>
            <a href="/user-dashboard" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Start Shopping
            </a>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-black">Shipping Address</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-500 hover:text-black text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={shippingAddress.name}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                  required
                  className="col-span-2 px-4 py-2 border rounded-lg text-black placeholder-gray-500"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  required
                  className="col-span-2 px-4 py-2 border rounded-lg text-black placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={shippingAddress.line1}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                  required
                  className="col-span-2 px-4 py-2 border rounded-lg text-black placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={shippingAddress.line2}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, line2: e.target.value })}
                  className="col-span-2 px-4 py-2 border rounded-lg text-black placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  required
                  className="px-4 py-2 border rounded-lg text-black placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  required
                  className="px-4 py-2 border rounded-lg text-black placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={shippingAddress.pincode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                  required
                  className="col-span-2 px-4 py-2 border rounded-lg text-black placeholder-gray-500"
                />
              </div>

              {/* Payment Method Selection */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-3">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <span className="text-black font-medium">Cash on Delivery (COD)</span>
                      <p className="text-gray-600 text-sm">Pay when you receive your order</p>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <span className="text-black font-medium">Online Payment</span>
                      <p className="text-gray-600 text-sm">Pay securely with card/UPI/wallet</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between text-black mb-2">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-black mb-2">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-black mb-4">
                  <span>Shipping:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-black border-t pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold rounded-lg"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
