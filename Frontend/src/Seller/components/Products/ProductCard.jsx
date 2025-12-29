import React from 'react';
import { Edit, Trash2, CheckCircle, Clock, Package, Star } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete, accountBlocked, getProductMatrix, findProductVariant }) => {
  const { sizes, colors, totalStock } = getProductMatrix(product);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
            product.status === 'approved' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
          }`}>
            {product.status === 'approved' ? <CheckCircle size={10} /> : <Clock size={10} />}
            {product.status === 'approved' ? 'Approved' : 'Pending'}
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg">
            <span className="font-bold text-gray-900">₹{product.basePrice}</span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>

        {/* Variants Info */}
        <div className="mb-3">
          {product.variants && product.variants.length > 0 ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
              </span>
              {sizes.length > 0 && (
                <span className="text-xs text-gray-500">
                  Sizes: {sizes.slice(0, 3).join(', ')}{sizes.length > 3 && '...'}
                </span>
              )}
              <span className={`text-xs px-2 py-1 rounded font-medium ${
                totalStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                Stock: {totalStock}
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">No variants</span>
          )}
        </div>

        {/* Rating Placeholder */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 text-gray-300 fill-current" />
            ))}
          </div>
          <span className="text-sm text-gray-500">(No reviews)</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={accountBlocked}
          >
            <Edit size={14} />
            Edit
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={accountBlocked}
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;