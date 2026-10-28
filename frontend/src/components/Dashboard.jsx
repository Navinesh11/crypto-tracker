/**
 * components/Dashboard.jsx — Main coin table with sorting, search, watchlist actions
 */

import React from "react";
import { Link } from "react-router-dom";
import { formatPrice, formatLargeNumber, formatPercent, changeClass } from "../utils/format";
import { useWatchlist } from "../App";

export default function Dashboard({ coins, loading }) {
  const { watchlist, toggleWatchlist } = useWatchlist();

  if (loading) {
    return (
      <div className="table-wrap">
        <table className="coin-table">
          <thead>
            <tr>
              {["#", "", "Name", "Price", "24h %", "7d %", "Market Cap", "Volume 24h", ""].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i} className="skeleton-row">
                {Array.from({ length: 9 }).map((__, j) => <td key={j}><div className="skeleton-cell" /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!coins.length) {
    return <div className="empty-state">No coins found. Try a different search.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="coin-table">
        <thead>
          <tr>
            <th>#</th>
            <th></th>
            <th>Name</th>
            <th>Price</th>
            <th>24h %</th>
            <th>7d %</th>
            <th>Market Cap</th>
            <th>Volume (24h)</th>
            <th>Watch</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => {
            const change24  = coin.price_change_percentage_24h;
            const change7d  = coin.price_change_percentage_7d_in_currency;
            const isWatched = watchlist.includes(coin.id);

            return (
              <tr key={coin.id} className="coin-row">
                <td className="rank-cell">{coin.market_cap_rank}</td>
                <td className="img-cell">
                  <img src={coin.image} alt={coin.name} className="coin-img" />
                </td>
                <td className="name-cell">
                  <Link to={`/coin/${coin.id}`} className="coin-link">
                    <span className="coin-name">{coin.name}</span>
                    <span className="coin-symbol">{coin.symbol?.toUpperCase()}</span>
                  </Link>
                </td>
                <td className="price-cell">{formatPrice(coin.current_price)}</td>
                <td className={`change-cell ${changeClass(change24)}`}>
                  {formatPercent(change24)}
                </td>
                <td className={`change-cell ${changeClass(change7d)}`}>
                  {formatPercent(change7d)}
                </td>
                <td className="mcap-cell">{formatLargeNumber(coin.market_cap)}</td>
                <td className="vol-cell">{formatLargeNumber(coin.total_volume)}</td>
                <td className="watch-cell">
                  <button
                    className={`watch-btn ${isWatched ? "watched" : ""}`}
                    onClick={() => toggleWatchlist(coin.id)}
                    title={isWatched ? "Remove from watchlist" : "Add to watchlist"}
                  >
                    {isWatched ? "★" : "☆"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
