import React from 'react';
import { Hand } from 'lucide-react';

const WelcomeSection = ({ sellerName }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#e6ddd2] p-6 md:p-8 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-light italic mb-2 flex items-center font-serif text-[#3b3b3b]">
            Welcome back, {sellerName || 'Seller'}!
            <Hand className="ml-2 w-8 h-8 text-[#9c7c3a]" />
          </h1>
          <p className="text-[#666] text-sm md:text-base italic font-serif">Manage your store and products efficiently</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="bg-[#fbf7f2] rounded-lg p-4 border border-[#e6ddd2]">
            <p className="text-sm italic text-[#666] font-serif">Dashboard Overview</p>
            <p className="text-lg font-light italic text-[#3b3b3b] font-serif">Ready to grow your business</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;