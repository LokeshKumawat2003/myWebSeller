import React from 'react';
import { Eye, Printer, RefreshCw } from 'lucide-react';

const OrderTable = ({ orders, loading, onViewDetails, onUpdateStatus, updating, trackingStatuses }) => {
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-[#e6ddd2]">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#9c7c3a]" />
        <p className="text-[#666] italic font-serif">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-[#e6ddd2]">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#fbf7f2]">
            <tr>
              <th className="px-6 py-4 text-left text-sm italic text-[#666] font-serif">Order ID</th>
              <th className="px-6 py-4 text-left text-sm italic text-[#666] font-serif">Date</th>
              <th className="px-6 py-4 text-left text-sm italic text-[#666] font-serif">Product Name</th>
              <th className="px-6 py-4 text-left text-sm italic text-[#666] font-serif">Total</th>
              <th className="px-6 py-4 text-left text-sm italic text-[#666] font-serif">Items</th>
              <th className="px-6 py-4 text-left text-sm italic text-[#666] font-serif">Status</th>
              <th className="px-6 py-4 text-left text-sm italic text-[#666] font-serif">Tracking</th>
              <th className="px-6 py-4 text-left text-sm italic text-[#666] font-serif">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b border-[#e6ddd2] hover:bg-[#fbf7f2] transition-colors">
                  <td className="px-6 py-4 font-mono text-sm italic text-[#3b3b3b] font-serif">{order._id?.substring(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm italic text-[#666] font-serif">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-[#3b3b3b] text-sm italic font-serif">
                    {order.items && order.items.length > 0
                      ? order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="truncate max-w-xs">{item.product?.title || 'N/A'}</div>
                        ))
                      : 'N/A'}
                    {order.items?.length > 2 && <div className="text-[#666] text-xs italic font-serif">+{order.items.length - 2} more</div>}
                  </td>
                  <td className="px-6 py-4 font-light italic text-[#9c7c3a] font-serif">₹{(order.totals?.total || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm italic text-[#666] font-serif">{order.items?.length || 0} item(s)</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-light italic font-serif ${getStatusColor(order.awb ? (trackingStatuses[order._id]?.status || 'delivered') : (order.status || 'pending'))}`}>
                      {order.awb ? ((trackingStatuses[order._id]?.status || 'delivered').charAt(0).toUpperCase() + (trackingStatuses[order._id]?.status || 'delivered').slice(1)) : (order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.awb ? (
                      <div className="text-sm">
                        <p className="text-[#3b3b3b] font-serif font-medium">
                          {(trackingStatuses[order._id]?.status || 'delivered').charAt(0).toUpperCase() + (trackingStatuses[order._id]?.status || 'delivered').slice(1)}
                        </p>
                        <p className="text-[#666] text-xs">AWB: {order.awb.substring(0, 8)}...</p>
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#9c7c3a] hover:text-[#8a6a2f] underline text-xs"
                        >
                          View Details
                        </a>
                      </div>
                    ) : (
                      <span className="text-[#666] text-sm italic font-serif">Not available</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => onViewDetails(order)}
                        className="px-3 py-1 bg-[#9c7c3a] hover:bg-[#8a6a2f] text-white rounded text-sm transition-colors flex items-center gap-1 font-light italic font-serif"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <a
                        href={`/print-invoice?orderId=${order._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-[#666] hover:bg-[#555] text-white rounded text-sm transition-colors flex items-center gap-1 font-light italic font-serif"
                      >
                        <Printer className="w-4 h-4" />
                        Print
                      </a>
                      <select
                        onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                        disabled={updating === order._id}
                        className="px-2 py-1 border border-[#e6ddd2] rounded text-sm cursor-pointer text-[#3b3b3b] bg-white disabled:opacity-50 italic font-serif"
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
                <td colSpan="7" className="px-6 py-12 text-center text-[#666]">
                  <div className="text-4xl mb-4">📦</div>
                  <p className="italic font-serif">No orders yet</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {orders && orders.length > 0 ? (
          <div className="divide-y divide-[#e6ddd2]">
            {orders.map((order) => (
              <div key={order._id} className="p-4 hover:bg-[#fbf7f2] transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-mono text-sm italic text-[#3b3b3b] font-serif">{order._id?.substring(0, 8)}...</p>
                    <p className="text-sm italic text-[#666] font-serif">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-light italic font-serif ${getStatusColor(order.awb ? (trackingStatuses[order._id]?.status || 'delivered') : (order.status || 'pending'))}`}>
                    {order.awb ? ((trackingStatuses[order._id]?.status || 'delivered').charAt(0).toUpperCase() + (trackingStatuses[order._id]?.status || 'delivered').slice(1)) : (order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending')}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm italic text-[#3b3b3b] font-serif">
                    {order.items && order.items.length > 0
                      ? order.items.slice(0, 1).map((item, idx) => item.product?.title || 'N/A').join(', ')
                      : 'N/A'}
                    {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                  </p>
                  <p className="text-sm italic text-[#666] font-serif">{order.items?.length || 0} item(s)</p>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <p className="font-light italic text-[#9c7c3a] font-serif">₹{(order.totals?.total || 0).toFixed(2)}</p>
                  {order.awb && (
                    <div className="text-right text-sm">
                      <p className="text-[#3b3b3b] font-serif font-medium">
                        {(trackingStatuses[order._id]?.status || 'delivered').charAt(0).toUpperCase() + (trackingStatuses[order._id]?.status || 'delivered').slice(1)}
                      </p>
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#9c7c3a] hover:text-[#8a6a2f] underline text-xs"
                      >
                        View Details
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => onViewDetails(order)}
                    className="px-3 py-1 bg-[#9c7c3a] hover:bg-[#8a6a2f] text-white rounded text-sm transition-colors flex items-center gap-1 font-light italic font-serif"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <a
                    href={`/print-invoice?orderId=${order._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-[#666] hover:bg-[#555] text-white rounded text-sm transition-colors flex items-center gap-1 font-light italic font-serif"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </a>
                  <select
                    onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                    disabled={updating === order._id}
                    className="px-2 py-1 border border-[#e6ddd2] rounded text-sm cursor-pointer text-[#3b3b3b] bg-white disabled:opacity-50 italic font-serif"
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
          <div className="p-8 text-center text-[#666]">
            <div className="text-4xl mb-4">📦</div>
            <p className="italic font-serif">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTable;