import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useToast } from '../../Admin/components/UI';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { getWishlist, removeFromWishlist, addCartItem, getAuthToken } from '../../services/api';

const WishlistPage = () => {
  const { showError, showSuccess } = useToast();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
    // Scroll to top when wishlist page loads
    window.scrollTo(0, 0);
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        // Show login prompt for unauthenticated users
        setWishlistItems([]);
      } else {
        const data = await getWishlist(token);
        setWishlistItems(data || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await removeFromWishlist(itemId, token);
      setWishlistItems(wishlistItems.filter(item => item._id !== itemId));
      showSuccess('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showError('Failed to remove item from wishlist');
    }
  };

  const addToCart = async (item) => {
    try {
      const token = getAuthToken();
      if (!token) {
        showError('Please login to add items to cart');
        return;
      }

      const payload = {
        product: item.product._id,
        variant: item.variant,
        qty: 1,
        price: (() => {
          const basePrice = item.product?.basePrice || 0;
          const discount = item.product?.discount || 0;
          return discount > 0
            ? Math.round(basePrice - (basePrice * discount) / 100)
            : basePrice;
        })()
      };

      await addCartItem(payload, token);
      showSuccess('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-[#e6ddd2] rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#e6ddd2] rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-medium text-[#9c7c3a] mb-2 tracking-[2px]">My Wishlist</h1>
          <p className="text-[#3b3b3b] font-sans">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-[#e6ddd2] mx-auto mb-4" />
            <h2 className="text-xl font-serif font-medium text-[#9c7c3a] mb-2 tracking-[1px]">Your wishlist is empty</h2>
            <p className="text-[#3b3b3b] font-sans mb-8">
              {getAuthToken() ? 'Start adding items you love to your wishlist' : 'Please login to view your wishlist'}
            </p>
            {getAuthToken() ? (
              <Link
                to="/"
                className="inline-block bg-[#9c7c3a] hover:bg-[#8a6a2f] text-[#fbf7f2] font-serif font-medium px-8 py-3 rounded-lg transition-colors tracking-[0.5px]"
              >
                Continue Shopping
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-block bg-[#9c7c3a] hover:bg-[#8a6a2f] text-[#fbf7f2] font-serif font-medium px-8 py-3 rounded-lg transition-colors tracking-[0.5px]"
              >
                Login to View Wishlist
              </Link>
            )}
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-sm border border-[#e6ddd2] overflow-hidden group hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Link to={`/product/${item.product._id}`}>
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-[#3b3b3b]" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/product/${item.product._id}`}>
                    <h3 className="font-serif font-medium text-[#9c7c3a] mb-2 line-clamp-2 hover:text-[#8a6a2f] transition-colors">
                      {item.product.title}
                    </h3>
                  </Link>

                  {/* Variant Info */}
                  <div className="text-sm text-[#3b3b3b] font-sans mb-3">
                    <p>Color: {item.variant.color}</p>
                    <p>Size: {item.variant.size}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-serif font-medium text-[#9c7c3a]">
                        ₹{(() => {
                          const basePrice = item.product?.basePrice || 0;
                          const discount = item.product?.discount || 0;
                          const finalPrice = discount > 0
                            ? Math.round(basePrice - (basePrice * discount) / 100)
                            : basePrice;
                          return finalPrice.toLocaleString();
                        })()}
                      </span>
                      {(item.product?.discount || 0) > 0 && (
                        <span className="text-sm text-[#3b3b3b] line-through font-sans">
                          ₹{(item.product?.basePrice || 0).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {(item.product?.discount || 0) > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-sans">
                        -{item.product.discount}%
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 bg-[#9c7c3a] hover:bg-[#8a6a2f] text-[#fbf7f2] font-serif font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 tracking-[0.5px]"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WishlistPage;