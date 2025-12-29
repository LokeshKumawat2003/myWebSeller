import React from 'react';
import { Eye, Printer, RefreshCw } from 'lucide-react';

const OrderTable = ({ orders, loading, onViewDetails, onUpdateStatus, updating }) => {
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Items</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-800">{order._id?.substring(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-800 text-sm">
                    {order.items && order.items.length > 0
                      ? order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="truncate max-w-xs">{item.product?.title || 'N/A'}</div>
                        ))
                      : 'N/A'}
                    {order.items?.length > 2 && <div className="text-gray-500 text-xs">+{order.items.length - 2} more</div>}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">₹{(order.totals?.total || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.items?.length || 0} item(s)</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status || 'pending')}`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => onViewDetails(order)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <a
                        href={`/print-invoice?orderId=${order._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors flex items-center gap-1"
                      >
                        <Printer className="w-4 h-4" />
                        Print
                      </a>
                      <select
                        onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                        disabled={updating === order._id}
                        className="px-2 py-1 border border-gray-300 rounded text-sm cursor-pointer text-gray-700 bg-white disabled:opacity-50"
                        defaultValue={order.status || 'pending'}
                      >
                        <option value="">Update Status</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <div className="text-4xl mb-4">📦</div>
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {orders && orders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-mono text-sm text-gray-800">{order._id?.substring(0, 8)}...</p>
                    <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status || 'pending')}`}>
                    {order.status || 'pending'}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-800 font-medium">
                    {order.items && order.items.length > 0
                      ? order.items.slice(0, 1).map((item, idx) => item.product?.title || 'N/A').join(', ')
                      : 'N/A'}
                    {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                  </p>
                  <p className="text-sm text-gray-600">{order.items?.length || 0} item(s)</p>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <p className="font-semibold text-gray-800">₹{(order.totals?.total || 0).toFixed(2)}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => onViewDetails(order)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <a
                    href={`/print-invoice?orderId=${order._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors flex items-center gap-1"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </a>
                  <select
                    onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                    disabled={updating === order._id}
                    className="px-2 py-1 border border-gray-300 rounded text-sm cursor-pointer text-gray-700 bg-white disabled:opacity-50"
                    defaultValue={order.status || 'pending'}
                  >
                    <option value="">Update</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancel</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">📦</div>
            No orders yet
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTable;