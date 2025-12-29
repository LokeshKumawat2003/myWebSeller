import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import ProductGrid from '../components/ProductGrid';
import CollectionSection from '../components/CollectionSection';
import { getProducts, listCategories } from '../../services/api';

const Search = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q') || '';
  });
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Closed by default on all devices
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newQuery = params.get('q') || '';
    setSearchQuery(newQuery);
    
    // Scroll to top immediately when search query changes
    setTimeout(() => window.scrollTo(0, 0), 0);
  }, [location.search]);

  useEffect(() => {
    if (searchQuery) {
      fetchSearchData();
    } else {
      // If no search query, still scroll to top
      setTimeout(() => window.scrollTo(0, 0), 0);
    }
  }, [searchQuery]);

  const fetchSearchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        listCategories()
      ]);

      setAllProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching search data:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.seller && product.seller.storeName && product.seller.storeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.category && product.category.name && product.category.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(product =>
        product.category && product.category.name && product.category.name.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

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
          return 0; // Keep original order
      }
    });

    return filtered;
  }, [searchQuery, filters, sortBy, allProducts]);

  return (
    <Layout>
      <div className="bg-[#fbf7f2]">
        {/* Full Width Search Bar */}
        {/* <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div> */}

        {/* Search and Filter Bar */}
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
                  {filteredAndSortedProducts.length} products found
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
          <div className="flex-1 p-4 md:p-6 md:ml-72 lg:ml-0">
            <ProductGrid
              products={filteredAndSortedProducts}
              loading={loading}
              emptyMessage={searchQuery ? `No products found for "${searchQuery}"` : "No products found matching your criteria"}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;