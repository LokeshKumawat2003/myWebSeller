import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNewArrivals } from "../../services/api";

const POPULAR_SEARCHES = [
  "saree",
  "sharara",
  "lehenga",
  "skirt set",
  "ajrakh",
  "kaftan",
];

const SearchModal = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  onSubmit,
}) => {
  const navigate = useNavigate();
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNewArrivals();
    }
  }, [isOpen]);

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      const products = await getNewArrivals(4);
      setNewArrivals(products);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSubmit(searchQuery.trim());
      onClose();
      setSearchQuery("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#fbf7f2] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e6ddd2]">
        <span className="text-sm text-[#3b3b3b] font-sans">Skip to main content</span>
        <button onClick={onClose}>
          <X className="w-6 h-6 text-[#3b3b3b] hover:text-[#9c7c3a]" />
        </button>
      </div>

      {/* Search Input */}
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <form
          onSubmit={handleSubmit}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9c7c3a]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, categories, keywords, etc"
            className="w-full border-b border-[#e6ddd2] bg-transparent pl-10 pb-3 text-lg font-sans text-[#3b3b3b] focus:outline-none focus:border-[#9c7c3a] placeholder-[#3b3b3b]/60"
            autoFocus
          />
        </form>

 

        {/* New Arrivals */}
        <div className="mt-14">
          <h4 className="text-xs tracking-[1px] text-[#9c7c3a] font-serif uppercase mb-6">
            New Arrivals
          </h4>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9c7c3a]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {newArrivals.map((item) => (
                <div
                  key={item._id}
                  className="cursor-pointer group"
                  onClick={() => {
                    navigate(`/product/${item._id}`);
                    onClose();
                  }}
                >
                  <div className="overflow-hidden">
                    <img
                      src={item.images?.[0] || "https://via.placeholder.com/220x320"}
                      alt={item.title}
                      className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="mt-3 text-sm text-[#3b3b3b] font-sans group-hover:text-[#9c7c3a]">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default SearchModal;
