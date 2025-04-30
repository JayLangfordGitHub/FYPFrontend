import React from 'react';
import { Link } from 'react-router-dom';

const formatDealTypes = (typeString) => {
  if (!typeString) return [];

  return typeString.split(' - ').map((type) =>
    type
      .trim()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

const DealCard = ({
  id,
  title,
  description,
  originalPrice,
  dealPrice,
  discount,
  imageUrl,
  timeRemaining,
  dealType,
}) => {
  const renderBadge = () => {
    const lower = dealType?.toLowerCase() || '';
    if (!lower) return null;

    const labelMap = {
      lightning: 'Lightning Deal',
      daily: 'Deal of the Day',
      top: 'Top Deal',
      trending: 'Trending',
    };

    const colorMap = {
      lightning: 'bg-red-500 text-white',
      daily: 'bg-purple-600 text-white',
      top: 'bg-green-500 text-white',
      trending: 'bg-yellow-400 text-black',
    };

    const key = Object.keys(labelMap).find((k) => lower.includes(k)) || 'trending';

    return (
      <span
        className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded-full shadow ${colorMap[key]}`}
      >
        {labelMap[key]}
      </span>
    );
  };

  return (
    <div className="w-full max-w-xs overflow-hidden rounded-lg border bg-white shadow-md hover:shadow-lg transition duration-300">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto max-h-60 object-cover mx-auto"
          />
        </div>
        {renderBadge()}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 line-clamp-2 text-gray-900">
          {title}
        </h3>

        {/* Render styled deal type pills */}
        <div className="flex flex-wrap gap-1 mb-2">
          {formatDealTypes(description).map((type, idx) => (
            <span
              key={idx}
              className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs font-semibold"
            >
              {type}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xl font-bold text-black">
            €{Number(dealPrice).toFixed(2)}
          </span>
          <span className="text-sm line-through text-gray-400">
            €{Number(originalPrice).toFixed(2)}
          </span>
          <span className="text-xs text-green-600 font-semibold">{discount}% OFF</span>
        </div>

        {timeRemaining && (
          <p className="text-sm text-red-500 mb-2">
            Ends: {new Date(timeRemaining).toLocaleDateString()}
          </p>
        )}

        <Link
          to={`/deal/${id}`}
          className="block w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded text-center"
        >
          View Deal
        </Link>
      </div>
    </div>
  );
};

export default DealCard;
