import React from 'react';
import { Filter } from 'lucide-react';

const ProductFilters = ({ statusFilter, onFilterChange }) => {
  const filters = [
    { key: '', label: 'All', color: 'bg-gray-600 hover:bg-gray-700' },
    { key: 'draft', label: 'Draft', color: 'bg-gray-600 hover:bg-gray-700' },
    { key: 'pending', label: 'Pending', color: 'bg-yellow-600 hover:bg-yellow-700' },
    { key: 'approved', label: 'Approved', color: 'bg-green-600 hover:bg-green-700' },
    { key: 'rejected', label: 'Rejected', color: 'bg-red-600 hover:bg-red-700' }
  ];

  return (
    <div className="luxury-bg rounded-xl shadow-sm luxury-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 luxury-accent" />
        <h3 className="text-lg font-semibold luxury-text-primary italic">Filter by Status</h3>
      </div>
      <div className="flex gap-3 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === filter.key
                ? 'luxury-accent text-white shadow-md'
                : `luxury-text-primary luxury-bg-secondary hover:bg-luxury-accent hover:text-white`
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductFilters;