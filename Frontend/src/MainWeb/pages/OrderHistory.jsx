import { useState, useEffect } from 'react';
import { getUserOrders, getOrder, getOrderTracking, getAuthToken } from '../../services/api';
import Layout from '../components/Layout';
import { Eye, Package, Truck, CheckCircle, XCircle, Clock, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingStatuses, setTrackingStatuses] = useState({});

  useEffect(() => {
    fetchOrders();
    // Scroll to top when order history page loads
    window.scrollTo(0, 0);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      if (token) {
        try {
          const data = await getUserOrders(token);
          console.log('API response:', data);

          // Handle different response formats
          let orderData = [];
          if (Array.isArray(data)) {
            orderData = data;
          } else if (data && Array.isArray(data.orders)) {
            orderData = data.orders;
          } else if (data && typeof data === 'object') {
            orderData = [data];
          }

          if (orderData.length > 0) {
            setOrders(orderData);
            setLoading(false);

            // Fetch tracking statuses for orders with AWB
            const ordersWithTracking = orderData.filter(order => order.awb);
            if (ordersWithTracking.length > 0) {
              const trackingPromises = ordersWithTracking.map(order => 
                getOrderTracking(order._id, token).catch(() => ({ status: 'unknown' }))
              );
              const trackingResults = await Promise.all(trackingPromises);
              const newStatuses = {};
              ordersWithTracking.forEach((order, i) => {
                newStatuses[order._id] = trackingResults[i];
              });
              setTrackingStatuses(newStatuses);
            }

            return;
          } else {
            // No orders found
            setOrders([]);
            setError('No orders found');
          }
        } catch (apiErr) {
          console.log('API call failed:', apiErr);
          setError('Failed to load orders from server. Please try again later.');
          setOrders([]);
        }
      } else {
        // No authentication token
        setError('Please log in to view your orders');
        setOrders([]);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = async (orderId) => {
    console.log('View Details clicked for order:', orderId);
    // For dummy orders, find in local state
    if (orderId.startsWith('dummy-order-')) {
      const order = orders.find(o => o._id === orderId);
      console.log('Found dummy order:', order);
      setSelectedOrder(order);
      return;
    }

    // For real orders, fetch from API
    try {
      const orderDetails = await getOrder(orderId);
      setSelectedOrder(orderDetails);
    } catch (err) {
      console.error('Error fetching order details:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#fbf7f2]">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-[#9c7c3a]"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#fbf7f2] px-4">
          <div className="text-center max-w-md">
            <p className="text-red-600 text-base md:text-lg mb-4 font-sans">Failed to load orders</p>
            <button
              onClick={fetchOrders}
              className="bg-[#9c7c3a] text-[#fbf7f2] px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-[#8a6a2f] transition-colors font-sans font-medium uppercase tracking-[1px] text-sm md:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#fbf7f2] py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-serif font-medium text-[#9c7c3a] mb-6 md:mb-8 tracking-[2px] md:tracking-[3px] text-center">Order History</h1>

          {orders.length === 0 ? (
            <div className="text-center py-8 md:py-12 px-4">
              <Package className="w-12 h-12 md:w-16 md:h-16 text-[#e6ddd2] mx-auto mb-4" />
              <h2 className="text-lg md:text-xl font-serif font-medium text-[#3b3b3b] mb-2 tracking-[1px] md:tracking-[2px]">No orders yet</h2>
              <p className="text-[#3b3b3b]/80 text-base md:text-lg font-sans mb-4 px-2">Your order history will appear here once you make a purchase.</p>
              {!getAuthToken() && (
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 bg-[#9c7c3a] text-[#fbf7f2] px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-[#8a6a2f] transition-colors font-sans font-medium uppercase tracking-[1px] text-sm md:text-base"
                >
                  <LogIn className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Login to view your orders</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {console.log('Rendering orders:', orders)}
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-sm border border-[#e6ddd2] p-4 md:p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-base md:text-lg font-serif font-medium text-[#9c7c3a] tracking-[1px]">
                          Order #{order._id.slice(-8)}
                        </h3>
                        <p className="text-xs md:text-sm text-[#3b3b3b]/70 font-sans">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-sans font-medium uppercase tracking-[0.5px] self-start ${getStatusColor(order.awb ? (trackingStatuses[order._id]?.status || 'delivered') : order.status)}`}>
                        {order.awb ? ((trackingStatuses[order._id]?.status || 'delivered').charAt(0).toUpperCase() + (trackingStatuses[order._id]?.status || 'delivered').slice(1)) : (order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOrderClick(order._id);
                        }}
                        className="flex items-center space-x-2 bg-[#9c7c3a] text-[#fbf7f2] px-3 md:px-4 py-2 rounded hover:bg-[#8a6a2f] transition-colors font-sans font-medium uppercase tracking-[1px] text-xs md:text-sm"
                      >
                        <Eye className="w-3 h-3 md:w-4 md:h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-sm border-t border-[#e6ddd2] pt-4">
                    <div className="bg-[#fbf7f2] p-3 md:p-4 rounded border border-[#e6ddd2]">
                      <span className="font-serif font-medium text-[#9c7c3a] text-xs md:text-sm uppercase tracking-[1px]">Total Amount:</span>
                      <p className="text-[#3b3b3b] font-serif font-semibold text-base md:text-lg mt-1">₹{order.totals?.total || 'N/A'}</p>
                    </div>
                    <div className="bg-[#fbf7f2] p-3 md:p-4 rounded border border-[#e6ddd2]">
                      <span className="font-serif font-medium text-[#9c7c3a] text-xs md:text-sm uppercase tracking-[1px]">Payment Method:</span>
                      <p className="text-[#3b3b3b] font-sans font-medium mt-1 text-sm md:text-base">{order.payment?.method || 'N/A'}</p>
                    </div>
                    <div className="bg-[#fbf7f2] p-3 md:p-4 rounded border border-[#e6ddd2]">
                      <span className="font-serif font-medium text-[#9c7c3a] text-xs md:text-sm uppercase tracking-[1px]">Items:</span>
                      <p className="text-[#3b3b3b] font-sans font-medium mt-1 text-sm md:text-base">{order.items?.length || 0} item(s)</p>
                    </div>
                    {order.awb ? (
                      <div className="bg-[#fbf7f2] p-3 md:p-4 rounded border border-[#e6ddd2]">
                        <span className="font-serif font-medium text-[#9c7c3a] text-xs md:text-sm uppercase tracking-[1px]">Tracking Status:</span>
                        <p className="text-[#3b3b3b] font-sans font-medium mt-1 text-sm md:text-base">
                          {(trackingStatuses[order._id]?.status || 'delivered').charAt(0).toUpperCase() + (trackingStatuses[order._id]?.status || 'delivered').slice(1)}
                        </p>
                        <p className="text-[#666] text-xs mt-1">AWB: {order.awb}</p>
                        <p className="text-[#666] text-xs">Courier: {order.courierName}</p>
                        <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-[#9c7c3a] hover:underline text-xs mt-1 block">
                          View on Courier Site
                        </a>
                      </div>
                    ) : order.status === 'shipped' && order.deliveryDate ? (
                      <div className="bg-[#fbf7f2] p-3 md:p-4 rounded border border-[#e6ddd2]">
                        <span className="font-serif font-medium text-[#9c7c3a] text-xs md:text-sm uppercase tracking-[1px]">Expected Delivery:</span>
                        <p className="text-[#3b3b3b] font-sans font-medium mt-1 text-sm md:text-base">
                          {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-[#fbf7f2] rounded-lg max-w-4xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e6ddd2]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 md:mb-6 border-b border-[#e6ddd2] pb-3 md:pb-4">
                  <h2 className="text-lg md:text-2xl font-serif font-medium text-[#9c7c3a] tracking-[1px] md:tracking-[2px]">
                    Order Details #{selectedOrder._id.slice(-8)}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedOrder(null);
                    }}
                    className="text-[#3b3b3b]/60 hover:text-[#3b3b3b] p-2 hover:bg-[#e6ddd2] rounded-full transition-colors"
                  >
                    <XCircle className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                  <div>
                    <h3 className="text-base md:text-lg font-serif font-medium text-[#9c7c3a] mb-3 tracking-[1px]">Order Information</h3>
                    <div className="space-y-3 bg-white p-3 md:p-4 rounded border border-[#e6ddd2]">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(selectedOrder.awb ? (trackingStatuses[selectedOrder._id]?.status || 'delivered') : selectedOrder.status)}
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-sans font-medium uppercase tracking-[0.5px] ${getStatusColor(selectedOrder.awb ? (trackingStatuses[selectedOrder._id]?.status || 'delivered') : selectedOrder.status)}`}>
                          {selectedOrder.awb ? ((trackingStatuses[selectedOrder._id]?.status || 'delivered').charAt(0).toUpperCase() + (trackingStatuses[selectedOrder._id]?.status || 'delivered').slice(1)) : (selectedOrder.status ? selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) : 'Pending')}
                        </span>
                      </div>
                      <p className="text-[#3b3b3b] font-sans text-sm md:text-base"><span className="font-serif font-medium text-[#9c7c3a]">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                      <p className="text-[#3b3b3b] font-sans text-sm md:text-base"><span className="font-serif font-medium text-[#9c7c3a]">Total Amount:</span> ₹{selectedOrder.totals?.total}</p>
                      <p className="text-[#3b3b3b] font-sans text-sm md:text-base"><span className="font-serif font-medium text-[#9c7c3a]">Payment Method:</span> {selectedOrder.payment?.method || 'N/A'}</p>
                      {selectedOrder.status === 'shipped' && selectedOrder.deliveryDate && (
                        <p className="text-[#3b3b3b] font-sans text-sm md:text-base"><span className="font-serif font-medium text-[#9c7c3a]">Expected Delivery:</span> {new Date(selectedOrder.deliveryDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}</p>
                      )}
                      {selectedOrder.shippedAt && (
                        <p className="text-[#3b3b3b] font-sans text-sm md:text-base"><span className="font-serif font-medium text-[#9c7c3a]">Shipped Date:</span> {new Date(selectedOrder.shippedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</p>
                      )}
                      {selectedOrder.awb && (
                        <>
                          <p className="text-[#3b3b3b] font-sans text-sm md:text-base"><span className="font-serif font-medium text-[#9c7c3a]">AWB Number:</span> {selectedOrder.awb}</p>
                          <p className="text-[#3b3b3b] font-sans text-sm md:text-base"><span className="font-serif font-medium text-[#9c7c3a]">Courier:</span> {selectedOrder.courierName || 'N/A'}</p>
                          {selectedOrder.trackingUrl && (
                            <p className="text-[#3b3b3b] font-sans text-sm md:text-base">
                              <span className="font-serif font-medium text-[#9c7c3a]">Tracking:</span> 
                              <a href={selectedOrder.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-[#9c7c3a] hover:underline ml-1">
                                Track Shipment
                              </a>
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base md:text-lg font-serif font-medium text-[#9c7c3a] mb-3 tracking-[1px]">Shipping Address</h3>
                    <div className="text-[#3b3b3b] font-sans bg-white p-3 md:p-4 rounded border border-[#e6ddd2] text-sm md:text-base">
                      <p className="font-medium">{selectedOrder.shippingAddress?.name}</p>
                      <p>{selectedOrder.shippingAddress?.line1}</p>
                      {selectedOrder.shippingAddress?.line2 && <p>{selectedOrder.shippingAddress.line2}</p>}
                      <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.pincode}</p>
                      <p>{selectedOrder.shippingAddress?.country}</p>
                      <p className="mt-2">{selectedOrder.shippingAddress?.phone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-serif font-medium text-[#9c7c3a] mb-3 tracking-[1px]">Order Items</h3>
                  <div className="space-y-3 md:space-y-4">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 md:p-4 bg-white border border-[#e6ddd2] rounded">
                        <div className="flex-1">
                          <h4 className="font-serif font-medium text-[#3b3b3b] text-sm md:text-base">{item.product?.title || 'Product'}</h4>
                          <p className="text-[#3b3b3b]/70 font-sans text-xs md:text-sm">
                            Size: {item.variant?.size}, Color: {item.variant?.color}, Material: {item.variant?.material}
                          </p>
                          <p className="text-[#3b3b3b]/70 font-sans text-xs md:text-sm">Seller: {item.seller?.storeName || item.seller?.name || 'N/A'}</p>
                        </div>
                        <div className="flex flex-col sm:items-end space-y-1 sm:space-y-0">
                          <p className="font-serif font-medium text-[#9c7c3a] text-sm md:text-base">₹{item.price}</p>
                          <p className="text-[#3b3b3b]/70 font-sans text-xs md:text-sm">Qty: {item.qty}</p>
                          <p className="text-[#3b3b3b] font-serif font-medium text-xs md:text-sm">Subtotal: ₹{item.price * item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderHistory;