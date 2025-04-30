import React from 'react';
import Hero from '../components/Hero';
import CarouselDealsRow from '../components/CarouselDealsRow';

const HomePage = () => {
  const features = [
    {
      title: 'Best Deals',
      description: "We curate the best deals from Amazon so you don't have to search.",
    },
    {
      title: 'Real-time Updates',
      description: 'Deals are updated constantly throughout the day.',
    },
    {
      title: 'Deal Timers',
      description: 'Know exactly when deals expire with our countdown timers.',
    },
    {
      title: 'Verified Savings',
      description: "We verify price history to ensure you're getting a real deal.",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <Hero />

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Why Shop with DealHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm text-center"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CarouselDealsRow title="Trending Deals" filter="all" />
      <CarouselDealsRow title="Lightning Deals" filter="lightning" />
      <CarouselDealsRow title="Top Deals by Discount" filter="top_discount" />
    </div>
  );
};

export default HomePage;
