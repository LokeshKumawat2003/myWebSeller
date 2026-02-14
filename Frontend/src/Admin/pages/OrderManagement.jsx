import React, { useState, useEffect } from 'react';
import { adminGetAllOrders, adminUpdateOrderStatus, adminMarkOrderDelivered } from '../../services/adminApi';
import { getOrderTracking } from '../../services/api';
import OrderHeader from '../components/Order/OrderHeader';
import OrdersTable from '../components/Order/OrdersTable';
import OrderDetailsModal from '../components/Order/OrderDetailsModal';
import { OrderLoadingState, OrderEmptyState } from '../components/Order/OrderStates';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [trackingStatuses, setTrackingStatuses] = useState({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminGetAllOrders();
      // Handle array response or object with orders property
      let orderData = [];
      if (Array.isArray(data)) {
        orderData = data;
      } else if (data && Array.isArray(data.orders)) {
        orderData = data.orders;
      } else {
        console.error('Unexpected response format:', data);
        orderData = [];
      }
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

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await adminUpdateOrderStatus(orderId, newStatus);
      alert('Order status updated!');
      loadOrders();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    if (window.confirm('Mark this order as delivered? This will make seller earnings available for payout.')) {
      setUpdating(orderId);
      try {
        const result = await adminMarkOrderDelivered(orderId);
        alert('Order marked as delivered! Seller can now request payment.');
        loadOrders();
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        setUpdating(null);
      }
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'packed': return 'bg-orange-100 text-orange-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = Array.isArray(orders) ? orders.reduce((sum, order) => sum + (order.totals?.total || 0), 0) : 0;
  const deliveredOrders = Array.isArray(orders) ? orders.filter(o => o.status === 'delivered').length : 0;

  return (
    <div className="space-y-6">
      <OrderHeader
        totalOrders={orders.length}
        deliveredOrders={deliveredOrders}
        totalRevenue={totalRevenue}
      />

      {loading ? (
        <OrderLoadingState />
      ) : orders.length === 0 ? (
        <OrderEmptyState />
      ) : (
        <OrdersTable
          orders={orders}
          updating={updating}
          onViewDetails={handleViewDetails}
          onMarkDelivered={handleMarkDelivered}
          onUpdateStatus={handleUpdateStatus}
          trackingStatuses={trackingStatuses}
        />
      )}

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setShowModal(false)}
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
