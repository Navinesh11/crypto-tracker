/**
 * components/Navbar.jsx — Top navigation bar
 * Includes: logo, nav links, theme toggle, watchlist badge
 */

import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme, useWatchlist } from "../App";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { watchlist } = useWatchlist();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">₿</span>
          <span className="logo-text">CryptoNexus</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Dashboard
          </NavLink>
          <NavLink to="/watchlist" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Watchlist
            {watchlist.length > 0 && (
              <span className="watchlist-badge">{watchlist.length}</span>
            )}
          </NavLink>
        </nav>

        {/* Controls */}
        <div className="navbar-controls">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {/* Hamburger for mobile */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" end onClick={() => setMenuOpen(false)} className="mobile-link">Dashboard</NavLink>
          <NavLink to="/watchlist" onClick={() => setMenuOpen(false)} className="mobile-link">
            Watchlist {watchlist.length > 0 && `(${watchlist.length})`}
          </NavLink>
        </div>
      )}
    </header>
  );
}
