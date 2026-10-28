/**
 * components/Watchlist.jsx — Grid of saved coins
 */

import React from "react";
import CoinCard from "./CoinCard";

export default function Watchlist({ coins, watchlist }) {
  const watched = coins.filter((c) => watchlist.includes(c.id));

  if (watched.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">☆</span>
        <p>Your watchlist is empty.</p>
        <p className="empty-hint">Click the ☆ button on any coin to add it here.</p>
      </div>
    );
  }

  return (
    <div className="watchlist-grid">
      {watched.map((coin) => (
        <CoinCard key={coin.id} coin={coin} />
      ))}
    </div>
  );
}
