/**
 * pages/CoinDetailPage.jsx — Full detail view for a single coin
 */

import React from "react";
import { useParams, Link } from "react-router-dom";
import { useCoin } from "../hooks/useCrypto";
import { useWatchlist } from "../App";
import PriceChart from "../components/Chart";
import { formatPrice, formatLargeNumber, formatPercent, changeClass } from "../utils/format";

export default function CoinDetailPage() {
  const { id } = useParams();
  const { coin, loading, error } = useCoin(id);
  const { watchlist, toggleWatchlist } = useWatchlist();
  const isWatched = watchlist.includes(id);

  if (loading) {
    return (
      <div className="page detail-page">
        <div className="detail-skeleton">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-block" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="page detail-page">
        <div className="error-banner">Failed to load coin: {error}</div>
        <Link to="/" className="back-link">← Back to Dashboard</Link>
      </div>
    );
  }

  const md = coin.market_data;
  const change24h = md?.price_change_percentage_24h;
  const change7d  = md?.price_change_percentage_7d;
  const change30d = md?.price_change_percentage_30d;

  const stats = [
    { label: "Market Cap",        value: formatLargeNumber(md?.market_cap?.usd) },
    { label: "Fully Diluted MC",  value: formatLargeNumber(md?.fully_diluted_valuation?.usd) },
    { label: "Trading Volume 24h",value: formatLargeNumber(md?.total_volume?.usd) },
    { label: "Circulating Supply",value: `${md?.circulating_supply?.toLocaleString()} ${coin.symbol?.toUpperCase()}` },
    { label: "Total Supply",      value: md?.total_supply ? `${md.total_supply.toLocaleString()} ${coin.symbol?.toUpperCase()}` : "∞" },
    { label: "Max Supply",        value: md?.max_supply   ? `${md.max_supply.toLocaleString()} ${coin.symbol?.toUpperCase()}` : "∞" },
    { label: "All-Time High",     value: formatPrice(md?.ath?.usd) },
    { label: "ATH Date",          value: md?.ath_date?.usd ? new Date(md.ath_date.usd).toLocaleDateString() : "—" },
    { label: "All-Time Low",      value: formatPrice(md?.atl?.usd) },
    { label: "Market Cap Rank",   value: `#${coin.market_cap_rank}` },
    { label: "24h High",          value: formatPrice(md?.high_24h?.usd) },
    { label: "24h Low",           value: formatPrice(md?.low_24h?.usd) },
  ];

  return (
    <div className="page detail-page">
      {/* Back link */}
      <Link to="/" className="back-link">← Back to Dashboard</Link>

      {/* Header */}
      <div className="detail-header">
        <img src={coin.image?.large} alt={coin.name} className="detail-img" />
        <div className="detail-title-group">
          <div className="detail-name-row">
            <h1 className="detail-name">{coin.name}</h1>
            <span className="detail-symbol">{coin.symbol?.toUpperCase()}</span>
            <span className="detail-rank">#{coin.market_cap_rank}</span>
          </div>
          <div className="detail-price-row">
            <span className="detail-price">{formatPrice(md?.current_price?.usd)}</span>
            <span className={`detail-change ${changeClass(change24h)}`}>
              {formatPercent(change24h)} (24h)
            </span>
          </div>
          <div className="detail-changes-row">
            <span className={`change-pill ${changeClass(change7d)}`}>7d: {formatPercent(change7d)}</span>
            <span className={`change-pill ${changeClass(change30d)}`}>30d: {formatPercent(change30d)}</span>
          </div>
        </div>
        <button
          className={`watch-btn-lg ${isWatched ? "watched" : ""}`}
          onClick={() => toggleWatchlist(id)}
        >
          {isWatched ? "★ Watching" : "☆ Watch"}
        </button>
      </div>

      {/* Price Chart */}
      <section className="detail-section">
        <h2 className="section-title">Price Chart (USD)</h2>
        <PriceChart coinId={id} />
      </section>

      {/* Stats grid */}
      <section className="detail-section">
        <h2 className="section-title">Market Statistics</h2>
        <div className="stats-grid">
          {stats.map(({ label, value }) => (
            <div key={label} className="stat-card">
              <span className="stat-card-label">{label}</span>
              <span className="stat-card-value">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      {coin.description?.en && (
        <section className="detail-section">
          <h2 className="section-title">About {coin.name}</h2>
          <div
            className="detail-description"
            dangerouslySetInnerHTML={{
              __html: coin.description.en.split(". ").slice(0, 6).join(". ") + ".",
            }}
          />
        </section>
      )}

      {/* Links */}
      <section className="detail-section">
        <h2 className="section-title">Links</h2>
        <div className="links-row">
          {coin.links?.homepage?.[0] && (
            <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer" className="ext-link">
              🌐 Website
            </a>
          )}
          {coin.links?.blockchain_site?.[0] && (
            <a href={coin.links.blockchain_site[0]} target="_blank" rel="noopener noreferrer" className="ext-link">
              🔗 Explorer
            </a>
          )}
          {coin.links?.subreddit_url && (
            <a href={coin.links.subreddit_url} target="_blank" rel="noopener noreferrer" className="ext-link">
              💬 Reddit
            </a>
          )}
          {coin.links?.repos_url?.github?.[0] && (
            <a href={coin.links.repos_url.github[0]} target="_blank" rel="noopener noreferrer" className="ext-link">
              💻 GitHub
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
