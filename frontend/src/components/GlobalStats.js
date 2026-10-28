/**
 * GlobalStats — Market overview bar
 * Shows total market cap, BTC dominance, 24h volume, active coins
 */

import React from 'react';

function formatLargeNumber(num) {
  if (!num) return '—';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

function GlobalStats({ globalData, lastUpdated }) {
  if (!globalData) return null;

  const stats = [
    {
      label: 'Total Market Cap',
      value: formatLargeNumber(globalData.total_market_cap?.usd),
      change: globalData.market_cap_change_percentage_24h_usd,
      icon: '◎'
    },
    {
      label: '24h Volume',
      value: formatLargeNumber(globalData.total_volume?.usd),
      icon: '⟳'
    },
    {
      label: 'BTC Dominance',
      value: `${globalData.market_cap_percentage?.btc?.toFixed(1)}%`,
      icon: '₿'
    },
    {
      label: 'ETH Dominance',
      value: `${globalData.market_cap_percentage?.eth?.toFixed(1)}%`,
      icon: 'Ξ'
    },
    {
      label: 'Active Coins',
      value: globalData.active_cryptocurrencies?.toLocaleString(),
      icon: '◈'
    }
  ];

  return (
    <div className="global-stats">
      <div className="global-stats-inner">
        {stats.map((stat, i) => (
          <div className="global-stat-item" key={i}>
            <span className="stat-icon">{stat.icon}</span>
            <span className="stat-label">{stat.label}:</span>
            <span className="stat-value">{stat.value}</span>
            {stat.change !== undefined && (
              <span className={`stat-change ${stat.change >= 0 ? 'positive' : 'negative'}`}>
                {stat.change >= 0 ? '▲' : '▼'} {Math.abs(stat.change).toFixed(2)}%
              </span>
            )}
          </div>
        ))}
        {lastUpdated && (
          <div className="global-stat-item last-updated">
            <span className="stat-label">Updated:</span>
            <span className="stat-value">{lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default GlobalStats;
