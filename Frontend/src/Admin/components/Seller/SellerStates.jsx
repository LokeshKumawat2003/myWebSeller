import React from 'react';
import { Users } from 'lucide-react';
import { Card, Loading } from '../UI';

const SellerLoadingState = () => {
  return (
    <Card padding="p-12">
      <Loading text="Loading sellers..." size="large" />
    </Card>
  );
};

const SellerEmptyState = () => {
  return (
    <Card padding="p-12">
      <div className="text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium luxury-text-primary mb-2 italic">No sellers found</h3>
        <p className="luxury-text-secondary italic">Seller registrations will appear here once users sign up</p>
      </div>
    </Card>
  );
};

export { SellerLoadingState, SellerEmptyState };