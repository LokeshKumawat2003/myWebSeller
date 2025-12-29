import React from 'react';
import ProductCard from './ProductCard';
import { Package } from 'lucide-react';

const ProductList = ({ products, onEdit, onDelete, accountBlocked, getProductMatrix, findProductVariant }) => {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-500">Start by adding your first product to showcase your collection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          accountBlocked={accountBlocked}
          getProductMatrix={getProductMatrix}
          findProductVariant={findProductVariant}
        />
      ))}
    </div>
  );
};

export default ProductList;