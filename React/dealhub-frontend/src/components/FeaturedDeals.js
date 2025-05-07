import React, { useEffect, useState } from 'react';
import DealCard from './DealCard';

const FeaturedDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/deals');
        
        if (!response.ok) {
          throw new Error('Failed to fetch deals');
        }
        
        const data = await response.json();
        setDeals(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (error) {
    return (
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Featured Deals</h2>
          <div className="text-center text-red-500">
            <p>Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Featured Deals</h2>

        {/* Loading state */}
        {loading ? (
          <div className="text-center text-gray-500">Loading deals...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {deals.map((deal) => (
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
                dealType={deal.deal_type?.toLowerCase().includes('flash') 
                  ? 'flash' 
                  : deal.deal_type?.toLowerCase().includes('daily') 
                    ? 'daily' 
                    : 'trending'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDeals;