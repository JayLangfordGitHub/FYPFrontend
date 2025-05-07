// src/components/Hero.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [topDeal, setTopDeal] = useState(null);

  useEffect(() => {
    const fetchTopDeal = async () => {
      try {
        const res = await fetch('/api/deals');
        const data = await res.json();
        const best = data.sort((a, b) => b.savings_percentage - a.savings_percentage)[0];
        setTopDeal(best);
      } catch (err) {
        console.error('Error fetching top deal:', err);
      }
    };

    fetchTopDeal();
  }, []);

  return (
    <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Side */}
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Never Miss a <span className="text-yellow-400">Deal</span> Again
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-200">
              Find the best Amazon deals in one place. Save up to 70% on
              products with live tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/deals"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded text-center"
              >
                Explore Deals
              </Link>
              <Link
                to="/about"
                className="border border-white hover:bg-white hover:text-blue-900 text-white font-semibold py-3 px-6 rounded text-center"
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* Right Side: Deal Card */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-end">
            <h3 className="text-xl font-semibold text-white mb-3">
              Today’s Top Deal
            </h3>
            {topDeal && (
              <div className="bg-white text-black rounded-lg shadow-lg max-w-xs w-full overflow-hidden">
                <img
                  src={topDeal.deal_photo}
                  alt={topDeal.deal_title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-md mb-2 line-clamp-2">
                    {topDeal.deal_title}
                  </h3>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-gray-500 line-through text-sm whitespace-nowrap">
                      €{topDeal.list_price}
                    </span>
                    <span className="text-green-600 font-bold text-lg whitespace-nowrap">
                      €{topDeal.deal_price}
                    </span>
                  </div>

                  {/* Savings */}
                  <div className="text-xs text-blue-600 font-medium mb-3">
                    Save {topDeal.savings_percentage}%
                  </div>

                  {/* View Button */}
                  <Link
                    to={`/deal/${topDeal.deal_id}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-sm w-full text-center"
                  >
                    View Deal
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;