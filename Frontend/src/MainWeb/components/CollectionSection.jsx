import React from 'react';
import ProductGrid from './ProductGrid';

const CollectionSection = ({
  title,
  subtitle,
  products,
  backgroundClass = "bg-white",
  showViewAll = false,
  viewAllLink = "#",
  loading = false
}) => {
  return (
    <section className={`${backgroundClass} py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 text-lg">{subtitle}</p>
          )}
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} loading={loading} />

        {/* View All Button */}
        {showViewAll && products && products.length > 0 && (
          <div className="text-center mt-12">
            <a
              href={viewAllLink}
              className="inline-block bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors rounded-md"
            >
              View All {title}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionSection;