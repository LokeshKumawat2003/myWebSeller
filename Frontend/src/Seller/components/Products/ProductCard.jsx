import React from 'react';
import { Edit, Trash2, CheckCircle, Clock, Package, Star } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete, accountBlocked, getProductMatrix, findProductVariant }) => {
  const { sizes, colors, totalStock } = getProductMatrix(product);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#e6ddd2] overflow-hidden hover:shadow-md transition-all duration-300 group">
      {/* Product Image */}
      <div className="relative h-48 bg-[#fbf7f2] overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-[#9c7c3a]" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-light italic flex items-center gap-1 font-serif ${
            product.status === 'approved' ? 'bg-[#9c7c3a] text-white' : 'bg-[#fbf7f2] text-[#666] border border-[#e6ddd2]'
          }`}>
            {product.status === 'approved' ? <CheckCircle size={10} /> : <Clock size={10} />}
            {product.status === 'approved' ? 'Approved' : 'Pending'}
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-[#e6ddd2]">
            <span className="font-light italic text-[#9c7c3a] font-serif">₹{product.basePrice}</span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-light italic text-[#3b3b3b] mb-2 line-clamp-2 group-hover:text-[#9c7c3a] transition-colors font-serif">
          {product.title}
        </h3>

        {/* Variants Info */}
        <div className="mb-3">
          {product.variants && product.variants.length > 0 ? (
            <div className="flex items-center gap-2 text-sm italic text-[#666] font-serif">
              <span className="bg-[#fbf7f2] text-[#9c7c3a] px-2 py-1 rounded text-xs font-light italic border border-[#e6ddd2]">
                {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
              </span>
              {sizes.length > 0 && (
                <span className="text-xs italic text-[#666] font-serif">
                  Sizes: {sizes.slice(0, 3).join(', ')}{sizes.length > 3 && '...'}
                </span>
              )}
              <span className={`text-xs px-2 py-1 rounded font-light italic font-serif ${
                totalStock > 0 ? 'bg-[#fbf7f2] text-[#666] border border-[#e6ddd2]' : 'bg-[#e6ddd2] text-[#3b3b3b]'
              }`}>
                Stock: {totalStock}
              </span>
            </div>
          ) : (
            <span className="text-sm italic text-[#666] font-serif">No variants</span>
          )}
        </div>

        {/* Rating Placeholder */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 text-[#9c7c3a] fill-current" />
            ))}
          </div>
          <span className="text-sm italic text-[#666] font-serif">(No reviews)</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 px-3 py-2 bg-[#9c7c3a] hover:bg-[#8a6a2f] disabled:bg-[#e6ddd2] text-white disabled:text-[#666] rounded-lg text-sm font-light italic transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 font-serif"
            disabled={accountBlocked}
          >
            <Edit size={14} />
            Edit
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="flex-1 px-3 py-2 bg-[#9c7c3a] hover:bg-[#8a6a2f] disabled:bg-[#e6ddd2] text-white disabled:text-[#666] rounded-lg text-sm font-light italic transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 font-serif"
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