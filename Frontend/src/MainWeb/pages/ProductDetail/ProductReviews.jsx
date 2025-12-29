import React from 'react';
import { Star } from 'lucide-react';

const ProductReviews = () => {
  return (
    <div className="mt-12 border-t border-[#e6ddd2] pt-12">
      <h2 className="text-2xl font-serif font-medium text-[#9c7c3a] mb-8 tracking-[1px]">Customer Reviews</h2>
      <div className="space-y-8">
        {/* Sample reviews */}
        <div className="border-b border-[#e6ddd2] pb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-10 h-10 bg-[#e6ddd2] rounded-full flex items-center justify-center">
              <span className="text-sm font-sans font-medium text-[#3b3b3b]">JD</span>
            </div>
            <div>
              <p className="font-serif font-medium text-[#9c7c3a]">John Doe</p>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-[#3b3b3b] font-sans">2 weeks ago</span>
              </div>
            </div>
          </div>
          <p className="text-[#3b3b3b] font-sans">
            Excellent quality product! Fits perfectly and the material is very comfortable.
            Highly recommend this dress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;