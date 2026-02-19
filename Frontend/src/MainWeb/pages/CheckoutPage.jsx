import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useToast } from '../../Admin/components/UI';
import { getCart, checkoutOrder, getAuthToken, getUserAddresses, addUserAddress, updateUserAddress, createRazorpayOrder, verifyRazorpayPayment, getRazorpayKey } from '../../services/api';
import AddressManagement from '../components/AddressManagement';
import Logo from '../../components/Logo';
import { ArrowLeft, Truck, CreditCard, CheckCircle, MapPin, Phone, Mail, ShoppingBag, Plus, Minus } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showAddressManagement, setShowAddressManagement] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    email: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    loadCart();
    loadSavedAddresses();
  }, []);

  const loadCart = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const data = await getCart(token);
      if (Array.isArray(data) && data.length > 0) {
        setCartItems(data);
      } else if (data && data.items && Array.isArray(data.items) && data.items.length > 0) {
        setCartItems(data.items);
      } else {
        navigate('/shopping-cart');
        return;
      }
    } catch (err) {
      setError('Failed to load cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const token = getAuthToken();
      if (!token) return;

      const addresses = await getUserAddresses(token);
      if (Array.isArray(addresses)) {
        setSavedAddresses(addresses);

        // Always try to select an address if addresses exist
        if (addresses.length > 0) {
          let addressToSelect = null;

          // First, try last used address
          const lastUsedAddressId = localStorage.getItem('lastUsedAddressId');
          if (lastUsedAddressId) {
            addressToSelect = addresses.find(addr => (addr.id || addr._id) === lastUsedAddressId);
          }

          // If last used not found or no last used, use default or first
          if (!addressToSelect) {
            addressToSelect = addresses.find(addr => addr.isDefault);
            if (!addressToSelect) {
              addressToSelect = addresses[0];
            }
          }

          if (addressToSelect) {
            setSelectedAddress(addressToSelect);
            setShippingAddress({
              name: addressToSelect.name,
              phone: addressToSelect.phone,
              email: addressToSelect.email || '',
              line1: addressToSelect.line1,
              line2: addressToSelect.line2 || '',
              city: addressToSelect.city,
              state: addressToSelect.state,
              pincode: addressToSelect.pincode,
              country: addressToSelect.country || 'India'
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.line1 ||
      !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      showError('Please fill in all required fields');
      return;
    }

    setError('');
    setProcessing(true);

    try {
      const token = getAuthToken();

      let savedAddress;
      const addressId = selectedAddress?.id || selectedAddress?._id;
      if (selectedAddress && addressId && addressId !== 'temp') {
        // Update existing address
        savedAddress = await updateUserAddress(addressId, shippingAddress, token);
      } else {
        // Add new address
        savedAddress = await addUserAddress(shippingAddress, token);
      }

      // Update local state instead of re-loading
      const savedAddressId = savedAddress.id || savedAddress._id;
      if (savedAddressId) {
        localStorage.setItem('lastUsedAddressId', savedAddressId);
      }

      // Update savedAddresses and selectedAddress
      setSavedAddresses(prev => {
        const existingIndex = prev.findIndex(addr => (addr.id || addr._id) === savedAddressId);
        if (existingIndex >= 0) {
          // Update existing
          const updated = [...prev];
          updated[existingIndex] = savedAddress;
          return updated;
        } else {
          // Add new
          return [...prev, savedAddress];
        }
      });
      setSelectedAddress(savedAddress);
      // shippingAddress is already set to the form data

      showSuccess('Address saved successfully!');
      setCurrentStep(2);
    } catch (err) {
      showError(err.message || 'Failed to save address');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      const token = getAuthToken();
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          variant: item.variant || {},
          qty: item.qty,
          price: item.price
        })),
        shippingAddress: {
          name: shippingAddress.name,
          phone: shippingAddress.phone,
          line1: shippingAddress.line1,
          line2: shippingAddress.line2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          country: shippingAddress.country || 'India'
        },
        payment: {
          method: paymentMethod
        },
        totals: {
          subtotal: subtotal,
          tax: tax,
          shipping: shipping,
          total: total
        }
      };

      if (paymentMethod === 'online') {
        // Create a Razorpay order on the server (amount in rupees)
        // server returns { order }
        const rpResp = await createRazorpayOrder({ amount: total }, token);
        const rpOrder = rpResp.order || rpResp; // fallback if server returns raw order


        // Load Razorpay checkout script
        await new Promise((resolve, reject) => {
          if (window.Razorpay) return resolve()
          const s = document.createElement('script')
          s.src = 'https://checkout.razorpay.com/v1/checkout.js'
          s.onload = resolve
          s.onerror = () => reject(new Error('Failed to load Razorpay script'))
          document.body.appendChild(s)
        })

        // Fetch public key from backend at runtime, fallback to build-time env
        let fetchedKey = null
        try {
          fetchedKey = await getRazorpayKey()
        } catch (e) {
          fetchedKey = null
        }
        const keyId = fetchedKey || import.meta.env.VITE_RAZORPAY_KEY_ID || ''
        const options = {
          key: keyId,
          amount: rpOrder.amount,
          currency: rpOrder.currency || 'INR',
          name: import.meta.env.VITE_APP_NAME || 'Skalaqxhop',
          description: 'Order Payment',
          order_id: rpOrder.id || rpOrder.order_id,
          handler: async function (response) {
            try {
              // Verify signature on server
              await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }, token);

              // On success, finalize checkout (mark payment info)
              const paidOrderData = Object.assign({}, orderData);
              paidOrderData.payment = { method: 'razorpay', razorpay_payment_id: response.razorpay_payment_id };
              const finalResp = await checkoutOrder(paidOrderData, token);
              showSuccess('Payment successful and order placed!', 'Success');
              navigate('/checkout/success', { state: { orderId: finalResp.order._id, orderDetails: finalResp, cartItems, shippingAddress, paymentMethod: 'online' } });
            } catch (err) {
              showError(err.message || 'Payment verification failed');
            }
          },
          prefill: {
            name: shippingAddress.name,
            email: shippingAddress.email,
            contact: shippingAddress.phone
          }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
        console.log('Razorpay order created:', rzp);
      } else {
        const response = await checkoutOrder(orderData, token);
        showSuccess('Order placed successfully!', 'Success');
        // Navigate to success page with order details
        navigate('/checkout/success', {
          state: {
            orderId: response.order._id,
            orderDetails: response,
            cartItems,
            shippingAddress,
            paymentMethod
          }
        });
      }
    } catch (err) {
      showError(err.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#fbf7f2] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9c7c3a]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#fbf7f2]">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Link
              to="/shopping-cart"
              className="inline-flex items-center gap-2 text-[#9c7c3a] hover:text-[#8a6a2f] mb-3 sm:mb-4 font-sans text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Back to Cart
            </Link>
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#9c7c3a] tracking-[1px] sm:tracking-[2px]">Checkout</h1>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${currentStep >= 1 ? 'bg-[#9c7c3a] text-[#fbf7f2]' : 'bg-[#e6ddd2] text-[#3b3b3b]'
                  }`}>
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className={`ml-2 text-xs sm:text-sm font-sans font-medium ${currentStep >= 1 ? 'text-[#9c7c3a]' : 'text-[#3b3b3b]'
                  }`}>
                  Shipping
                </span>
              </div>
              <div className={`w-8 sm:w-16 h-0.5 sm:h-1 mx-2 sm:mx-4 ${currentStep >= 2 ? 'bg-[#9c7c3a]' : 'bg-[#e6ddd2]'
                }`}></div>
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${currentStep >= 2 ? 'bg-[#9c7c3a] text-[#fbf7f2]' : 'bg-[#e6ddd2] text-[#3b3b3b]'
                  }`}>
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className={`ml-2 text-xs sm:text-sm font-sans font-medium ${currentStep >= 2 ? 'text-[#9c7c3a]' : 'text-[#3b3b3b]'
                  }`}>
                  Payment
                </span>
              </div>
              <div className={`w-8 sm:w-16 h-0.5 sm:h-1 mx-2 sm:mx-4 ${currentStep >= 3 ? 'bg-[#9c7c3a]' : 'bg-[#e6ddd2]'
                }`}></div>
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${currentStep >= 3 ? 'bg-[#9c7c3a] text-[#fbf7f2]' : 'bg-[#e6ddd2] text-[#3b3b3b]'
                  }`}>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className={`ml-2 text-xs sm:text-sm font-sans font-medium ${currentStep >= 3 ? 'text-[#9c7c3a]' : 'text-[#3b3b3b]'
                  }`}>
                  Confirmation
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="space-y-4 sm:space-y-6">
              {error && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm sm:text-base">
                  {error}
                </div>
              )}

              {/* Step 1: Shipping Address */}
              {currentStep === 1 && (
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-[#e6ddd2]">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                    <h2 className="text-lg sm:text-xl font-serif font-medium text-[#9c7c3a] flex items-center gap-2 tracking-[1px]">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                      Shipping Address
                    </h2>
                    <button
                      onClick={() => setShowAddressManagement(true)}
                      className="flex items-center justify-center sm:justify-start space-x-2 bg-[#9c7c3a] text-[#fbf7f2] px-3 sm:px-4 py-2 rounded-lg hover:bg-[#8a6a2f] transition-colors font-sans font-medium text-sm w-full sm:w-auto"
                    >
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Old Addresses</span>
                    </button>
                  </div>

                  {/* Address Form - Auto-filled with last used address */}
                  {loadingAddresses ? (
                    <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-[#e6ddd2]">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#9c7c3a]"></div>
                      <span className="text-sm text-[#3b3b3b]/70">Loading addresses...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-[#fbf7f2] p-4 rounded-lg border border-[#e6ddd2]">
                        <h4 className="font-serif font-medium text-[#3b3b3b] mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#9c7c3a]" />
                          {selectedAddress ? 'Delivery Address' : 'Add Delivery Address'}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-serif font-medium text-[#9c7c3a] mb-1 sm:mb-2 tracking-[0.5px]">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={shippingAddress.name}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#e6ddd2] rounded-lg focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent bg-white font-sans text-sm sm:text-base"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-serif font-medium text-[#9c7c3a] mb-1 sm:mb-2 tracking-[0.5px]">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              value={shippingAddress.phone}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#e6ddd2] rounded-lg focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent bg-white font-sans text-sm sm:text-base"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-serif font-medium text-[#9c7c3a] mb-1 sm:mb-2 tracking-[0.5px]">
                              Email (Optional)
                            </label>
                            <input
                              type="email"
                              value={shippingAddress.email}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#e6ddd2] rounded-lg focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent bg-white font-sans text-sm sm:text-base"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-serif font-medium text-[#9c7c3a] mb-1 sm:mb-2 tracking-[0.5px]">
                              Address Line 1 *
                            </label>
                            <input
                              type="text"
                              value={shippingAddress.line1}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#e6ddd2] rounded-lg focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent bg-white font-sans text-sm sm:text-base"
                              required
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-serif font-medium text-[#9c7c3a] mb-1 sm:mb-2 tracking-[0.5px]">
                              Address Line 2 (Optional)
                            </label>
                            <input
                              type="text"
                              value={shippingAddress.line2}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, line2: e.target.value })}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#e6ddd2] rounded-lg focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent bg-white font-sans text-sm sm:text-base"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-serif font-medium text-[#9c7c3a] mb-1 sm:mb-2 tracking-[0.5px]">
                              City *
                            </label>
                            <input
                              type="text"
                              value={shippingAddress.city}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#e6ddd2] rounded-lg focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent bg-white font-sans text-sm sm:text-base"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-serif font-medium text-[#9c7c3a] mb-1 sm:mb-2 tracking-[0.5px]">
                              State *
                            </label>
                            <input
                              type="text"
                              value={shippingAddress.state}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#e6ddd2] rounded-lg focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent bg-white font-sans text-sm sm:text-base"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-serif font-medium text-[#9c7c3a] mb-1 sm:mb-2 tracking-[0.5px]">
                              Pincode *
                            </label>
                            <input
                              type="text"
                              value={shippingAddress.pincode}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#e6ddd2] rounded-lg focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent bg-white font-sans text-sm sm:text-base"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-serif font-medium text-[#9c7c3a] mb-1 sm:mb-2 tracking-[0.5px]">
                              Country
                            </label>
                            <input
                              type="text"
                              value={shippingAddress.country}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#e6ddd2] rounded-lg focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent bg-white font-sans text-sm sm:text-base"
                              placeholder="India"
                            />
                          </div>
                        </div>

                        {savedAddresses.length > 0 && (
                          <div className="mt-3 p-3 bg-white rounded-lg border border-[#e6ddd2]">
                            <p className="text-sm text-[#3b3b3b]/70 font-sans">
                              💡 Using your last used address.
                              <button
                                onClick={() => setShowAddressManagement(true)}
                                className="text-[#9c7c3a] hover:text-[#8a6a2f] underline ml-1 font-medium"
                              >
                                Change address
                              </button>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleShippingSubmit}
                    disabled={processing || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode}
                    className={`w-full py-3 px-4 rounded-lg font-serif font-medium transition-colors flex items-center justify-center gap-2 tracking-[0.5px] text-sm ${processing || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#9c7c3a] hover:bg-[#8a6a2f] text-[#fbf7f2]'
                      }`}
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                        {selectedAddress ? 'Updating Address...' : 'Saving Address...'}
                      </>
                    ) : (
                      <>
                        Continue to Payment
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-[#e6ddd2]">
                  <h2 className="text-lg sm:text-xl font-serif font-medium text-[#9c7c3a] mb-4 sm:mb-6 flex items-center gap-2 tracking-[1px]">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    Payment Method
                  </h2>

                  <form onSubmit={handlePaymentSubmit} className="space-y-4 sm:space-y-6">
                    <div className="space-y-3 sm:space-y-4">
                      <label className="flex items-start p-3 sm:p-4 border border-[#e6ddd2] rounded-lg hover:bg-[#fbf7f2] cursor-pointer bg-white">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-[#9c7c3a] focus:ring-[#9c7c3a] mt-1"
                        />
                        <div className="ml-3">
                          <span className="font-serif font-medium text-[#9c7c3a] tracking-[0.5px] text-sm sm:text-base">Cash on Delivery</span>
                          <p className="text-xs sm:text-sm text-[#3b3b3b] mt-1 font-sans">Pay when you receive your order at your doorstep</p>
                        </div>
                      </label>

                      <label className="flex items-start p-3 sm:p-4 border border-[#e6ddd2] rounded-lg hover:bg-[#fbf7f2] cursor-pointer bg-white">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={paymentMethod === 'online'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-[#9c7c3a] focus:ring-[#9c7c3a] mt-1"
                        />
                        <div className="ml-3">
                          <span className="font-serif font-medium text-[#9c7c3a] tracking-[0.5px] text-sm sm:text-base">Online Payment</span>
                          <p className="text-xs sm:text-sm text-[#3b3b3b] mt-1 font-sans">Pay securely with card, UPI, or wallet</p>
                        </div>
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 bg-[#fbf7f2] hover:bg-[#e6ddd2] text-[#9c7c3a] font-serif font-medium py-3 px-4 sm:px-6 rounded-lg transition-colors border-2 border-[#9c7c3a] tracking-[0.5px] text-sm sm:text-base"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 bg-[#9c7c3a] hover:bg-[#8a6a2f] disabled:bg-[#e6ddd2] text-[#fbf7f2] disabled:text-[#3b3b3b] font-serif font-medium py-3 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 tracking-[0.5px] text-sm sm:text-base"
                      >
                        {processing ? (
                          <div className="animate-spin rounded-full h-4 h-4 sm:w-5 sm:h-5 border-b-2 border-[#fbf7f2]"></div>
                        ) : (
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                        {processing ? 'Processing...' : 'Place Order'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:sticky lg:top-4 order-first lg:order-last">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-[#e6ddd2]">
                <h3 className="text-base sm:text-lg font-serif font-medium text-[#9c7c3a] mb-3 sm:mb-4 tracking-[1px]">Order Summary</h3>

                {/* Cart Items */}
                <div className="space-y-3 mb-4 max-h-48 sm:max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <img
                        src={item.product?.images?.[0] || '/placeholder.jpg'}
                        alt={item.product?.title}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-serif font-medium text-[#9c7c3a] truncate tracking-[0.5px]">
                          {item.product?.title || 'Product'}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#3b3b3b] font-sans">Qty: {item.qty}</p>
                      </div>
                      <p className="text-xs sm:text-sm font-serif font-medium text-[#9c7c3a] tracking-[0.5px] flex-shrink-0">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#e6ddd2] pt-3 sm:pt-4 space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm font-sans text-[#3b3b3b]">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm font-sans text-[#3b3b3b]">
                    <span>Tax (18%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm font-sans text-[#3b3b3b]">
                    <span>Shipping:</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-lg font-serif font-medium border-t border-[#e6ddd2] pt-2 text-[#9c7c3a] tracking-[0.5px]">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Management Modal */}
      {showAddressManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#fbf7f2] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e6ddd2]">
            <AddressManagement
              selectedAddress={selectedAddress}
              onAddressSelect={(address) => {
                setSelectedAddress(address);
                setShippingAddress({
                  name: address.name,
                  phone: address.phone,
                  email: address.email || '',
                  line1: address.line1,
                  line2: address.line2 || '',
                  city: address.city,
                  state: address.state,
                  pincode: address.pincode,
                  country: address.country || 'India'
                });
                // Save as last used address
                const addressId = address.id || address._id;
                if (addressId) {
                  localStorage.setItem('lastUsedAddressId', addressId);
                }
                // Refresh addresses list
                loadSavedAddresses();
              }}
              onClose={() => setShowAddressManagement(false)}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}