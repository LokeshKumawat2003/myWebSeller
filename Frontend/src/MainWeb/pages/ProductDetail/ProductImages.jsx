import React from 'react';

const ProductImages = ({ product, selectedColorVariant, selectedImage, setSelectedImage }) => {
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-[3/4] overflow-hidden rounded-lg bg-[#fbf7f2] relative group cursor-zoom-in border border-[#e6ddd2]">
        <img
          src={(selectedColorVariant?.images && selectedColorVariant.images[selectedImage]) || '/placeholder-product.jpg'}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Thumbnail Images */}
      {selectedColorVariant?.images && selectedColorVariant.images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {selectedColorVariant.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-[#9c7c3a]' : 'border-[#e6ddd2] hover:border-[#9c7c3a]'
                }`}
            >
              <img
                src={image}
                alt={`${product.title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;