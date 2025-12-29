import React from "react";
import ProductCard from "./ProductCard";
import { Diamond, Sparkles, ShoppingBag } from "lucide-react";

const ProductGrid = ({
  products,
  loading = false,
  emptyMessage = "No products found",
}) => {
  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div
        className="
          grid
          grid-cols-2          /* 📱 Mobile → 2 */
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-4
        "
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white border border-[#e6ddd2] overflow-hidden"
          >
            <div className="h-[260px] sm:h-[320px] md:h-[420px] bg-[#fbf7f2] animate-pulse" />
            <div className="p-3 space-y-3">
              <div className="h-3 bg-[#e6ddd2] rounded animate-pulse w-1/2" />
              <div className="h-4 bg-[#e6ddd2] rounded animate-pulse w-4/5" />
              <div className="h-4 bg-[#e6ddd2] rounded animate-pulse w-1/3" />
              <div className="h-6 bg-[#e6ddd2] rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 md:py-20 px-4">
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#9c7c3a]/10 to-[#9c7c3a]/20 rounded-full border-2 border-[#9c7c3a]/20">
            <Diamond className="w-10 h-10 md:w-12 md:h-12 text-[#9c7c3a]" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-[#9c7c3a]/60 animate-pulse" />
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-serif font-medium text-[#9c7c3a] mb-4 tracking-[1px] md:tracking-[2px]">
          {emptyMessage}
        </h3>
        <p className="text-[#3b3b3b]/80 font-sans text-base md:text-lg mb-8 max-w-md mx-auto leading-relaxed">
          Discover our exquisite collection of premium fashion pieces crafted with care and elegance.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center space-x-2 bg-[#9c7c3a] text-[#fbf7f2] px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-[#8a6a2f] transition-all duration-300 font-sans font-medium uppercase tracking-[1px] text-sm md:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
            <span>Explore Collection</span>
          </button>
        </div>
      </div>
    );
  }

  /* ================= PRODUCT GRID ================= */
  return (
    <div
      className="
        grid
        grid-cols-2          /* 📱 Mobile → 2 */
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-4
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
