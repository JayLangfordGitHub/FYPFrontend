import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, ShoppingCart, AlertCircle, Loader } from 'lucide-react';
import PriceHistoryChart from '../components/PriceHistoryChart';

const DealDetailPage = () => {
  const { dealId } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const fetchDealDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://100.24.119.92:3000/api/deal/${dealId}`);

        if (!response.ok) {
          throw new Error('Deal not found');
        }

        const data = await response.json();
        setDeal(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDealDetails();
  }, [dealId]);

  useEffect(() => {
    if (!deal || !deal.deal_ends_at) return;

    const updateTimeLeft = () => {
      const now = new Date();
      const endTime = new Date(deal.deal_ends_at);
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft('Deal expired');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      let timeString = '';
      if (days > 0) timeString += `${days}d `;
      if (hours > 0 || days > 0) timeString += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}m `;
      timeString += `${seconds}s`;

      setTimeLeft(timeString);
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [deal]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 mt-10">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error || 'Deal not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/5">
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                <img src={deal.deal_photo} alt={deal.deal_title} className="max-h-80 object-contain" />
              </div>
            </div>

            <div className="md:w-3/5">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-black dark:text-white">{deal.deal_title}</h1>

              <div className="flex items-end gap-3 my-4">
                <span className="text-3xl font-bold text-blue-600">€{Number(deal.deal_price).toFixed(2)}</span>
                <span className="text-lg text-gray-500 line-through">€{Number(deal.list_price).toFixed(2)}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-semibold">
                  {deal.savings_percentage}% OFF
                </span>
              </div>

              <p className="text-green-600 font-semibold">
                You save: €{Number(deal.savings_amount).toFixed(2)}
              </p>

              <p className="text-sm text-gray-700 mb-1">
                Deal Timing: {new Date(deal.deal_starts_at).toLocaleDateString()} - {new Date(deal.deal_ends_at).toLocaleDateString()}
              </p>

              <div className="flex items-center text-red-600 mb-4">
                <Clock size={18} className="mr-2" />
                <span className="font-semibold">{timeLeft}</span>
              </div>

              {deal.deal_type && deal.deal_type.split(' - ').map((type, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                >
                  {type.trim().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}

              <div className="flex flex-col sm:flex-row gap-3 mb-6 mt-4">
                <a
                  href={deal.deal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded flex-1 text-center flex items-center justify-center"
                >
              <ShoppingCart size={18} className="mr-2" />
                View on Amazon
              </a>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Price History Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-4">Price History</h2>
        <PriceHistoryChart currentPrice={Number(deal.deal_price)} startDate={deal.deal_starts_at} />
      </div>
    </div>
  );
};

export default DealDetailPage;
