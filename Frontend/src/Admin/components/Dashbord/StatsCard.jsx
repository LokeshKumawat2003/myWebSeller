import React from 'react';
import { Card } from '../UI';

const StatsCard = ({ title, value, icon: Icon, color = 'bg-blue-500' }) => {
  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium italic luxury-text-secondary mb-1">{title}</p>
          <p className="text-3xl font-bold italic luxury-text-primary">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;