import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useToast } from '../../Admin/components/UI';
import { getProduct, addCartItem, getAuthToken } from '../../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const { showError, showSuccess } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColorVariant, setSelectedColorVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const navigate = useNavigate();

  // Lazy load subcomponents for performance
  
const  ProductReviews = React.lazy(() => import('./ProductDetail/ProductReviews'));
  const ProductImages = React.lazy(() => import('./ProductDetail/ProductImages'));
  const ProductInfo = React.lazy(() => import('./ProductDetail/ProductInfo'));
  const ProductDescription = React.lazy(() => import('./ProductDetail/ProductDescription'));
  const SizeGuide = React.lazy(() => import('./ProductDetail/SizeGuide'));
  // Color mapping for swatches
  const colorMap = {
    'black': '#000000',
    'white': '#FFFFFF',
    'red': '#FF0000',
    'blue': '#0000FF',
    'green': '#00FF00',
    'yellow': '#FFFF00',
    'purple': '#800080',
    'pink': '#FFC0CB',
    'gray': '#808080',
    'brown': '#A52A2A',
    'orange': '#FFA500',
    'navy': '#000080',
    'maroon': '#800000',
    'beige': '#F5F5DC',
    'cream': '#FFFDD0'
  };

  const getColorValue = (colorName) => {
    if (!colorName) return '#CCCCCC';

    // If the colorName is already a hex value, use it directly
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(colorName.trim())) return colorName.trim();

    // Try to find matching variant from the product data (prefer API-supplied color hex)
    if (product && Array.isArray(product.variants)) {
      const match = product.variants.find(v => v.color && v.color.toLowerCase() === colorName.toLowerCase());
      if (match) {
        // common field names that APIs might use for color hex/code
        const candidate = match.colorValue || match.colorHex || match.hex || match.hexCode || match.color_code || match.color_code_hex;
        if (candidate) return candidate;
      }
    }

    // Fallback to built-in color map
    return colorMap[colorName.toLowerCase()];
  };

  useEffect(() => {
    fetchProduct();
    // Scroll to top when product detail page loads
    window.scrollTo(0, 0);
  }, [id]);

  // Adjust quantity when selected size changes to respect stock limits and max 3 limit
  useEffect(() => {
    if (selectedSize && quantity > Math.min(3, selectedSize.stock)) {
      setQuantity(Math.min(quantity, Math.min(3, selectedSize.stock)));
    }
  }, [selectedSize]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      showError('Please select a size');
      return;
    }

    if (selectedSize.stock === 0) {
      showError('This size is currently out of stock');
      return;
    }

    if (quantity > Math.min(3, selectedSize.stock)) {
      showError(`Maximum quantity per order is ${Math.min(3, selectedSize.stock)} items`);
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        showError('Please login to add items to cart');
        return;
      }

      const payload = {
        product: product._id || product.id,
        variant: {
          color: selectedColorVariant.color,
          size: selectedSize.size
        },
        qty: quantity,
        price: discountedPrice
      };


      await addCartItem(payload, token);
      showSuccess('Item added to cart successfully!');
      navigate("/shopping-cart")
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Failed to add item to cart. Please try again.');
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProduct(id);

      // Check if variants are already grouped (have sizes array) or flat
      const isGrouped = productData.variants && productData.variants.length > 0 && productData.variants[0].sizes;

      if (!isGrouped) {
        // Group variants by color
        const groupedVariants = productData.variants.reduce((acc, variant) => {
          const color = variant.color;
          if (!acc[color]) {
            acc[color] = { color, sizes: [], images: variant.images || [] };
          }
          acc[color].sizes.push({
            size: variant.size,
            price: variant.price || productData.basePrice,
            stock: variant.stock,
            discount: variant.discount || 0
          });
          return acc;
        }, {});
        productData.variants = Object.values(groupedVariants);
      }

      setProduct(productData);
      const colorVariant = productData.variants?.[0];
      setSelectedColorVariant(colorVariant || null);
      // Select first available size (with stock > 0)
      const availableSize = colorVariant?.sizes?.find(s => s.stock > 0);
      setSelectedSize(availableSize || null);
      setSelectedImage(0);
    } catch (error) {
      console.error('Error fetching product:', error);
      // For demo purposes, keep the sample data as fallback
      const sampleProduct = {
        _id: id,
        title: "Premium Cotton Shirt",
        description: "Experience ultimate comfort with our premium cotton shirt. Made from 100% organic cotton, this shirt offers breathability and style that lasts. Perfect for casual outings or office wear.",
        basePrice: 2300,
        discount: 10,
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1506629905607-0b5ab9a9e21a?w=600&h=600&fit=crop"
        ],
        seller: {
          _id: "seller-1",
          storeName: "Fashion Hub",
          approved: true,
          blocked: false
        },
        category: {
          _id: "cat-1",
          name: "Men's Clothing"
        },
        variants: [
          { size: "S", color: "White", stock: 10 },
          { size: "M", color: "White", stock: 15 },
          { size: "L", color: "White", stock: 8 },
          { size: "XL", color: "White", stock: 5 }
        ],
        status: "approved",
        isBlocked: false,
        isFeatured: true,
        isNew: true,
        isTrending: false,
        createdAt: "2024-01-15T10:00:00Z"
      };

      // Group sample variants (always flat)
      const groupedSampleVariants = sampleProduct.variants.reduce((acc, variant) => {
        const color = variant.color;
        if (!acc[color]) {
          acc[color] = { color, sizes: [], images: variant.images || [] };
        }
        acc[color].sizes.push({
          size: variant.size,
          price: variant.price || sampleProduct.basePrice,
          stock: variant.stock,
          discount: variant.discount || 0
        });
        return acc;
      }, {});
      sampleProduct.variants = Object.values(groupedSampleVariants);

      setProduct(sampleProduct);
      const colorVariant = sampleProduct.variants[0];
      setSelectedColorVariant(colorVariant);
      // Select first available size (with stock > 0)
      const availableSize = colorVariant.sizes.find(s => s.stock > 0);
      setSelectedSize(availableSize || null);
      setSelectedImage(0);
    } finally {
      setLoading(false);
    }
  };
  const productId = product?.id || product?._id;

  console.log("Product ID for reviews:", productId);
  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-[#e6ddd2] rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-[#e6ddd2] rounded-lg"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-[#e6ddd2] rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-[#e6ddd2] rounded w-3/4"></div>
                <div className="h-6 bg-[#e6ddd2] rounded w-1/2"></div>
                <div className="h-32 bg-[#e6ddd2] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif font-medium text-[#9c7c3a] mb-4 tracking-[2px]">Product Not Found</h1>
          <p className="text-[#3b3b3b] font-sans mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/" className="bg-[#9c7c3a] hover:bg-[#8a6a2f] text-[#fbf7f2] font-serif font-medium px-6 py-3 rounded-lg transition-colors tracking-[0.5px]">
            Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  const discountedPrice = selectedSize && selectedSize.discount > 0
    ? Math.round(selectedSize.price - (selectedSize.price * selectedSize.discount) / 100)
    : selectedSize?.price || product.basePrice;

  const allSizes = [...new Set(product.variants.flatMap(v => v.sizes.map(s => s.size)))];
  const uniqueSizes = selectedColorVariant ? selectedColorVariant.sizes.map(s => s.size) : [];
  const uniqueColors = [...new Set(product.variants.map(v => v.color))];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <React.Suspense fallback={<div className="animate-pulse h-32 bg-[#e6ddd2] rounded mb-8" />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ProductImages
              product={product}
              selectedColorVariant={selectedColorVariant}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />
            <ProductInfo
              product={product}
              selectedColorVariant={selectedColorVariant}
              selectedSize={selectedSize}
              discountedPrice={discountedPrice}
              allSizes={allSizes}
              uniqueSizes={uniqueSizes}
              uniqueColors={uniqueColors}
              setSelectedSize={setSelectedSize}
              setSelectedColorVariant={setSelectedColorVariant}
              setSelectedImage={setSelectedImage}
              quantity={quantity}
              setQuantity={setQuantity}
              isWishlisted={isWishlisted}
              setIsWishlisted={setIsWishlisted}
              getColorValue={getColorValue}
              onSizeGuideOpen={() => setIsSizeGuideOpen(true)}
              onAddToCart={handleAddToCart}
            />
          </div>
          <ProductDescription product={product} />
          <ProductReviews productId={productId} />
          <SizeGuide
            isOpen={isSizeGuideOpen}
            onClose={() => setIsSizeGuideOpen(false)}
          />
        </React.Suspense>
      </div>
    </Layout>
  );
};

export default ProductDetail;
