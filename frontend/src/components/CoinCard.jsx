/**
 * components/CoinCard.jsx — Compact card view for trending / watchlist
 */

import React from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, PointElement, LinearScale,
  CategoryScale, Filler,
} from "chart.js";
import { formatPrice, formatPercent, changeClass } from "../utils/format";
import { useWatchlist } from "../App";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler);

export default function CoinCard({ coin }) {
  const { watchlist, toggleWatchlist } = useWatchlist();
  const isWatched = watchlist.includes(coin.id);
  const change24h = coin.price_change_percentage_24h;
  const isPositive = change24h >= 0;

  // Sparkline chart config
  const sparkline = coin.sparkline_in_7d?.price || [];
  const chartData = {
    labels: sparkline.map((_, i) => i),
    datasets: [{
      data: sparkline,
      borderColor: isPositive ? "#00ff88" : "#ff4466",
      borderWidth: 1.5,
      fill: true,
      backgroundColor: isPositive ? "rgba(0,255,136,0.08)" : "rgba(255,68,102,0.08)",
      tension: 0.4,
      pointRadius: 0,
    }],
  };

  const sparkOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    animation: false,
  };

  return (
    <Link to={`/coin/${coin.id}`} className="coin-card" style={{ textDecoration: "none" }}>
      <div className="coin-card-header">
        <img src={coin.image} alt={coin.name} className="coin-card-img" />
        <div className="coin-card-info">
          <span className="coin-card-name">{coin.name}</span>
          <span className="coin-card-symbol">{coin.symbol?.toUpperCase()}</span>
        </div>
        <button
          className={`watch-btn ${isWatched ? "watched" : ""}`}
          onClick={(e) => { e.preventDefault(); toggleWatchlist(coin.id); }}
          title={isWatched ? "Remove from watchlist" : "Add to watchlist"}
        >
          {isWatched ? "★" : "☆"}
        </button>
      </div>

      <div className="coin-card-sparkline">
        <Line data={chartData} options={sparkOptions} />
      </div>

      <div className="coin-card-footer">
        <span className="coin-card-price">{formatPrice(coin.current_price)}</span>
        <span className={`coin-card-change ${changeClass(change24h)}`}>
          {formatPercent(change24h)}
        </span>
      </div>
    </Link>
  );
}
