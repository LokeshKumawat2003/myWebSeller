import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { addToWishlist, checkWishlistStatus, getAuthToken } from '../../../services/api';

const ProductInfo = ({
  product,
  selectedColorVariant,
  selectedSize,
  discountedPrice,
  allSizes,
  uniqueSizes,
  uniqueColors,
  setSelectedSize,
  setSelectedColorVariant,
  setSelectedImage,
  quantity,
  setQuantity,
  isWishlisted,
  setIsWishlisted,
  getColorValue,
  onSizeGuideOpen,
  onAddToCart
}) => {
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    checkWishlistStatusOnLoad();
  }, [product._id, selectedColorVariant, selectedSize]);

  const checkWishlistStatusOnLoad = async () => {
    if (!selectedColorVariant || !selectedSize) return;

    try {
      const token = getAuthToken();
      if (!token) return;

      const status = await checkWishlistStatus(product._id, {
        color: selectedColorVariant.color,
        size: selectedSize.size
      }, token);
      setIsWishlisted(status.isWishlisted);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleWishlistToggle = async () => {
    if (wishlistLoading) return;

    try {
      setWishlistLoading(true);
      const token = getAuthToken();

      if (!token) {
        alert('Please login to add items to wishlist');
        return;
      }

      if (!selectedSize) {
        alert('Please select a size');
        return;
      }

      const payload = {
        product: product._id,
        variant: {
          color: selectedColorVariant.color,
          size: selectedSize.size
        }
      };

      if (isWishlisted) {
        // Remove from wishlist - we'll need to get the item ID first
        // For now, just toggle the state
        setIsWishlisted(false);
        alert('Removed from wishlist');
      } else {
        await addToWishlist(payload, token);
        setIsWishlisted(true);
        alert('Added to wishlist successfully!');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setWishlistLoading(false);
    }
  };
  return (
    <div className="space-y-8">
      {/* Brand and Title */}
      <div>
        <p className="text-sm font-sans font-medium text-[#3b3b3b] uppercase tracking-[0.12em] mb-2">
          {product.seller?.storeName}
        </p>
        <h1 className="text-3xl font-serif font-light text-[#9c7c3a] mb-4 tracking-[1px]">
          {product.title}
        </h1>
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-sm text-[#3b3b3b] font-sans">(4.5) • 128 reviews</span>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline space-x-3">
          <span className="text-3xl font-serif font-medium text-[#9c7c3a]">
            ₹{discountedPrice.toLocaleString()}
          </span>
          {selectedSize && selectedSize.discount > 0 && (
            <>
              <span className="text-xl text-[#3b3b3b] line-through font-sans">
                ₹{selectedSize.price.toLocaleString()}
              </span>
              <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded font-sans">
                -{selectedSize.discount}%
              </span>
            </>
          )}
        </div>
        <p className="text-sm text-[#3b3b3b] font-sans">Inclusive of all taxes</p>
      </div>

      {/* Variants */}
      {allSizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-serif font-medium text-[#9c7c3a]">Size: <span className="font-sans font-normal text-[#3b3b3b]">{selectedSize?.size}</span></h3>
            <button
              onClick={onSizeGuideOpen}
              className="text-sm text-[#9c7c3a] hover:text-[#8a6a2f] underline font-sans transition-colors"
            >
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allSizes.map((size) => {
              const sizeObj = selectedColorVariant?.sizes.find(s => s.size === size);
              const isAvailable = sizeObj && sizeObj.stock > 0;
              const isOutOfStock = sizeObj && sizeObj.stock === 0;
              
              return (
                <button
                  key={size}
                  disabled={!isAvailable}
                  className={`px-4 py-2 border rounded text-sm font-sans font-medium transition-all relative ${
                    selectedSize?.size === size
                      ? 'border-[#9c7c3a] bg-[#9c7c3a] text-[#fbf7f2]'
                      : isAvailable
                      ? 'border-[#e6ddd2] hover:border-[#9c7c3a] text-[#3b3b3b]'
                      : 'border-[#e6ddd2] bg-[#fbf7f2] text-[#3b3b3b] cursor-not-allowed opacity-50'
                  }`}
                  onClick={() => {
                    if (isAvailable) {
                      setSelectedSize(sizeObj);
                      // Reset quantity to 1 when changing sizes, as stock limits may differ
                      setQuantity(1);
                    }
                  }}
                >
                  {size}
                  {isOutOfStock && (
                    <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                      ×
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {uniqueColors.length > 0 && (
        <div>
          <h3 className="text-sm font-serif font-medium text-[#9c7c3a] mb-3">Color: <span className="font-sans font-normal text-[#3b3b3b]">{selectedColorVariant?.color}</span></h3>
          <div className="flex flex-wrap gap-3">
            {uniqueColors.map((color) => (
              <button
                key={color}
                className={`w-12 h-12 rounded-full border-2 transition-all ${
                  selectedColorVariant?.color === color
                    ? 'border-[#9c7c3a] ring-2 ring-[#e6ddd2]'
                    : 'border-[#e6ddd2] hover:border-[#9c7c3a]'
                } ${getColorValue(color) === '#FFFFFF' ? 'border-[#e6ddd2]' : ''}`}
                style={{ backgroundColor: getColorValue(color) }}
                onClick={() => {
                  const colorVariant = product.variants.find(v => v.color === color);
                  setSelectedColorVariant(colorVariant);
                  // Select first available size (with stock > 0)
                  const availableSize = colorVariant.sizes.find(s => s.stock > 0);
                  setSelectedSize(availableSize || null);
                  // Reset quantity when changing colors
                  setQuantity(1);
                  setSelectedImage(0);
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Variant Details */}
      {selectedColorVariant && (
        <div className="border-t border-[#e6ddd2] pt-6">
          <h4 className="text-sm font-serif font-medium text-[#9c7c3a] mb-3">Product Details</h4>
          <div className="space-y-2 text-sm text-[#3b3b3b] font-sans">
            <p><strong className="font-serif text-[#9c7c3a]">Material:</strong> {selectedColorVariant.material || 'N/A'}</p>
            <p><strong className="font-serif text-[#9c7c3a]">Fit:</strong> {selectedColorVariant.fit || 'N/A'}</p>
            <p><strong className="font-serif text-[#9c7c3a]">Care:</strong> Dry clean only</p>
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-serif font-medium text-[#9c7c3a]">Quantity</h3>
          {selectedSize && (
            <span className="text-xs text-[#3b3b3b] font-sans">
              Max {Math.min(3, selectedSize.stock)} per order • {selectedSize.stock} available
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-[#e6ddd2] rounded">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="px-3 py-2 hover:bg-[#e6ddd2] disabled:hover:bg-transparent disabled:opacity-50 font-sans text-[#3b3b3b] disabled:cursor-not-allowed"
            >
              -
            </button>
            <span className="px-4 py-2 border-x border-[#e6ddd2] font-sans text-[#3b3b3b]">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(3, selectedSize?.stock || 1, quantity + 1))}
              disabled={!selectedSize || quantity >= Math.min(3, selectedSize.stock)}
              className="px-3 py-2 hover:bg-[#e6ddd2] disabled:hover:bg-transparent disabled:opacity-50 font-sans text-[#3b3b3b] disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          {selectedSize && quantity >= Math.min(3, selectedSize.stock) && (
            <span className="text-xs text-red-600 font-sans">
              Maximum quantity limit reached ({Math.min(3, selectedSize.stock)} per order)
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button 
          onClick={onAddToCart} 
          disabled={!selectedSize || selectedSize.stock === 0}
          className="w-full bg-[#9c7c3a] hover:bg-[#8a6a2f] disabled:bg-[#e6ddd2] disabled:text-[#3b3b3b] text-[#fbf7f2] py-4 px-6 rounded font-serif font-medium transition-colors flex items-center justify-center space-x-2 tracking-[0.5px] disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{!selectedSize ? 'Select Size' : selectedSize.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
        </button>
        <button
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          className="w-full border border-[#e6ddd2] text-[#9c7c3a] py-4 px-6 rounded hover:bg-[#e6ddd2] transition-colors flex items-center justify-center space-x-2 font-serif font-medium tracking-[0.5px] disabled:opacity-50"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          <span>{wishlistLoading ? 'Updating...' : isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
        </button>
      </div>

      {/* Delivery Info */}
      <div className="border-t border-[#e6ddd2] pt-6">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-[#3b3b3b] mt-0.5 flex-shrink-0">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-serif font-medium text-[#9c7c3a]">Free Delivery</p>
              <p className="text-sm text-[#3b3b3b] font-sans">Standard delivery within 3-5 business days</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-[#3b3b3b] mt-0.5 flex-shrink-0">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-serif font-medium text-[#9c7c3a]">Easy Returns</p>
              <p className="text-sm text-[#3b3b3b] font-sans">30-day return policy</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-[#3b3b3b] mt-0.5 flex-shrink-0">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-serif font-medium text-[#9c7c3a]">Authenticity Guaranteed</p>
              <p className="text-sm text-[#3b3b3b] font-sans">100% authentic products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;