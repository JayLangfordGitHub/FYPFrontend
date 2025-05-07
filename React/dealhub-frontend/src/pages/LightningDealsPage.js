import React, { useEffect, useState } from 'react';
import DealCard from '../components/DealCard';
import { Loader } from 'lucide-react';

const LightningDealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      const res = await fetch('/api/deals');
      const data = await res.json();
      const lightningDeals = data.filter(d => d.deal_type?.toLowerCase().includes('lightning'));
      setDeals(lightningDeals);
      setLoading(false);
    };
    fetchDeals();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6"> Lightning Deals</h1>
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
              dealType="lightning"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LightningDealsPage;
