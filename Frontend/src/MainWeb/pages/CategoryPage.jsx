import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import CollectionHero from '../components/CollectionHero';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import ProductGrid from '../components/ProductGrid';
import CollectionSection from '../components/CollectionSection';
import { getProducts, getNavigations } from '../../services/api';

const CategoryPage = () => {
  const { slug } = useParams();
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [error, setError] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);

  useEffect(() => {
    fetchCategoryData();
    // Scroll to top when category page loads
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch navigations to get category info
      const navigations = await getNavigations();
      const currentCategory = navigations.find(nav => nav.slug === slug);

      if (currentCategory) {
        setCategoryInfo(currentCategory);
      } else {
        setCategoryInfo({ name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), slug });
      }

      const productsData = await getProducts();

      // Filter products for the category based on clothingType only
      const categoryProducts = productsData.filter(product => {
        const clothingType = product.clothingType?.toLowerCase() || '';
        const slugNormalized = slug.replace(/-/g, ' ').toLowerCase();

        return clothingType === slugNormalized;
      });

      setAllProducts(categoryProducts);
    } catch (err) {
      console.error('Error fetching category products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Apply filters

    if (filters.priceRange) {
      filtered = filtered.filter(product => {
        const price = product.discount > 0
          ? product.basePrice - (product.basePrice * product.discount / 100)
          : product.basePrice;
        return price >= filters.priceRange.min && price <= filters.priceRange.max;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const priceA = a.discount > 0 ? a.basePrice - (a.basePrice * a.discount / 100) : a.basePrice;
      const priceB = b.discount > 0 ? b.basePrice - (b.basePrice * b.discount / 100) : b.basePrice;

      switch (sortBy) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'newest':
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters, sortBy, allProducts]);

  // Dynamic hero images based on category
  const getHeroImage = (slug) => {
    const imageMap = {
      women: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&q=80&w=1600&auto=format&fit=crop",
      men: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-4.0.3&q=80&w=1600&auto=format&fit=crop",
      wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&q=80&w=1600&auto=format&fit=crop",
      jewelry: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&q=80&w=1600&auto=format&fit=crop",
      accessories: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&q=80&w=1600&auto=format&fit=crop",
      gifting: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&q=80&w=1600&auto=format&fit=crop",
      "celebrity-closet": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&q=80&w=1600&auto=format&fit=crop",
    };

    // Return specific image or fallback
    return imageMap[slug] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&q=80&w=1600&auto=format&fit=crop";
  };

  return (
    <Layout>
      <div className="bg-[#fbf7f2]">
        {/* Hero Section */}
        <CollectionHero
          title={`${categoryInfo?.name || 'Collection'} Collection`}
          subtitle={`Discover the latest trends and styles for ${categoryInfo?.name || 'this collection'}`}
          imageUrl={getHeroImage(slug)}
        />

        {/* Filter and Sort Bar */}
        <div className="bg-[#fbf7f2] border-b border-[#e6ddd2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`md:hidden flex items-center space-x-2 bg-white px-4 py-2 rounded-md border border-[#e6ddd2] hover:border-[#9c7c3a] transition-colors ${
                  isFilterOpen ? 'hidden' : 'flex'
                }`}
              >
                <span className="text-sm font-sans font-medium text-[#3b3b3b]">Filters</span>
              </button>

              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-[#3b3b3b] font-sans">
                  {filteredAndSortedProducts.length} products
                </span>
              </div>

              <SortDropdown
                options={['newest', 'price-low', 'price-high']}
                value={sortBy}
                onChange={setSortBy}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(!isFilterOpen)}
            products={allProducts}
          />

          {/* Products */}
          <div className="flex-1 p-4 md:p-6">
            <ProductGrid
              products={filteredAndSortedProducts}
              loading={loading}
              emptyMessage={`No ${categoryInfo?.name || 'products'} found matching your criteria`}
            />
          </div>
        </div>

        {/* Social Proof */}
        <section className="py-16 bg-[#3b3b3b] text-[#fbf7f2] text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif font-medium mb-4 tracking-[2px]">HOMEGROWN INDIAN BRAND</h2>
            <p className="text-[#fbf7f2]/80 text-lg font-sans">Over 6 Million Happy Customers</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CategoryPage;