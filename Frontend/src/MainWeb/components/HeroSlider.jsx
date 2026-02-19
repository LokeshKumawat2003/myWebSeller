import React, { useState, useEffect, useCallback } from 'react';
import { listBanners } from '../../services/api';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const banners = await listBanners();
      // Convert banners to slide format
      const bannerSlides = banners.map(banner => ({
        id: banner._id,
        image: banner.imageUrl,
        title: banner.title || 'Welcome',
        subtitle: 'Discover amazing products',
        buttonText: 'Shop Now',
        buttonLink: '/'
      }));
      setSlides(bannerSlides);
    } catch (err) {
      console.error('Error fetching banners:', err);
      // Fallback to default slides
      setSlides([
        {
          id: 1,
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
          title: 'New Arrivals',
          subtitle: 'Discover the latest trends in fashion',
          buttonText: 'Shop Now',
          buttonLink: '/men'
        },
        {
          id: 2,
          image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop',
          title: 'Exclusive Deals',
          subtitle: 'Up to 50% off on selected items',
          buttonText: 'View Deals',
          buttonLink: '/women'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 1500); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide]);

  if (loading) {
    return (
      <section className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-200">
        <div className="h-full flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded w-64 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-96"></div>
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg lg:max-w-xl">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-[#fbf7f2] mb-4 leading-tight tracking-[2px]">
                Welcome to Our Store
              </h1>
              <p className="text-lg md:text-xl text-[#fbf7f2]/90 mb-8 leading-relaxed font-sans">
                Discover amazing products and great deals
              </p>
              <a
                href="/"
                className="inline-flex items-center px-8 py-4 bg-[#9c7c3a] text-[#fbf7f2] font-serif font-medium rounded-lg hover:bg-[#8a6a2f] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl tracking-[1px]"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent">
              <div className="h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-lg lg:max-w-xl">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-[#fbf7f2] mb-4 leading-tight tracking-[2px]">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-[#fbf7f2]/90 mb-8 leading-relaxed font-sans">
                      {slide.subtitle}
                    </p>
                    <a
                      href={slide.buttonLink}
                      className="inline-flex items-center px-8 py-4 bg-[#9c7c3a] text-[#fbf7f2] font-serif font-medium rounded-lg hover:bg-[#8a6a2f] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl tracking-[1px]"
                    >
                      {slide.buttonText}
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
        <div
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </section>
  );
};

export default HeroSlider;