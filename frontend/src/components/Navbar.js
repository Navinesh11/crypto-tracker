/**
 * Navbar — Top navigation bar
 * Logo, nav links, dark/light toggle, watchlist count badge
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ theme, toggleTheme, watchlistCount }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: '◈' },
    { to: '/watchlist', label: 'Watchlist', icon: '★', badge: watchlistCount }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">₿</span>
          <span className="logo-text">NEXUS<span className="logo-accent">CRYPTO</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
              {link.badge > 0 && <span className="nav-badge">{link.badge}</span>}
            </Link>
          ))}
        </div>

        {/* Right Controls */}
        <div className="navbar-controls">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀' : '◑'}
          </button>
          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-nav-link ${location.pathname === link.to ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon} {link.label}
              {link.badge > 0 && <span className="nav-badge">{link.badge}</span>}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
