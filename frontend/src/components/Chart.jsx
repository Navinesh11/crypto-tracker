/**
 * components/Chart.jsx — Interactive price chart with time-range tabs
 */

import React, { useState } from "react";
import {
  Chart as ChartJS, LineElement, PointElement, LinearScale,
  CategoryScale, Tooltip, Legend, Filler, TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useCoinChart } from "../hooks/useCrypto";
import { formatDate, formatPrice } from "../utils/format";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler, TimeScale);

const RANGES = [
  { label: "24H", days: 1 },
  { label: "7D",  days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y",  days: 365 },
];

export default function PriceChart({ coinId, coinColor = "#00ff88" }) {
  const [days, setDays] = useState(7);
  const { chartData, loading } = useCoinChart(coinId, days);

  if (loading || !chartData) {
    return <div className="chart-skeleton" />;
  }

  const prices = chartData.prices || [];
  // Thin out data points for performance
  const step = Math.max(1, Math.floor(prices.length / 120));
  const filtered = prices.filter((_, i) => i % step === 0);

  const labels = filtered.map(([ts]) => formatDate(ts));
  const values = filtered.map(([, price]) => price);
  const isPositive = values[values.length - 1] >= values[0];
  const accent = isPositive ? "#00ff88" : "#ff4466";

  const data = {
    labels,
    datasets: [{
      label: "Price (USD)",
      data: values,
      borderColor: accent,
      borderWidth: 2,
      fill: true,
      backgroundColor: (ctx) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
        gradient.addColorStop(0, isPositive ? "rgba(0,255,136,0.25)" : "rgba(255,68,102,0.25)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        return gradient;
      },
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 4,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(10,10,20,0.95)",
        borderColor: accent,
        borderWidth: 1,
        titleColor: "#aaa",
        bodyColor: "#fff",
        padding: 10,
        callbacks: {
          label: (ctx) => ` ${formatPrice(ctx.raw)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#666",
          maxTicksLimit: 8,
          maxRotation: 0,
          font: { size: 11 },
        },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
      y: {
        position: "right",
        ticks: {
          color: "#666",
          font: { size: 11 },
          callback: (v) => formatPrice(v),
        },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
    },
    animation: { duration: 400 },
  };

  return (
    <div className="price-chart-wrap">
      {/* Range tabs */}
      <div className="chart-tabs">
        {RANGES.map((r) => (
          <button
            key={r.days}
            className={`chart-tab ${days === r.days ? "active" : ""}`}
            onClick={() => setDays(r.days)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="chart-canvas-wrap">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
