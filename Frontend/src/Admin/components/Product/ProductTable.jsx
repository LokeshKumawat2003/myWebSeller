import React from 'react';
import {
  Edit,
  Trash2,
  Eye,
  Shield,
  ShieldCheck,
  Star,
  TrendingUp,
  Zap,
  Check,
  Loader2
} from 'lucide-react';

const ProductTable = ({
  products,
  loading,
  selectedStatus,
  onStatusChange,
  onApplyStatus,
  onBlockProduct,
  onUnblockProduct,
  onDeleteProduct,
  onToggleFeatured,
  onToggleTrending,
  onToggleNew,
  onViewProduct
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="text-center">
          <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">No products match the current filter criteria</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Seller</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">State</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Special</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img
                        className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                        src={product.images?.[0] || '/placeholder-product.png'}
                        alt={product.title}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {product.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {product._id?.substring(0, 8)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.seller?.storeName || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${product.basePrice}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                    product.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {product.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFeatured(product._id)}
                      className={`p-1 rounded ${product.isFeatured ? 'text-yellow-600 bg-yellow-50' : 'text-gray-400 hover:text-yellow-600'}`}
                      title="Toggle Featured"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleTrending(product._id)}
                      className={`p-1 rounded ${product.isTrending ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600'}`}
                      title="Toggle Trending"
                    >
                      <TrendingUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleNew(product._id)}
                      className={`p-1 rounded ${product.isNew ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-green-600'}`}
                      title="Toggle New"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewProduct(product)}
                      className="inline-flex items-center px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm font-medium transition-colors"
                      title="View Product"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      <select
                        value={selectedStatus[product._id] || ''}
                        onChange={(e) => onStatusChange(product._id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">Status</option>
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        onClick={() => onApplyStatus(product._id)}
                        className="p-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
                        title="Apply Status"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    </div>

                    {product.isBlocked ? (
                      <button
                        onClick={() => onUnblockProduct(product._id)}
                        className="inline-flex items-center px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded text-sm font-medium transition-colors"
                        title="Unblock Product"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onBlockProduct(product._id)}
                        className="inline-flex items-center px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded text-sm font-medium transition-colors"
                        title="Block Product"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteProduct(product._id)}
                      className="inline-flex items-center px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded text-sm font-medium transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;