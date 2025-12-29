import React from 'react';
import { Package, CheckCircle, Clock, FileText, XCircle } from 'lucide-react';

const ProductStats = ({ total, approved, pending, draft, rejected }) => {
  const stats = [
    {
      label: 'Total Products',
      value: total,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    {
      label: 'Approved',
      value: approved,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700'
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700'
    },
    {
      label: 'Draft',
      value: draft,
      icon: FileText,
      color: 'bg-gray-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-700'
    },
    {
      label: 'Rejected',
      value: rejected,
      icon: XCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} p-6 rounded-xl border ${stat.borderColor} hover:shadow-md transition-shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-3xl font-bold ${stat.textColor} mb-1`}>{stat.value}</p>
              <p className={`text-sm font-medium ${stat.textColor}`}>{stat.label}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductStats;