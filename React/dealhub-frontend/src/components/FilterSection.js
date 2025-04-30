import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FilterSection = ({ onApplyFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [discountRange, setDiscountRange] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    'Electronics', 'Home & Kitchen', 'Fashion', 'Books', 
    'Toys & Games', 'Beauty', 'Sports & Outdoors'
  ];

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value, 10);
    setPriceRange(newRange);
  };

  const handleDiscountChange = (e) => {
    setDiscountRange(parseInt(e.target.value, 10));
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      priceRange,
      discountRange,
      categories: selectedCategories
    });
  };

  const handleResetFilters = () => {
    setPriceRange([0, 1000]);
    setDiscountRange(0);
    setSelectedCategories([]);
    onApplyFilters(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      {/* Mobile Filter Toggle */}
      <div 
        className="md:hidden flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-semibold text-lg">Filters</h3>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block p-4`}>
        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Price Range</h4>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              className="w-24 p-2 border rounded"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e, 0)}
              min="0"
            />
            <span>to</span>
            <input 
              type="number" 
              className="w-24 p-2 border rounded"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e, 1)}
              min={priceRange[0]}
            />
          </div>
        </div>

        {/* Minimum Discount */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Minimum Discount: {discountRange}%</h4>
          <input 
            type="range" 
            className="w-full"
            min="0" 
            max="90" 
            step="10"
            value={discountRange}
            onChange={handleDiscountChange}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>90%</span>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Categories</h4>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(category => (
              <label key={category} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="rounded"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
          <button 
            className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded"
            onClick={handleResetFilters}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;