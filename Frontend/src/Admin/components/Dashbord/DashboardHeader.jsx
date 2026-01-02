import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Card, Button } from '../UI';

const DashboardHeader = ({ onRefresh, loading }) => {
  return (
    <Card className="luxury-text-primary" padding="p-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="luxury-text-secondary">Manage sellers, products, orders and users efficiently</p>
        </div>
        <Button
          variant="primary"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </Card>
  );
};

export default DashboardHeader;