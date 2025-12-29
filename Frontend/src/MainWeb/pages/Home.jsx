import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import ProductGrid from '../components/ProductGrid';
import { Sliders } from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import { getFeaturedProducts, listCategories } from '../../services/api';


const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch featured products and categories in parallel
      const [featuredData, categoriesData] = await Promise.all([
        getFeaturedProducts(12), // Get up to 12 featured products
        listCategories()
      ]);

      setFeaturedProducts(featuredData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching home data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fallback categories if API fails
  const fallbackCategories = [
    {
      name: "Men",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      slug: "men"
    },
    {
      name: "Women",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
      slug: "women"
    },
    {
      name: "Sneakers",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      slug: "sneakers"
    }
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

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
            onClick={fetchHomeData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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

        {/* Categories Section */}
        <section className="py-20 px-4 md:px-8 bg-[#fbf7f2]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 tracking-[3px] text-[#9c7c3a]">
              SHOP BY CATEGORY
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {displayCategories.map((category, index) => (
                <a
                  key={index}
                  href={`/${category.slug || category.name.toLowerCase()}`}
                  className="group relative overflow-hidden bg-[#e6ddd2] aspect-square hover:shadow-lg transition-all duration-300"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-[#3b3b3b] text-xl md:text-2xl font-serif tracking-[2px] font-medium">
                      {category.name}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 px-4 md:px-8 bg-[#fbf7f2]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 tracking-[3px] text-[#9c7c3a]">
                FEATURED PRODUCTS
              </h2>
              <p className="text-[#3b3b3b] text-lg font-sans font-light">
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