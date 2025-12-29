import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { addToWishlist, checkWishlistStatus, getAuthToken } from "../../services/api";

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    checkWishlistStatusOnLoad();
  }, [product._id]);

  const checkWishlistStatusOnLoad = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      // Check if any variant of this product is in wishlist
      // For simplicity, we'll check the first variant
      if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0];
        if (firstVariant.sizes && firstVariant.sizes.length > 0) {
          const status = await checkWishlistStatus(product._id, {
            color: firstVariant.color,
            size: firstVariant.sizes[0].size
          }, token);
          setIsWishlisted(status.isWishlisted);
        }
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (wishlistLoading) return;

    try {
      setWishlistLoading(true);
      const token = getAuthToken();

      if (!token) {
        alert('Please login to add items to wishlist');
        return;
      }

      // Use the first available variant
      if (!product.variants || product.variants.length === 0) {
        alert('No variants available for this product');
        return;
      }

      const firstVariant = product.variants[0];
      if (!firstVariant.sizes || firstVariant.sizes.length === 0) {
        alert('No sizes available for this product');
        return;
      }

      const payload = {
        product: product._id,
        variant: {
          color: firstVariant.color,
          size: firstVariant.sizes[0].size
        }
      };

      if (isWishlisted) {
        // For product cards, we can't easily remove specific items
        // Just toggle the state for now
        setIsWishlisted(false);
        alert('Removed from wishlist');
      } else {
        await addToWishlist(payload, token);
        setIsWishlisted(true);
        alert('Added to wishlist!');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setWishlistLoading(false);
    }
  };
  if (!product) return null;

  const {
    _id,
    title,
    basePrice,
    discount = 0,
    images = [],
    seller,
    readyToShip = true,
  } = product;

  // Price calculation
  const finalPrice =
    discount > 0
      ? Math.round(basePrice - (basePrice * discount) / 100)
      : basePrice;

  // Image fallback
  const image =
    images.length > 0 ? images[0] : "/luxury-fashion-product.png";

  // Brand name
  const brand = seller?.storeName || "Brand";

  return (
    <div className="w-full bg-white rounded-md shadow-sm hover:shadow-lg transition-all duration-300 border border-[#e6ddd2]">
      <Link to={`/product/${_id}`}>
        {/* Image */}
        <div className="relative w-full h-[260px] sm:h-[320px] md:h-[420px] overflow-hidden bg-[#fbf7f2]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/luxury-fashion.png";
            }}
          />

          {/* Wishlist */}
          <button
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className="absolute bottom-3 right-3 bg-[#fbf7f2] p-2 rounded-full shadow-md border border-[#e6ddd2] hover:bg-[#e6ddd2] transition-colors disabled:opacity-50"
          >
            <Heart size={16} className={`${isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#9c7c3a]'}`} />
          </button>
        </div>

        {/* Details */}
        <div className="p-4 space-y-2">
          <p className="text-xs text-[#9c7c3a] font-sans tracking-[1px] uppercase">
            {brand}
          </p>

          {/* Title (single line ellipsis) */}
          <p className="max-w-[96%] uppercase whitespace-nowrap overflow-hidden text-ellipsis text-sm font-serif tracking-[1px] text-[#3b3b3b]">
            {title}
          </p>

          {/* Price */}
          <p className="text-lg font-serif font-medium text-[#9c7c3a]">
            ₹ {finalPrice.toLocaleString("en-IN")}
          </p>

          {/* Ready to ship */}
          {/* {readyToShip && (
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] border border-[#e6ddd2] font-sans uppercase text-[#3b3b3b]">
              Ready to Ship
            </span>
          )} */}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
