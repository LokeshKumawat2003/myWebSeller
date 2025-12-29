import React, { useState, useCallback, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';

const ProductSlider = ({ products, title = "Featured Products" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(4);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setItemsPerView(1);
      } else if (width < 768) {
        setItemsPerView(2);
      } else if (width < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1));
  }, [maxIndex]);

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(Math.max(index, 0), maxIndex));
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || maxIndex === 0) return;

    autoPlayRef.current = setInterval(nextSlide, 4000);
    return () => clearInterval(autoPlayRef.current);
  }, [nextSlide, isAutoPlaying, maxIndex]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[#fbf7f2] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239c7c3a' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-[#9c7c3a] mb-2 md:mb-4 relative tracking-[2px]">
            {title}
            <div className="absolute -bottom-1 md:-bottom-2 left-1/2 transform -translate-x-1/2 w-16 md:w-24 h-0.5 md:h-1 bg-[#9c7c3a] rounded-full"></div>
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-[#3b3b3b] font-sans max-w-2xl mx-auto px-2 md:px-0">
            Discover our latest collection of premium products
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Arrows - Desktop */}
          <div className="hidden md:flex absolute -left-12 -right-12 top-1/2 -translate-y-1/2 z-20 justify-between pointer-events-none">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="pointer-events-auto w-12 h-12 bg-[#fbf7f2] shadow-xl hover:shadow-2xl rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group border border-[#e6ddd2]"
            >
              <svg className="w-6 h-6 text-[#3b3b3b] group-hover:text-[#9c7c3a] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
              className="pointer-events-auto w-12 h-12 bg-[#fbf7f2] shadow-xl hover:shadow-2xl rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group border border-[#e6ddd2]"
            >
              <svg className="w-6 h-6 text-[#3b3b3b] group-hover:text-[#9c7c3a] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Products Slider */}
          <div
            ref={sliderRef}
            className="overflow-hidden rounded-xl md:rounded-2xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div
              className="flex transition-transform duration-500 ease-out gap-2 md:gap-4 lg:gap-6 xl:gap-8"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                width: `${(products.length / itemsPerView) * 100}%`
              }}
            >
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="flex-shrink-0 px-1 md:px-2"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className={`transform transition-all duration-300 ${
                    index >= currentIndex && index < currentIndex + itemsPerView
                      ? 'scale-100 opacity-100'
                      : 'scale-95 opacity-70'
                  }`}>
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex md:hidden justify-center mt-6 md:mt-8 gap-2 md:gap-3">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#9c7c3a] scale-125 shadow-lg'
                    : 'bg-[#e6ddd2] hover:bg-[#9c7c3a]'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Desktop Progress Bar */}
          <div className="hidden md:block mt-8">
            <div className="w-full bg-[#e6ddd2] rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-[#9c7c3a] transition-all duration-500 ease-out rounded-full"
                style={{ width: `${((currentIndex + 1) / (maxIndex + 1)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-[#3b3b3b] font-sans">
              <span>{currentIndex + 1} of {maxIndex + 1}</span>
              <span>{products.length} products</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-[#9c7c3a] rounded-2xl p-8 text-[#fbf7f2]">
            <h3 className="text-2xl font-serif font-medium mb-4 tracking-[2px]">Explore More Products</h3>
            <p className="text-[#fbf7f2]/80 mb-6 max-w-md mx-auto font-sans">
              Discover thousands of amazing products from our trusted sellers
            </p>
            <button className="bg-[#fbf7f2] text-[#9c7c3a] px-8 py-3 rounded-lg hover:bg-[#e6ddd2] transition-all duration-300 font-serif font-medium shadow-lg hover:shadow-xl transform hover:scale-105 tracking-[1px]">
              View All Products
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;