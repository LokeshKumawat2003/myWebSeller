import React, { useEffect, useState } from 'react';
import { Sliders, X } from 'lucide-react';

const FilterSidebar = ({ filters, onFilterChange, isOpen: isOpenProp, onToggle }) => {
  const [isOpen, setIsOpen] = useState(Boolean(isOpenProp));

  useEffect(() => {
    if (typeof isOpenProp === 'boolean') setIsOpen(isOpenProp);
  }, [isOpenProp]);

  const handleToggle = () => {
    if (onToggle) return onToggle();
    setIsOpen(prev => !prev);
  };
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
    { label: 'Over ₹5000', min: 5000, max: Infinity }
  ];

  const handleSizeChange = (size) => {
    const currentSizes = filters.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];

    onFilterChange({
      ...filters,
      sizes: newSizes
    });
  };

  const handlePriceChange = (min, max) => {
    onFilterChange({
      ...filters,
      priceRange: { min, max }
    });
  };

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={handleToggle}
        className={`md:hidden fixed bottom-6 right-6 bg-[#9c7c3a] text-[#fbf7f2] p-4 rounded-full shadow-xl z-[70] hover:bg-[#8a6a2f] transition-colors ${
          isOpen ? 'hidden' : 'flex'
        }`}
        aria-label="Open filters"
      >
        <Sliders className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={handleToggle}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isOpen ? 'block' : 'hidden'} md:block
        fixed top-0 left-0 md:relative md:top-auto md:left-auto
        h-full md:h-auto md:max-h-[calc(100vh-2rem)]
        w-full sm:w-80 md:w-72 lg:w-80 md:flex-shrink-0
        bg-[#fbf7f2] border-r border-[#e6ddd2] shadow-xl md:shadow-none md:rounded-none
        transform transition-transform duration-300 ease-in-out z-50 md:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        overflow-y-auto
      `}>
        {/* Sidebar Content */}
        <div className="p-4 md:p-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h3 className="text-xl font-serif font-medium text-[#9c7c3a] tracking-[2px]">Filters</h3>
            <button
              onClick={handleToggle}
              className="p-2 hover:bg-[#e6ddd2] rounded-full transition-colors"
              aria-label="Close filters"
            >
              <X className="w-6 h-6 text-[#3b3b3b]" />
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block mb-6">
            <h3 className="text-lg font-serif font-medium text-[#9c7c3a] mb-2 tracking-[2px]">Filters</h3>
            <p className="text-sm text-[#3b3b3b] font-sans">Refine your search</p>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <h4 className="text-sm font-serif font-medium text-[#9c7c3a] mb-3 uppercase tracking-[1px]">
              Size
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <label key={size} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={(filters.sizes || []).includes(size)}
                    onChange={() => handleSizeChange(size)}
                    className="w-4 h-4 text-[#9c7c3a] border-[#e6ddd2] rounded focus:ring-[#9c7c3a] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-[#3b3b3b] font-sans group-hover:text-[#9c7c3a] transition-colors font-medium">
                    {size}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="text-sm font-serif font-medium text-[#9c7c3a] mb-3 uppercase tracking-[1px]">
              Price Range
            </h4>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label key={range.label} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange?.min === range.min && filters.priceRange?.max === range.max}
                    onChange={() => handlePriceChange(range.min, range.max)}
                    className="w-4 h-4 text-[#9c7c3a] border-[#e6ddd2] focus:ring-[#9c7c3a] focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-[#3b3b3b] font-sans group-hover:text-[#9c7c3a] transition-colors">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => onFilterChange({})}
            className="w-full bg-[#9c7c3a] text-[#fbf7f2] py-3 px-4 rounded-lg hover:bg-[#8a6a2f] transition-colors text-sm font-serif font-medium uppercase tracking-[1px]"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      
    </>
  );
};

export default FilterSidebar;