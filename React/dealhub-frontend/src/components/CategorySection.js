import React, { useState, useEffect } from 'react';
import DealCard from './DealCard';
import { ChevronRight } from 'lucide-react';

const categories = [
  { id: 'electronics', name: 'Electronics', icon: '🔌' },
  { id: 'home-kitchen', name: 'Home & Kitchen', icon: '🏠' },
  { id: 'fashion', name: 'Fashion', icon: '👕' },
  { id: 'books', name: 'Books', icon: '📚' },
  { id: 'toys-games', name: 'Toys & Games', icon: '🎮' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'sports', name: 'Sports & Outdoors', icon: '⚽' },
  { id: 'tools', name: 'Tools & Home Improvement', icon: '🔨' }
];

const CategorySection = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [categoryDeals, setCategoryDeals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch deals for the selected category
  useEffect(() => {
    setLoading(true);
    fetch('/api/deals')
      .then(response => response.json())
      .then(data => {
        const filtered = data.slice(0, 4);
        setCategoryDeals(filtered);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching category deals:', error);
        setLoading(false);
      });
  }, [activeCategory]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
        
        {/* Category Navigation */}
        <div className="flex overflow-x-auto pb-4 scrollbar-hide mb-8">
          <div className="flex space-x-2 mx-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition
                  ${activeCategory === category.id 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-white hover:bg-gray-100 text-gray-800 border'
                  }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Deal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading placeholders
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                  <div className="h-10 bg-gray-300 rounded w-full mt-4"></div>
                </div>
              </div>
            ))
          ) : (
            categoryDeals.map(deal => (
              <DealCard
                key={deal.deal_id}
                title={deal.deal_title}
                description={deal.deal_type}
                originalPrice={deal.list_price}
                dealPrice={deal.deal_price}
                discount={deal.savings_percentage}
                imageUrl={deal.deal_photo}
                timeRemaining={deal.deal_ends_at}
                dealType={deal.deal_type?.toLowerCase().includes('flash') 
                  ? 'flash' 
                  : deal.deal_type?.toLowerCase().includes('daily') 
                    ? 'daily' 
                    : 'trending'}
              />
            ))
          )}
        </div>
        
        {/* View More Button */}
        <div className="text-center mt-8">
          <a 
            href={`/category/${activeCategory}`}
            className="inline-flex items-center bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded"
          >
            View All {categories.find(c => c.id === activeCategory)?.name} Deals
            <ChevronRight size={16} className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;