import React, { useState, useEffect } from 'react';
import DealCard from '../components/DealCard';
import { Loader, AlertCircle, SlidersHorizontal } from 'lucide-react';
import { assignCategory } from '../lib/utils';

const categories = {
  'electronics': 'Electronics',
  'home-kitchen': 'Home & Kitchen',
  'fashion': 'Fashion',
  'books': 'Books',
  'toys-games': 'Toys & Games',
};

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minDiscount, setMinDiscount] = useState(0);
  const [sortBy, setSortBy] = useState('discount');
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/deals');
        if (!response.ok) throw new Error('Failed to fetch deals');

        const allDeals = await response.json();
        const enriched = allDeals.map(deal => ({
          ...deal,
          inferredCategory: assignCategory(deal.deal_title),
        }));

        setDeals(enriched);
        setFilteredDeals(enriched);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  useEffect(() => {
    if (!deals.length) return;

    let result = [...deals];

    if (selectedCategories.length > 0) {
      result = result.filter(deal =>
        selectedCategories.includes(deal.inferredCategory)
      );
    }

    result = result.filter(deal => {
      const price = Number(deal.deal_price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (minDiscount > 0) {
      result = result.filter(
        deal => Number(deal.savings_percentage) >= minDiscount
      );
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.deal_price - b.deal_price);
        break;
      case 'price-high':
        result.sort((a, b) => b.deal_price - a.deal_price);
        break;
      case 'discount':
        result.sort((a, b) => b.savings_percentage - a.savings_percentage);
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt || b.deal_starts_at) -
            new Date(a.createdAt || a.deal_starts_at)
        );
    }

    setFilteredDeals(result);
  }, [deals, selectedCategories, priceRange, minDiscount, sortBy]);

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleResetFilters = () => {
    setPriceRange([0, 1000]);
    setMinDiscount(0);
    setSortBy('discount');
    setSelectedCategories([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">All Deals</h1>
        <button
          className="md:hidden flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded"
          onClick={toggleFilters}
        >
          <SlidersHorizontal size={18} className="mr-2" />
          Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className={`md:w-1/4 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="bg-white text-black rounded-lg shadow p-4 mb-6 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              <button
                onClick={handleResetFilters}
                className="text-blue-600 text-sm hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-800">Price Range</h3>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  min="0"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="w-20 border border-gray-300 rounded px-2 py-1 bg-white text-black"
                />
                <span className="text-gray-600">to</span>
                <input
                  type="number"
                  min={priceRange[0]}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-20 border border-gray-300 rounded px-2 py-1 bg-white text-black"
                />
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-full"
              />
            </div>

            {/* Discount */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-800">
                Minimum Discount: {minDiscount}%
              </h3>
              <input
                type="range"
                min="0"
                max="90"
                step="10"
                value={minDiscount}
                onChange={(e) => setMinDiscount(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-800">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 bg-white text-black"
              >
                <option value="discount">Highest Discount</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-medium mb-2 text-gray-800">Categories</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(categories).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(key)}
                      onChange={(e) => {
                        setSelectedCategories((prev) =>
                          e.target.checked
                            ? [...prev, key]
                            : prev.filter((c) => c !== key)
                        );
                      }}
                      className="accent-blue-600"
                    />
                    <label className="text-sm text-gray-700">{label}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Deals Section */}
        <div className="md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin text-blue-600" size={36} />
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <AlertCircle className="mx-auto mb-4 text-red-500" size={36} />
                  <p className="text-center text-red-700">{error}</p>
                </div>
              )}

              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <p className="text-gray-600">
                  {filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'} found
                </p>
              </div>

              {filteredDeals.length === 0 && !loading && !error && (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600 mb-4">No deals found matching your criteria.</p>
                  <button
                    onClick={handleResetFilters}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {filteredDeals.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDeals.map((deal) => (
                    <DealCard
                      key={deal.deal_id}
                      id={deal.deal_id}
                      title={deal.deal_title}
                      description={deal.deal_type}
                      originalPrice={deal.list_price}
                      dealPrice={deal.deal_price}
                      discount={deal.savings_percentage}
                      imageUrl={deal.deal_photo}
                      timeRemaining={deal.deal_ends_at}
                      dealType={
                        deal.deal_type?.toLowerCase().includes('flash')
                          ? 'flash'
                          : deal.deal_type?.toLowerCase().includes('daily')
                          ? 'daily'
                          : 'trending'
                      }
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
