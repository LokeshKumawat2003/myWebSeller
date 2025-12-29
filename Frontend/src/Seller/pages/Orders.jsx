import React, { useState, useEffect } from 'react';
import { getSellerOrders, updateOrderStatus } from '../../services/api';
import OrderTable from '../components/Orders/OrderTable';
import OrderModal from '../components/Orders/OrderModal';
import { ShoppingBag } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getSellerOrders();
      setOrders(Array.isArray(data) ? data : []);
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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'packed': return 'bg-orange-100 text-orange-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Orders</h1>
      </div>

      <OrderTable
        orders={orders}
        loading={loading}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        updating={updating}
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
