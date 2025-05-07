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

  const [predictedDeal, setPredictedDeal] = useState(null);

  const getPredictionFromTrend = (priceHistory) => {
    const prices = priceHistory.map((entry) => parseFloat(entry.price));
    const dates = priceHistory.map((entry) => new Date(entry.date));

    if (prices.length < 2 || dates.length < 2) return null;

    // Average price difference
    const diffs = prices.slice(1).map((p, i) => p - prices[i]);
    const avgDelta = diffs.reduce((a, b) => a + b, 0) / diffs.length;

    // Average time gap in days
    const dateDiffs = dates.slice(1).map((d, i) =>
      Math.floor((d - dates[i]) / (1000 * 60 * 60 * 24))
    );
    const avgDayGap = Math.round(dateDiffs.reduce((a, b) => a + b, 0) / dateDiffs.length);

    // Predict price and date
    const predictedPrice = Math.max(1, prices[prices.length - 1] + avgDelta).toFixed(2);
    const predictedDate = new Date(dates[dates.length - 1]);
    predictedDate.setDate(predictedDate.getDate() + avgDayGap);

    return {
      price: predictedPrice,
      date: predictedDate.toISOString().split('T')[0],
    };
  };

  useEffect(() => {
    if (!currentPrice || !startDate) return;

    const generateFakePriceHistory = () => {
      const now = new Date(startDate);
      const monthsToGoBack = 3;
      const entries = Math.floor(Math.random() * 3) + 2; // 2–4 entries
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

      const todayStr = new Date(startDate).toISOString().split('T')[0];
      history.push({
        date: todayStr,
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

    const prediction = getPredictionFromTrend(priceData);
    setPredictedDeal(prediction);
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

      {predictedDeal && (
        <div className="mt-6 p-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Predicted Next Deal</h3>
          <p className="text-gray-600">
            Based on recent trends, the next deal may drop to{' '}
            <span className="font-bold text-green-600">€{predictedDeal.price}</span> around{' '}
            <span className="font-medium">{predictedDeal.date}</span>.
          </p>
        </div>
      )}
    </div>
  );
};

export default PriceHistoryChart;
