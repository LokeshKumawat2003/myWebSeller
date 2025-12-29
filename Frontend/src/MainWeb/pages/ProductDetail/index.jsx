import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getProduct } from '../../../services/api';
import ProductImages from './ProductImages';
import ProductInfo from './ProductInfo';
import ProductDescription from './ProductDescription';
import ProductReviews from './ProductReviews';
import SizeGuide from './SizeGuide';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColorVariant, setSelectedColorVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

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
    return colorMap[colorName.toLowerCase()] || '#CCCCCC';
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    console.log('Add to Cart clicked');
   
    // if (!selectedSize || !selectedColorVariant) {
    //   alert('Please select a size and color');
    //   return;
    // }
    // try {
    //   const productId = product._id || product.id;
    //   const payload = {
    //     product: productId,
    //     variant: {
    //       color: selectedColorVariant.color,
    //       size: selectedSize.size
    //     },
    //     qty: quantity,
    //     price: discountedPrice
    //   };
    //    console.log('Add to Cart clicked');
    //   await addCartItem(payload);
    //   alert('Added to cart successfully!');
    // } catch (error) {
    //   console.error('Error adding to cart:', error);
    //   alert('Failed to add to cart: ' + error.message);
    // }
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
      setSelectedSize(colorVariant?.sizes?.[0] || null);
      setSelectedImage(0);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
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

        <ProductReviews />

        <SizeGuide
          isOpen={isSizeGuideOpen}
          onClose={() => setIsSizeGuideOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default ProductDetail;