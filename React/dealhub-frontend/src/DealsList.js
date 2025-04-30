import React, { useState, useEffect } from 'react';

function DealsList() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    fetch('http://100.24.119.92:3000/api/deals')
      .then(response => response.json())
      .then(data => setDeals(data))
      .catch(error => console.error('Error fetching deals:', error));
  }, []);

  return (
    <div>
      <h2>Available Deals</h2>
      <ul>
        {deals.map(deal => (
          <li key={deal.id}>
            <strong>{deal.deal_title}</strong> — ${deal.deal_price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DealsList;
