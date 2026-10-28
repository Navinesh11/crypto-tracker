/**
 * components/TopMovers.jsx — Top 5 gainers and losers in the last 24h
 */

import React from "react";
import { Link } from "react-router-dom";
import { formatPercent, formatPrice, changeClass } from "../utils/format";

export default function TopMovers({ coins }) {
  if (!coins || coins.length === 0) return null;

  const sorted = [...coins].sort(
    (a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
  );

  const gainers = sorted.slice(0, 5);
  const losers  = sorted.slice(-5).reverse();

  const MoverRow = ({ coin }) => (
    <Link to={`/coin/${coin.id}`} className="mover-row">
      <img src={coin.image} alt={coin.name} className="mover-img" />
      <span className="mover-name">{coin.symbol?.toUpperCase()}</span>
      <span className="mover-price">{formatPrice(coin.current_price)}</span>
      <span className={`mover-change ${changeClass(coin.price_change_percentage_24h)}`}>
        {formatPercent(coin.price_change_percentage_24h)}
      </span>
    </Link>
  );

  return (
    <div className="top-movers">
      <div className="movers-panel">
        <h3 className="movers-title gainers-title">🚀 Top Gainers</h3>
        {gainers.map((c) => <MoverRow key={c.id} coin={c} />)}
      </div>
      <div className="movers-panel">
        <h3 className="movers-title losers-title">📉 Top Losers</h3>
        {losers.map((c) => <MoverRow key={c.id} coin={c} />)}
      </div>
    </div>
  );
}
