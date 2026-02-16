import React, { useState, useEffect } from 'react';
import { getOrder } from '../services/api';
import InvoicePrint from '../components/InvoicePrint';
import Logo from '../components/Logo';

export default function PrintInvoice() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const orderId = searchParams.get('orderId');
    if (orderId) {
      loadOrder(orderId);
    } else {
      setError('No order ID provided');
      setLoading(false);
    }
  }, []);

  const loadOrder = async (orderId) => {
    try {
      const foundOrder = await getOrder(orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError('Error loading order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#fbf7f2]">
        <p className="text-[#3b3b3b] text-xl">Loading invoice...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#fbf7f2]">
        <div className="text-center">
          <p className="text-red-600 text-xl font-bold mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-[#9c7c3a] hover:bg-[#8a6a2f] text-white rounded-lg font-serif"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <InvoicePrint order={order} />;
}
