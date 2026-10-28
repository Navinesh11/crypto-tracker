/**
 * App.js — Root component
 * Manages global theme, routing, and watchlist state
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import CoinDetailPage from './pages/CoinDetailPage';
import WatchlistPage from './pages/WatchlistPage';
import './styles.css';

function App() {
  // ── Theme state (dark = neon dark, light = clean light) ──
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // ── Watchlist stored in localStorage ──
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('watchlist')) || [];
    } catch {
      return [];
    }
  });

  // Persist theme to localStorage and apply to <html>
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  // Add or remove a coin from watchlist
  const toggleWatchlist = (coin) => {
    setWatchlist(prev => {
      const exists = prev.find(c => c.id === coin.id);
      return exists ? prev.filter(c => c.id !== coin.id) : [...prev, coin];
    });
  };

  const isWatched = (coinId) => watchlist.some(c => c.id === coinId);

  return (
    <Router>
      <div className="app" data-theme={theme}>
        <Navbar theme={theme} toggleTheme={toggleTheme} watchlistCount={watchlist.length} />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  watchlist={watchlist}
                  toggleWatchlist={toggleWatchlist}
                  isWatched={isWatched}
                />
              }
            />
            <Route
              path="/coin/:id"
              element={
                <CoinDetailPage
                  toggleWatchlist={toggleWatchlist}
                  isWatched={isWatched}
                />
              }
            />
            <Route
              path="/watchlist"
              element={
                <WatchlistPage
                  watchlist={watchlist}
                  toggleWatchlist={toggleWatchlist}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
