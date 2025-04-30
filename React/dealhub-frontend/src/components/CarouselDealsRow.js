import React, { useEffect, useRef, useState } from 'react';
import DealCard from './DealCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CarouselDealsRow = ({ title, filter }) => {
  const [deals, setDeals] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchDeals = async () => {
      const res = await fetch('http://100.24.119.92:3000/api/deals');
      const data = await res.json();

      let filtered;
      if (filter === 'lightning') {
        filtered = data.filter((d) => d.deal_type?.toLowerCase().includes('lightning'));
      } else if (filter === 'top_discount') {
        filtered = data.sort((a, b) => b.savings_percentage - a.savings_percentage).slice(0, 15);
      } else {
        filtered = data.slice(0, 15);
      }

      setDeals(filtered);
    };

    fetchDeals();
  }, [filter]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const cardWidth = container.firstChild?.offsetWidth || 300;
      const visibleCards = 3;
      const scrollAmount = cardWidth * visibleCards + 32 * (visibleCards - 1); // card + gap

      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!deals.length) return null; // hide section if no deals

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>

        <div className="relative group">
          {/* Left Arrow */}
<button
  onClick={() => scroll('left')}
  className="hidden group-hover:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border rounded-full shadow hover:bg-gray-100 transition-opacity duration-200"
>
  <ChevronLeft size={24} className="text-gray-700" />
</button>

          {/* Card Container */}
          <div
            ref={scrollRef}
            className="flex overflow-hidden gap-8"
            style={{ scrollBehavior: 'smooth' }}
          >
            {deals.map((deal) => (
              <div
                key={deal.deal_id}
                className="flex-shrink-0 w-[300px]"
              >
                <DealCard
                  id={deal.deal_id}
                  title={deal.deal_title}
                  description={deal.deal_type}
                  originalPrice={deal.list_price}
                  dealPrice={deal.deal_price}
                  discount={deal.savings_percentage}
                  imageUrl={deal.deal_photo}
                  timeRemaining={deal.deal_ends_at}
                  dealType={
                    deal.deal_type?.toLowerCase().includes('lightning')
                      ? 'lightning'
                      : deal.deal_type?.toLowerCase().includes('daily')
                      ? 'daily'
                      : deal.deal_type?.toLowerCase().includes('top')
                      ? 'top'
                      : 'trending'
                  }
                />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
<button
  onClick={() => scroll('right')}
  className="hidden group-hover:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border rounded-full shadow hover:bg-gray-100 transition-opacity duration-200"
>
  <ChevronRight size={24} className="text-gray-700" />
</button>
        </div>
      </div>
    </section>
  );
};

export default CarouselDealsRow;
