import React from 'react';
import { Package, ShoppingBag } from 'lucide-react';

const RecentProducts = ({ products }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Package className="mr-2 w-6 h-6" />
        Recent Products
      </h2>
      {products && products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Product Name</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Price</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Stock</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((product, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{product.title || product.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-700">₹{product.basePrice || product.price || '0'}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {product.variants && product.variants.length > 0
                      ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
                      : product.stock || '0'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : product.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.status === 'approved' ? 'Approved' : product.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">No products yet.</p>
          <p className="text-gray-400 text-sm">Start by adding your first product!</p>
        </div>
      )}
    </div>
  );
};

export default RecentProducts;