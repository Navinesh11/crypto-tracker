/**
 * components/SearchBar.jsx — Search input + sort/filter controls
 */

import React from "react";

export const SORT_OPTIONS = [
  { value: "market_cap_rank",      label: "Rank" },
  { value: "current_price_desc",   label: "Price ↑" },
  { value: "current_price_asc",    label: "Price ↓" },
  { value: "price_change_desc",    label: "Gainers" },
  { value: "price_change_asc",     label: "Losers" },
  { value: "market_cap_desc",      label: "Market Cap ↑" },
  { value: "total_volume_desc",    label: "Volume ↑" },
];

export default function SearchBar({ query, onQuery, sortBy, onSort }) {
  return (
    <div className="search-bar-row">
      <div className="search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search coins by name or symbol…"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          spellCheck={false}
        />
        {query && (
          <button className="search-clear" onClick={() => onQuery("")}>✕</button>
        )}
      </div>

      <div className="sort-select-wrap">
        <label className="sort-label">Sort by:</label>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => onSort(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
