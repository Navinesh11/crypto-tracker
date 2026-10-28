/**
 * pages/WatchlistPage.jsx — Saved coins grid
 */

import React from "react";
import { useCoins } from "../hooks/useCrypto";
import { useWatchlist } from "../App";
import Watchlist from "../components/Watchlist";

export default function WatchlistPage() {
  const { coins, loading } = useCoins(60000);
  const { watchlist } = useWatchlist();

  return (
    <div className="page watchlist-page">
      <div className="page-header">
        <h1 className="page-title">
          ★ My Watchlist
          {watchlist.length > 0 && (
            <span className="watchlist-count">{watchlist.length} coins</span>
          )}
        </h1>
      </div>

      {loading ? (
        <div className="watchlist-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="coin-card skeleton-card" />
          ))}
        </div>
      ) : (
        <Watchlist coins={coins} watchlist={watchlist} />
      )}
    </div>
  );
}
