import React from 'react';
import { Package, ShoppingBag } from 'lucide-react';

const RecentProducts = ({ products }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-[#e6ddd2]">
      <h2 className="text-xl md:text-2xl font-light italic text-[#3b3b3b] mb-4 flex items-center font-serif">
        <Package className="mr-2 w-6 h-6 text-[#9c7c3a]" />
        Recent Products
      </h2>
      {products && products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#fbf7f2]">
              <tr>
                <th className="px-4 py-3 text-left text-[#666] italic font-serif">Product Name</th>
                <th className="px-4 py-3 text-left text-[#666] italic font-serif">Price</th>
                <th className="px-4 py-3 text-left text-[#666] italic font-serif">Stock</th>
                <th className="px-4 py-3 text-left text-[#666] italic font-serif">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((product, idx) => (
                <tr key={idx} className="border-b border-[#e6ddd2] hover:bg-[#fbf7f2] transition-colors">
                  <td className="px-4 py-3 font-light italic text-[#3b3b3b] font-serif">{product.title || product.name || 'N/A'}</td>
                  <td className="px-4 py-3 italic text-[#666] font-serif">₹{product.basePrice || product.price || '0'}</td>
                  <td className="px-4 py-3 italic text-[#666] font-serif">
                    {product.variants && product.variants.length > 0
                      ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
                      : product.stock || '0'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-light italic font-serif ${
                      product.status === 'approved'
                        ? 'bg-[#9c7c3a] text-white'
                        : product.status === 'rejected'
                        ? 'bg-[#e6ddd2] text-[#666]'
                        : 'bg-[#fbf7f2] text-[#666] border border-[#e6ddd2]'
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
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-[#9c7c3a]/50" />
          <p className="text-[#666] text-lg italic font-serif">No products yet.</p>
          <p className="text-[#9c7c3a] text-sm italic font-serif">Start by adding your first product!</p>
        </div>
      )}
    </div>
  );
};

export default RecentProducts;