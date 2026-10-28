/**
 * Watchlist — Grid of watched coins with quick stats
 * Used inside WatchlistPage
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

function formatPrice(price) {
  if (!price && price !== 0) return '—';
  if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
}

function WatchlistGrid({ watchlist, toggleWatchlist }) {
  const navigate = useNavigate();

  if (!watchlist || watchlist.length === 0) {
    return (
      <div className="watchlist-empty">
        <div className="empty-icon">☆</div>
        <h3>Your watchlist is empty</h3>
        <p>Star coins from the Dashboard to track them here.</p>
      </div>
    );
  }

  return (
    <div className="watchlist-grid">
      {watchlist.map(coin => (
        <div
          key={coin.id}
          className="watchlist-card"
          onClick={() => navigate(`/coin/${coin.id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate(`/coin/${coin.id}`)}
        >
          <button
            className="watchlist-remove-btn"
            onClick={e => { e.stopPropagation(); toggleWatchlist(coin); }}
            title="Remove from watchlist"
          >
            ★
          </button>
          <img src={coin.image} alt={coin.name} className="wl-coin-img" loading="lazy" />
          <div className="wl-coin-name">{coin.name}</div>
          <div className="wl-coin-symbol">{coin.symbol?.toUpperCase()}</div>
          <div className="wl-coin-price">{formatPrice(coin.current_price)}</div>
          <div className={`wl-coin-change ${(coin.price_change_percentage_24h || 0) >= 0 ? 'positive' : 'negative'}`}>
            {(coin.price_change_percentage_24h || 0) >= 0 ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
          </div>
          <div className="wl-market-cap">
            Rank #{coin.market_cap_rank}
          </div>
        </div>
      ))}
    </div>
  );
}

export default WatchlistGrid;
