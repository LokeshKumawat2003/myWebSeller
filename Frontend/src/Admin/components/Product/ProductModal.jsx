import React from 'react';
import { X, Eye, Star, TrendingUp, Zap, Shield, ShieldCheck, DollarSign, User, Calendar } from 'lucide-react';

const ProductModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="luxury-bg rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 luxury-border">
          <h2 className="text-2xl font-bold luxury-text-primary flex items-center gap-2 italic">
            <Eye className="w-6 h-6" />
            Product Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-luxury-bg-secondary rounded-lg transition-colors"
          >
            <X className="w-6 h-6 luxury-text-secondary" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Images */}
          <div>
            <h3 className="text-lg font-semibold luxury-text-primary mb-3 italic">Product Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg luxury-border"
                  />
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center h-32 luxury-bg-secondary rounded-lg luxury-border">
                  <Eye className="w-8 h-8 luxury-text-secondary" />
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Title</label>
                  <p className="text-gray-900 font-medium">{product.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-900">{product.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Price
                    </label>
                    <p className="text-gray-900 font-semibold">${product.basePrice}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Stock</label>
                    <p className="text-gray-900">{product.stock || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Status & Seller</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Seller
                  </label>
                  <p className="text-gray-900">{product.seller?.storeName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Blocked</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                      product.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {product.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Status</h3>
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Star className={`w-5 h-5 ${product.isFeatured ? 'text-yellow-500' : 'text-gray-300'}`} />
                <span className={`text-sm font-medium ${product.isFeatured ? 'text-yellow-700' : 'text-gray-500'}`}>
                  Featured
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-5 h-5 ${product.isTrending ? 'text-blue-500' : 'text-gray-300'}`} />
                <span className={`text-sm font-medium ${product.isTrending ? 'text-blue-700' : 'text-gray-500'}`}>
                  Trending
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className={`w-5 h-5 ${product.isNew ? 'text-green-500' : 'text-gray-300'}`} />
                <span className={`text-sm font-medium ${product.isNew ? 'text-green-700' : 'text-gray-500'}`}>
                  New
                </span>
              </div>
            </div>
          </div>

          {/* Categories & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {product.categories && product.categories.length > 0 ? (
                  product.categories.map((category, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {category}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No categories</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags && product.tags.length > 0 ? (
                  product.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No tags</span>
                )}
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-gray-600">Created</label>
                <p className="text-gray-900">{new Date(product.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="font-medium text-gray-600">Updated</label>
                <p className="text-gray-900">{new Date(product.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;