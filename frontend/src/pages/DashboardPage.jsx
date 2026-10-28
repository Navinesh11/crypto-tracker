/**
 * pages/DashboardPage.jsx — Main page: global stats, search, table, movers
 */

import React, { useState, useMemo } from "react";
import { useCoins } from "../hooks/useCrypto";
import GlobalStats from "../components/GlobalStats";
import SearchBar from "../components/SearchBar";
import Dashboard from "../components/Dashboard";
import TopMovers from "../components/TopMovers";

function applySort(coins, sortBy) {
  const arr = [...coins];
  switch (sortBy) {
    case "current_price_desc": return arr.sort((a, b) => b.current_price - a.current_price);
    case "current_price_asc":  return arr.sort((a, b) => a.current_price - b.current_price);
    case "price_change_desc":  return arr.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    case "price_change_asc":   return arr.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
    case "market_cap_desc":    return arr.sort((a, b) => b.market_cap - a.market_cap);
    case "total_volume_desc":  return arr.sort((a, b) => b.total_volume - a.total_volume);
    default:                   return arr.sort((a, b) => a.market_cap_rank - b.market_cap_rank);
  }
}

export default function DashboardPage() {
  const { coins, loading, error, lastUpdated, refetch } = useCoins(60000);
  const [query, setQuery]   = useState("");
  const [sortBy, setSortBy] = useState("market_cap_rank");

  const filteredCoins = useMemo(() => {
    const q = query.toLowerCase();
    const filtered = q
      ? coins.filter(
          (c) =>
            c.name?.toLowerCase().includes(q) ||
            c.symbol?.toLowerCase().includes(q)
        )
      : coins;
    return applySort(filtered, sortBy);
  }, [coins, query, sortBy]);

  return (
    <div className="page dashboard-page">
      {/* Global market overview ticker */}
      <GlobalStats />

      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Market Overview</h1>
          {lastUpdated && (
            <span className="last-updated">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
        <button className="refresh-btn" onClick={refetch} title="Refresh">
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ Failed to fetch data: {error}. Is the backend running?
        </div>
      )}

      {/* Top Gainers / Losers */}
      {!loading && <TopMovers coins={coins} />}

      {/* Search + Sort */}
      <SearchBar query={query} onQuery={setQuery} sortBy={sortBy} onSort={setSortBy} />

      {/* Results count */}
      {!loading && (
        <p className="results-count">
          Showing <strong>{filteredCoins.length}</strong> of {coins.length} coins
        </p>
      )}

      {/* Main table */}
      <Dashboard coins={filteredCoins} loading={loading} />
    </div>
  );
}
