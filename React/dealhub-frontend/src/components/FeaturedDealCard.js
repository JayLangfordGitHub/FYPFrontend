import React from 'react';

const FeaturedDealCard = ({ deal }) => {
  if (!deal) return null;

  return (
    <div className="bg-white text-black rounded-lg shadow-lg max-w-sm w-full overflow-hidden">
      <img
        src={deal.deal_photo}
        alt={deal.deal_title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 truncate">
          {deal.deal_title}
        </h3>

        {/* Price Row */}
        <div className="flex items-baseline space-x-3 mb-2">
          <span className="text-gray-500 line-through text-sm">
            €{deal.list_price}
          </span>
          <span className="text-green-600 font-semibold text-md">
            €{deal.deal_price}
          </span>
        </div>

        {/* Savings */}
        <span className="text-sm font-medium text-blue-600 block mb-3">
          Save {deal.savings_percentage}%
        </span>

        {/* View Deal Button */}
        <div>
          <a
            href={deal.deal_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-sm w-full text-center"
          >
            View Deal
          </a>
        </div>
      </div>
    </div>
  );
};

export default FeaturedDealCard;
