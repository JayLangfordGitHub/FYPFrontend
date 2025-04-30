import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const PriceHistoryChart = ({ currentPrice, startDate }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (!currentPrice || !startDate) return;

    const generateFakePriceHistory = () => {
      const now = new Date(startDate);
      const monthsToGoBack = 3;
      const entries = Math.floor(Math.random() * 3) + 1;
      const history = [];

      const dayStep = Math.floor((monthsToGoBack * 30) / (entries + 1));

      for (let i = entries; i >= 1; i--) {
        const fakeDate = new Date(now);
        fakeDate.setDate(fakeDate.getDate() - i * dayStep);

        const fluctuation = (Math.random() * 0.2 - 0.1) * currentPrice;
        const fakePrice = Number(currentPrice + fluctuation).toFixed(2);

        history.push({
          date: fakeDate.toISOString().split('T')[0],
          price: fakePrice,
        });
      }

      history.push({
        date: new Date(startDate).toISOString().split('T')[0],
        price: Number(currentPrice).toFixed(2),
      });

      return history;
    };

    const priceData = generateFakePriceHistory();

    setChartData({
      labels: priceData.map((entry) => entry.date),
      datasets: [
        {
          label: 'Price (€)',
          data: priceData.map((entry) => entry.price),
          borderColor: '#facc15',
          backgroundColor: '#facc15',
          pointBackgroundColor: '#facc15',
          pointBorderColor: '#facc15',
          tension: 0.3,
          fill: false,
        },
      ],
    });
  }, [currentPrice, startDate]);

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Price History</h2>
      <div style={{ height: '300px' }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => `€${context.parsed.y}`,
                },
              },
            },
            scales: {
              x: {
                title: { display: true, text: 'Date' },
                ticks: { maxRotation: 0 },
              },
              y: {
                title: { display: true, text: 'Price (€)' },
                beginAtZero: false,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default PriceHistoryChart;
