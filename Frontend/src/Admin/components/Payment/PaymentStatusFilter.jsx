import React from 'react';

const PaymentStatusFilter = ({ statusFilter, onStatusChange }) => {
  const filters = [
    { key: '', label: 'All', color: 'bg-gray-600 hover:bg-gray-700' },
    { key: 'pending', label: 'Pending', color: 'bg-amber-600 hover:bg-amber-700' },
    { key: 'approved', label: 'Approved', color: 'bg-blue-600 hover:bg-blue-700' },
    { key: 'paid', label: 'Paid', color: 'bg-green-600 hover:bg-green-700' },
    { key: 'rejected', label: 'Rejected', color: 'bg-red-600 hover:bg-red-700' }
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onStatusChange(filter.key)}
          className={`px-6 py-2 rounded-lg font-medium transition-colors text-white ${
            statusFilter === filter.key
              ? filter.color.replace('hover:', '')
              : `bg-gray-200 hover:bg-gray-300 text-gray-700`
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default PaymentStatusFilter;