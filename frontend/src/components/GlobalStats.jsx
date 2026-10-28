/**
 * components/GlobalStats.jsx — Scrolling ticker of global market stats
 */

import React from "react";
import { useGlobal } from "../hooks/useCrypto";
import { formatLargeNumber, formatPercent, changeClass } from "../utils/format";

export default function GlobalStats() {
  const global = useGlobal();

  if (!global) return <div className="global-stats-bar skeleton" />;

  const totalMcap = global.total_market_cap?.usd;
  const totalVol  = global.total_volume?.usd;
  const btcDom    = global.market_cap_percentage?.btc;
  const ethDom    = global.market_cap_percentage?.eth;
  const mcapChange = global.market_cap_change_percentage_24h_usd;

  return (
    <div className="global-stats-bar">
      <div className="global-stats-inner">
        <span className="stat-item">
          <span className="stat-label">Market Cap:</span>
          <span className="stat-value">{formatLargeNumber(totalMcap)}</span>
          <span className={`stat-change ${changeClass(mcapChange)}`}>
            {formatPercent(mcapChange)}
          </span>
        </span>
        <span className="stat-sep">·</span>
        <span className="stat-item">
          <span className="stat-label">24h Vol:</span>
          <span className="stat-value">{formatLargeNumber(totalVol)}</span>
        </span>
        <span className="stat-sep">·</span>
        <span className="stat-item">
          <span className="stat-label">BTC Dom:</span>
          <span className="stat-value">{btcDom?.toFixed(1)}%</span>
        </span>
        <span className="stat-sep">·</span>
        <span className="stat-item">
          <span className="stat-label">ETH Dom:</span>
          <span className="stat-value">{ethDom?.toFixed(1)}%</span>
        </span>
        <span className="stat-sep">·</span>
        <span className="stat-item">
          <span className="stat-label">Coins:</span>
          <span className="stat-value">{global.active_cryptocurrencies?.toLocaleString()}</span>
        </span>
        <span className="stat-sep">·</span>
        <span className="stat-item">
          <span className="stat-label">Exchanges:</span>
          <span className="stat-value">{global.markets?.toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
}
