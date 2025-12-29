import React from 'react';
import { ChevronDown } from 'lucide-react';

const SortDropdown = ({ options, value, onChange, label = "Sort by:" }) => {
  const sortLabels = {
    'newest': 'Newest',
    'price-low': 'Price: Low to High',
    'price-high': 'Price: High to Low',
    'popular': 'Most Popular',
    'rating': 'Highest Rated'
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-serif font-medium text-[#9c7c3a] tracking-[1px]">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-[#fbf7f2] border border-[#e6ddd2] rounded-md px-4 py-2 pr-8 text-sm font-sans text-[#3b3b3b] focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent hover:border-[#9c7c3a] transition-colors cursor-pointer"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {sortLabels[option] || option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9c7c3a] pointer-events-none" />
      </div>
    </div>
  );
};

export default SortDropdown;