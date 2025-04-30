import React from 'react';

const tabs = [
  { name: 'Trending Deals', active: true },
  { name: 'Deal of the Day', active: false },
  { name: 'Flash Sales', active: false },
  { name: 'Clearance', active: false },
  { name: 'Price Drops', active: false },
];

const NavigationTabs = () => {
  return (
    <div className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
        <div className="flex space-x-2 py-3 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`px-4 py-2 rounded-md font-semibold whitespace-nowrap transition 
                ${tab.active 
                  ? 'bg-yellow-400 text-black' 
                  : 'hover:bg-blue-800'
                }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationTabs;