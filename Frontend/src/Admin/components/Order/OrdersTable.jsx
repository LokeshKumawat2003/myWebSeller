import React from 'react';
import { Eye, Printer, Check, Loader2, DollarSign } from 'lucide-react';
import { Card, Button, Select, Badge } from '../UI';
import { useThemeColors } from '../../AdminContext';

const OrdersTable = ({ orders, updating, onViewDetails, onMarkDelivered, onUpdateStatus, trackingStatuses }) => {
  const colors = useThemeColors();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'packed': return 'warning';
      case 'shipped': return 'primary';
      case 'out_for_delivery': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'packed', label: 'Packed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border, borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Products</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Items</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Total</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Tracking</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="transition-colors" style={{ borderColor: colors.border, borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
                <td className="px-6 py-4">
                  <div className="font-mono text-sm font-medium" style={{ color: colors.textPrimary }}>
                    {order._id?.substring(0, 8)}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: colors.textSecondary }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm" style={{ color: colors.textPrimary }}>
                    {order.items && order.items.length > 0
                      ? order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="truncate max-w-32">
                          {item.product?.title || 'N/A'}
                        </div>
                      ))
                      : 'N/A'}
                    {order.items?.length > 2 && (
                      <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                        +{order.items.length - 2} more
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: colors.textPrimary }}>
                  {order.items?.length || 0}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold" style={{ color: colors.textPrimary }}>
                      ${(order.totals?.total || 0).toFixed(2)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusColor(order.awb ? (trackingStatuses[order._id]?.status || 'delivered') : (order.status || 'pending'))}>
                    {order.awb ? ((trackingStatuses[order._id]?.status || 'delivered').charAt(0).toUpperCase() + (trackingStatuses[order._id]?.status || 'delivered').slice(1)) : (order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending')}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {order.awb ? (
                    <div className="text-sm">
                      <p className="font-medium" style={{ color: colors.textPrimary }}>
                        {(trackingStatuses[order._id]?.status || 'delivered').charAt(0).toUpperCase() + (trackingStatuses[order._id]?.status || 'delivered').slice(1)}
                      </p>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>AWB: {order.awb.substring(0, 8)}...</p>
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-xs"
                      >
                        View Details
                      </a>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">Not available</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => onViewDetails(order)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                    <a
                      href={`/print-invoice?orderId=${order._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Printer className="w-4 h-4 mr-1" />
                      Print
                    </a>
                    {order.status !== 'delivered' && (
                      <Button
                        variant="success"
                        size="small"
                        onClick={() => onMarkDelivered(order._id)}
                        disabled={updating === order._id}
                      >
                        {updating === order._id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4 mr-1" />
                        )}
                        Deliver
                      </Button>
                    )}
                    <Select
                      options={statusOptions}
                      value={order.status || 'pending'}
                      onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                      className="w-auto"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default OrdersTable;