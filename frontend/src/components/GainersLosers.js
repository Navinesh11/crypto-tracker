/**
 * GainersLosers — Shows top 5 gainers and losers by 24h change
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

function GainersLosers({ coins }) {
  const navigate = useNavigate();

  if (!coins || coins.length === 0) return null;

  const sorted = [...coins].sort((a, b) =>
    (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
  );

  const gainers = sorted.slice(0, 5);
  const losers = sorted.slice(-5).reverse();

  const CoinMiniCard = ({ coin, type }) => (
    <div
      className={`mini-coin-card ${type}`}
      onClick={() => navigate(`/coin/${coin.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/coin/${coin.id}`)}
    >
      <img src={coin.image} alt={coin.name} className="mini-coin-img" loading="lazy" />
      <div className="mini-coin-info">
        <span className="mini-coin-symbol">{coin.symbol?.toUpperCase()}</span>
        <span className="mini-coin-name">{coin.name}</span>
      </div>
      <div className={`mini-coin-change ${type}`}>
        {type === 'gainer' ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
      </div>
    </div>
  );

  return (
    <div className="gainers-losers">
      <div className="gainers-section">
        <h3 className="gl-title gainer">🚀 Top Gainers (24h)</h3>
        <div className="gl-list">
          {gainers.map(coin => <CoinMiniCard key={coin.id} coin={coin} type="gainer" />)}
        </div>
      </div>
      <div className="losers-section">
        <h3 className="gl-title loser">📉 Top Losers (24h)</h3>
        <div className="gl-list">
          {losers.map(coin => <CoinMiniCard key={coin.id} coin={coin} type="loser" />)}
        </div>
      </div>
    </div>
  );
}

export default GainersLosers;
