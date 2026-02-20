import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import ProductGrid from '../components/ProductGrid';
import { useToast } from '../../Admin/components/UI';
import HeroSlider from '../components/HeroSlider';
import ShopByCategory from '../../components/ShopByCategory';
import { getFeaturedProducts } from '../../services/api';


const Home = () => {
  const { showError } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch featured products only (categories are now fetched by ShopByCategory component)
      const featuredData = await getFeaturedProducts(12);
      setFeaturedProducts(featuredData);
    } catch (err) {
      console.error('Error fetching home data:', err);
      const errorMsg = 'Failed to load data. Please try again later.';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-16"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Content</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchHomeData();
            }}
            className="bg-[#9c7c3a] text-white px-6 py-3 rounded-lg hover:bg-[#8a6a2f] transition-colors font-serif font-medium"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <HeroSlider />

        {/* Categories Section - Using New Category Display API */}
        <ShopByCategory />

        {/* Featured Products */}
        <section className="py-10 px-2 md:px-8 bg-[#fbf7f2]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 tracking-[3px] text-[#9c7c3a]">
                FEATURED PRODUCTS
              </h2>
              <p className="text-[#3b3b3b] text-lg font-sans font-light mb-2">
                Discover our curated collection
              </p>
            
            </div>
            {featuredProducts.length > 0 ? (
              <ProductGrid products={featuredProducts} />
            ) : (
              <div className="text-center py-16">
                <p className="text-[#3b3b3b] text-lg font-sans">No featured products available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 px-4 md:px-8 bg-[#3b3b3b] text-[#fbf7f2]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6 tracking-[3px]">
              STAY UPDATED
            </h2>
            <p className="text-[#fbf7f2]/80 mb-8 text-lg font-sans font-light">
              Subscribe to receive updates on new arrivals and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-[#fbf7f2] text-[#3b3b3b] placeholder-[#3b3b3b]/60 focus:outline-none font-sans border border-[#e6ddd2]"
              />
              <button className="px-8 py-3 bg-[#9c7c3a] text-[#fbf7f2] font-serif font-medium hover:bg-[#8a6a2f] transition-colors tracking-[1px]">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;