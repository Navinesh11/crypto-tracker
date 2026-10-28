/**
 * PriceChart — Chart.js line chart for coin detail page
 * Supports 24h, 7d, 30d, 90d time ranges
 */

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TIME_RANGES = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 }
];

function PriceChart({ coinId, coinName, isPositive }) {
  const [selectedRange, setSelectedRange] = useState(7);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coinId) return;
    setLoading(true);
    setError(null);

    axios.get(`${API_BASE}/coin/${coinId}/chart`, { params: { days: selectedRange } })
      .then(res => setChartData(res.data))
      .catch(() => setError('Failed to load chart data'))
      .finally(() => setLoading(false));
  }, [coinId, selectedRange]);

  const accentColor = isPositive ? '#00ff88' : '#ff3366';
  const accentRgb = isPositive ? '0, 255, 136' : '255, 51, 102';

  // Build Chart.js data from API response
  const buildChartData = () => {
    if (!chartData?.prices) return null;

    const prices = chartData.prices;
    const labels = prices.map(([ts]) => {
      const d = new Date(ts);
      return selectedRange <= 1
        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    });

    // Thin labels to avoid crowding
    const thinFactor = Math.ceil(labels.length / 12);

    return {
      labels: labels.map((l, i) => i % thinFactor === 0 ? l : ''),
      datasets: [{
        label: `${coinName} Price (USD)`,
        data: prices.map(([, price]) => price),
        borderColor: accentColor,
        backgroundColor: `rgba(${accentRgb}, 0.08)`,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: accentColor,
        fill: true,
        tension: 0.3
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(10, 10, 20, 0.95)',
        borderColor: accentColor,
        borderWidth: 1,
        titleColor: '#aaa',
        bodyColor: accentColor,
        padding: 12,
        callbacks: {
          label: ctx => ` $${ctx.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: { color: '#555', font: { size: 11 }, maxRotation: 0 }
      },
      y: {
        position: 'right',
        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
        ticks: {
          color: '#555',
          font: { size: 11 },
          callback: val => val >= 1000 ? `$${(val / 1000).toFixed(1)}k` : `$${val.toFixed(2)}`
        }
      }
    }
  };

  const data = buildChartData();

  return (
    <div className="price-chart-container">
      {/* Time Range Tabs */}
      <div className="chart-controls">
        <span className="chart-title">{coinName} Price Chart</span>
        <div className="chart-range-tabs">
          {TIME_RANGES.map(({ label, days }) => (
            <button
              key={days}
              className={`range-tab ${selectedRange === days ? 'active' : ''}`}
              onClick={() => setSelectedRange(days)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="chart-wrapper">
        {loading && <div className="chart-loading"><div className="pulse">Loading chart…</div></div>}
        {error && <div className="chart-error">{error}</div>}
        {!loading && !error && data && (
          <Line data={data} options={chartOptions} />
        )}
      </div>
    </div>
  );
}

export default PriceChart;
