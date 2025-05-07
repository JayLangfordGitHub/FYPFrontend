// src/components/SectionedDealsRow.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DealCard from './DealCard';
import { Loader } from 'lucide-react';

const SectionedDealsRow = ({ title, filter, linkTo }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch('/api/deals');
        const data = await res.json();

        let filtered = data;

        if (filter === 'deal_of_the_day') {
          filtered = [...data].sort((a, b) => b.savings_percentage - a.savings_percentage).slice(0, 1);
        } else if (filter === 'lightning') {
          filtered = data.filter(deal => deal.deal_type.toLowerCase().includes('lightning')).slice(0, 6);
        } else if (filter === 'top_discount') {
          filtered = [...data].sort((a, b) => b.savings_percentage - a.savings_percentage).slice(0, 6);
        } else {
          filtered = data.slice(0, 6); // Default for trending or fallback
        }

        setDeals(filtered);
      } catch (err) {
        console.error('Failed to fetch deals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [filter]);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 bg-white px-2 py-1 rounded inline-block border-b-4 border-yellow-400">
  {title}
</h2>
          <Link to={linkTo} className="text-blue-600 hover:underline">
            View More
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center"><Loader className="animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map(deal => (
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
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionedDealsRow;
