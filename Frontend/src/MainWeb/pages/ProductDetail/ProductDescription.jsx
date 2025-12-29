import React from 'react';

const ProductDescription = ({ product }) => {
  return (
    <div className="mt-16 border-t border-[#e6ddd2] pt-12">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-serif font-medium text-[#9c7c3a] mb-6 tracking-[1px]">Description</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-[#3b3b3b] font-sans leading-relaxed mb-6">
            {product.description}
          </p>
          <ul className="list-disc list-inside space-y-2 text-[#3b3b3b] font-sans">
            <li>Made from premium quality fabric</li>
            <li>Designed for comfort and style</li>
            <li>Perfect for special occasions</li>
            <li>Ethically manufactured</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;