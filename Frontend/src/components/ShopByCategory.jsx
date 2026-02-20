import React, { useState, useEffect } from 'react';
import { getCategoryDisplays } from '../services/api';

export default function ShopByCategory() {
  const [displayCategories, setDisplayCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategoryDisplays();
      setDisplayCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading category displays:', err);
      setDisplayCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-1 px-2 sm:px-4 md:px-8 bg-[#fbf7f2]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-1xl sm:text-2xl md:text-1xl font-serif text-center mb-8 sm:mb-16 tracking-[2px] sm:tracking-[3px] text-[#9c7c3a]">
            SHOP BY CATEGORY
          </h2>
          <div className="flex justify-center items-center h-40 sm:h-64">
            <p className="text-[#9c7c3a] text-base sm:text-lg">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (displayCategories.length === 0) {
    return (
      <section className="py-20 px-4 md:px-8 bg-[#fbf7f2]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 tracking-[3px] text-[#9c7c3a]">
            SHOP BY CATEGORY
          </h2>
          <div className="text-center h-64 flex items-center justify-center">
            <p className="text-[#666]">No categories available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 px-4 md:px-8 bg-[#fbf7f2]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-serif text-center mb-16 tracking-[3px] text-[#9c7c3a]">
          SHOP BY CATEGORY
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {displayCategories.map((category, index) => (
            <a
              key={index}
              href={`/${category.slug || category.name.toLowerCase()}`}
              className="group relative overflow-hidden bg-[#e6ddd2] aspect-square hover:shadow-lg transition-all duration-300"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
              <div className="absolute left-0 right-0 bottom-0 md:bottom-6 md:left-6 md:right-auto bg-black/40 md:bg-transparent flex justify-center md:justify-start items-center py-2 md:py-0 px-4 md:px-0">
                <h3 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-serif tracking-[2px] font-medium max-w-[90%] md:max-w-none text-center md:text-left break-words">
                  {category.name}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
