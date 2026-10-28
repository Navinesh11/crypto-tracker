/**
 * CoinCard — Individual coin row in the dashboard table
 * Shows rank, image, name, price, changes, market cap, sparkline
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sparkline from './Sparkline';

function formatPrice(price) {
  if (!price && price !== 0) return '—';
  if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(4)}`;
  if (price >= 0.01) return `$${price.toFixed(6)}`;
  return `$${price.toFixed(8)}`;
}

function formatLargeNum(n) {
  if (!n) return '—';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}

function PriceChange({ value }) {
  if (value === null || value === undefined) return <span className="change-neutral">—</span>;
  const isPos = value >= 0;
  return (
    <span className={`price-change ${isPos ? 'positive' : 'negative'}`}>
      {isPos ? '▲' : '▼'} {Math.abs(value).toFixed(2)}%
    </span>
  );
}

function CoinCard({ coin, rank, isWatched, onToggleWatchlist }) {
  const navigate = useNavigate();

  return (
    <tr
      className="coin-row"
      onClick={() => navigate(`/coin/${coin.id}`)}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/coin/${coin.id}`)}
      role="button"
      aria-label={`View details for ${coin.name}`}
    >
      {/* Watchlist Star */}
      <td className="coin-watchlist-cell" onClick={e => { e.stopPropagation(); onToggleWatchlist(coin); }}>
        <button
          className={`watchlist-btn ${isWatched ? 'watched' : ''}`}
          title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
          aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          {isWatched ? '★' : '☆'}
        </button>
      </td>

      {/* Rank */}
      <td className="coin-rank">#{rank}</td>

      {/* Coin Name + Image */}
      <td className="coin-name-cell">
        <img src={coin.image} alt={coin.name} className="coin-img" loading="lazy" />
        <div className="coin-name-group">
          <span className="coin-name">{coin.name}</span>
          <span className="coin-symbol">{coin.symbol?.toUpperCase()}</span>
        </div>
      </td>

      {/* Price */}
      <td className="coin-price">{formatPrice(coin.current_price)}</td>

      {/* 1h Change */}
      <td className="coin-change"><PriceChange value={coin.price_change_percentage_1h_in_currency} /></td>

      {/* 24h Change */}
      <td className="coin-change"><PriceChange value={coin.price_change_percentage_24h} /></td>

      {/* 7d Change */}
      <td className="coin-change"><PriceChange value={coin.price_change_percentage_7d_in_currency} /></td>

      {/* Market Cap */}
      <td className="coin-marketcap">{formatLargeNum(coin.market_cap)}</td>

      {/* 24h Volume */}
      <td className="coin-volume">{formatLargeNum(coin.total_volume)}</td>

      {/* 7-day Sparkline */}
      <td className="coin-sparkline">
        {coin.sparkline_in_7d?.price && (
          <Sparkline
            data={coin.sparkline_in_7d.price}
            positive={coin.price_change_percentage_7d_in_currency >= 0}
          />
        )}
      </td>
    </tr>
  );
}

export default CoinCard;
