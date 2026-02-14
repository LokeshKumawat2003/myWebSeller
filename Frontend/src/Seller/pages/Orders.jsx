import React, { useState, useEffect } from 'react';
import { getSellerOrders, updateOrderStatus, getOrderTracking } from '../../services/api';
import OrderTable from '../components/Orders/OrderTable';
import OrderModal from '../components/Orders/OrderModal';
import { ShoppingBag } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [trackingStatuses, setTrackingStatuses] = useState({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getSellerOrders();
      const orderData = Array.isArray(data) ? data : [];
      setOrders(orderData);

      // Fetch tracking statuses for orders with AWB
      const ordersWithTracking = orderData.filter(order => order.awb);
      if (ordersWithTracking.length > 0) {
        const trackingPromises = ordersWithTracking.map(order => 
          getOrderTracking(order._id).catch(() => ({ status: 'unknown' }))
        );
        const trackingResults = await Promise.all(trackingPromises);
        const newStatuses = {};
        ordersWithTracking.forEach((order, i) => {
          newStatuses[order._id] = trackingResults[i];
        });
        setTrackingStatuses(newStatuses);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      alert('Order status updated!');
      loadOrders();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-[#e6ddd2] text-[#3b3b3b]';
      case 'packed': return 'bg-[#fbf7f2] text-[#666] border border-[#e6ddd2]';
      case 'shipped': return 'bg-[#9c7c3a] text-white';
      case 'out_for_delivery': return 'bg-[#8a6a2f] text-white';
      case 'delivered': return 'bg-[#9c7c3a] text-white';
      case 'cancelled': return 'bg-[#e6ddd2] text-[#666]';
      default: return 'bg-[#fbf7f2] text-[#666] border border-[#e6ddd2]';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="w-8 h-8 text-[#9c7c3a]" />
        <h1 className="text-2xl md:text-3xl font-light italic text-[#3b3b3b] font-serif">Your Orders</h1>
      </div>

      <OrderTable
        orders={orders}
        loading={loading}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        updating={updating}
        trackingStatuses={trackingStatuses}
      />

      <OrderModal
        selectedOrder={selectedOrder}
        showModal={showModal}
        setShowModal={setShowModal}
        getStatusColor={getStatusColor}
      />

      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .fixed {
            position: static;
          }
          .bg-black.bg-opacity-50 {
            display: none;
          }
          .rounded-xl {
            border-radius: 0;
          }
          .p-6 {
            padding: 0.5rem;
          }
          table {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
