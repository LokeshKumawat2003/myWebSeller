import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getCart, deleteCartItem, updateCartItem, getAuthToken } from '../../services/api';
import { useToast } from '../../Admin/components/UI';
import { ShoppingBag, Trash2, Plus, Minus, CreditCard } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const token = getAuthToken();
      let cartData = [];

      if (token) {
        try {
          const data = await getCart(token);
          if (Array.isArray(data)) {
            cartData = data;
          } else if (data && data.items && Array.isArray(data.items)) {
            cartData = data.items;
          }
        } catch (apiErr) {
          console.log('API call failed, no cart data available');
        }
      }

      setCartItems(cartData);
    } catch (err) {
      setError('Failed to load cart');
      console.error(err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQty = async (itemId, newQty) => {
    if (newQty < 1) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      const token = getAuthToken();
      if (!token) {
        showError('Please login to update cart');
        return;
      }

      await updateCartItem(itemId, { qty: newQty }, token);
      setCartItems(cartItems.map(item =>
        item._id === itemId ? { ...item, qty: newQty } : item
      ));
      showSuccess('Cart updated successfully');
    } catch (err) {
      showError('Failed to update quantity');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleOpenCheckout = () => {
    navigate('/checkout');
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        showError('Please login to remove items from cart');
        return;
      }

      await deleteCartItem(itemId, token);
      setCartItems(cartItems.filter(item => item._id !== itemId));
      showSuccess('Item removed from cart');
    } catch (err) {
      showError('Failed to remove item');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + tax + shipping;

  if (!getAuthToken()) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center bg-white rounded-2xl shadow-lg p-4 md:p-6 max-w-md w-full border border-[#e6ddd2]">
            <div className="text-3xl md:text-4xl mb-4">🔒</div>
            <h2 className="text-lg md:text-xl font-serif font-medium text-[#9c7c3a] mb-3 tracking-[1px]">Please Login</h2>
            <p className="text-[#3b3b3b] mb-4 font-sans text-xs md:text-sm">You need to be logged in to view your cart</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-[#9c7c3a] text-[#fbf7f2] rounded-lg hover:bg-[#8a6a2f] transition-colors font-serif font-medium tracking-[0.5px] text-xs md:text-sm"
            >
              Login to Continue
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-[#fbf7f2] min-h-screen">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6">
          {/* Header */}
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-serif font-medium text-[#9c7c3a] flex items-center gap-2 tracking-[1px]">
              {/* <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-[#9c7c3a]" /> */}
              Shopping Cart
              {cartItems.length > 0 && (
                <span className="bg-[#9c7c3a] text-[#fbf7f2] px-2 py-1 rounded-full text-xs font-serif font-medium">
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                </span>
              )}
            </h1>
          </div>

          {error && (
            <div className="mb-3 md:mb-4 p-2 md:p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg font-sans text-xs md:text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8 md:py-12">
              <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-b-2 border-[#9c7c3a]"></div>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3">
                {cartItems.map((item) => (
                  <div key={item._id} className="bg-white rounded-xl shadow-sm border border-[#e6ddd2] p-3 md:p-4">
                    <div className="flex gap-2 md:gap-3">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {item.product?.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product?.title}
                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#fbf7f2] rounded-lg flex items-center justify-center border border-[#e6ddd2]">
                            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-[#9c7c3a]" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-base font-serif font-medium text-[#9c7c3a] truncate tracking-[0.5px]">
                          {item.product?.title || 'Product'}
                        </h3>
                        <p className="text-[#3b3b3b] text-xs mt-1 font-sans">
                          ₹{(item.price || 0).toFixed(2)} each
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2 md:mt-3">
                          <div className="flex items-center border border-[#e6ddd2] rounded-lg bg-[#fbf7f2]">
                            <button
                              onClick={() => handleUpdateQty(item._id, item.qty - 1)}
                              disabled={updatingItems.has(item._id) || item.qty <= 1}
                              className="p-1.5 md:p-2 hover:bg-[#e6ddd2] disabled:hover:bg-transparent disabled:opacity-50 text-[#9c7c3a] transition-colors"
                            >
                              <Minus className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                            <span className="px-3 md:px-4 py-2 font-serif font-medium min-w-[2.5rem] md:min-w-[3rem] text-center text-[#9c7c3a] text-sm md:text-base">
                              {updatingItems.has(item._id) ? '...' : item.qty}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(item._id, item.qty + 1)}
                              disabled={updatingItems.has(item._id) || item.qty >= Math.min(3, item.variant?.stock || 1)}
                              className="p-1.5 md:p-2 hover:bg-[#e6ddd2] disabled:hover:bg-transparent disabled:opacity-50 text-[#9c7c3a] transition-colors"
                            >
                              <Plus className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>

                          {item.variant?.stock && (
                            <span className="text-xs text-[#3b3b3b] font-sans">
                              Max {Math.min(3, item.variant.stock)}
                            </span>
                          )}

                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-sans text-xs"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span className="font-medium">Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-base md:text-lg font-serif font-medium text-[#9c7c3a] tracking-[0.5px]">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-[#e6ddd2] p-4 md:p-5 sticky top-4">
                  <h2 className="text-base md:text-lg font-serif font-medium text-[#9c7c3a] mb-4 tracking-[0.5px]">Order Summary</h2>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-[#3b3b3b] font-sans text-xs md:text-sm">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#3b3b3b] font-sans text-xs md:text-sm">
                      <span>Tax (18%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#3b3b3b] font-sans text-xs md:text-sm">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-[#e6ddd2] pt-2">
                      <div className="flex justify-between text-base md:text-lg font-serif font-medium text-[#9c7c3a] tracking-[0.5px]">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleOpenCheckout}
                    className="w-full bg-[#9c7c3a] hover:bg-[#8a6a2f] text-[#fbf7f2] font-serif font-medium py-2 md:py-2.5 px-3 md:px-4 rounded-lg transition-colors flex items-center justify-center gap-2 tracking-[0.5px] mb-2 md:mb-3 text-xs md:text-sm"
                  >
                    <CreditCard className="w-3 h-3 md:w-4 md:h-4" />
                    Proceed to Checkout
                  </button>

                  <Link
                    to="/"
                    className="block text-center text-[#9c7c3a] hover:text-[#8a6a2f] font-serif font-medium transition-colors tracking-[0.5px] text-xs md:text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 md:py-12 bg-white rounded-xl shadow-sm border border-[#e6ddd2]">
              <div className="text-3xl md:text-4xl mb-4">🛒</div>
              <h2 className="text-lg md:text-xl font-serif font-medium text-[#9c7c3a] mb-3 tracking-[1px]">Your cart is empty</h2>
              <p className="text-[#3b3b3b] mb-6 font-sans text-xs md:text-sm">Add some amazing products to get started!</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-[#9c7c3a] text-[#fbf7f2] rounded-lg hover:bg-[#8a6a2f] transition-colors font-serif font-medium tracking-[0.5px] text-xs md:text-sm"
              >
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}