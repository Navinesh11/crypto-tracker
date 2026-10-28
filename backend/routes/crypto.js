/**
 * Crypto API Routes
 * Proxies requests to CoinGecko API with simple in-memory caching
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// Simple in-memory cache to reduce API calls
const cache = new Map();
const CACHE_TTL = 30 * 1000; // 30 seconds

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ── GET /api/coins ─────────────────────────────────────────────────────────
// Fetches top 100 coins by market cap
router.get('/coins', async (req, res) => {
  try {
    const { page = 1, per_page = 100, currency = 'usd' } = req.query;
    const cacheKey = `coins-${page}-${per_page}-${currency}`;

    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const response = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page,
        page,
        sparkline: true,              // 7-day sparkline data
        price_change_percentage: '1h,24h,7d'
      },
      timeout: 10000
    });

    setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching coins:', err.message);
    const status = err.response?.status || 500;
    res.status(status).json({ error: 'Failed to fetch coin data', details: err.message });
  }
});

// ── GET /api/coin/:id ──────────────────────────────────────────────────────
// Fetches detailed info for a specific coin
router.get('/coin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `coin-${id}`;

    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const response = await axios.get(`${COINGECKO_BASE}/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: true
      },
      timeout: 10000
    });

    setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (err) {
    console.error(`Error fetching coin ${req.params.id}:`, err.message);
    const status = err.response?.status || 500;
    res.status(status).json({ error: 'Failed to fetch coin details', details: err.message });
  }
});

// ── GET /api/coin/:id/chart ────────────────────────────────────────────────
// Fetches historical price data for charts
router.get('/coin/:id/chart', async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 7, currency = 'usd' } = req.query;
    const cacheKey = `chart-${id}-${days}-${currency}`;

    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const response = await axios.get(`${COINGECKO_BASE}/coins/${id}/market_chart`, {
      params: { vs_currency: currency, days, interval: days <= 1 ? 'hourly' : 'daily' },
      timeout: 10000
    });

    setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (err) {
    console.error(`Error fetching chart for ${req.params.id}:`, err.message);
    const status = err.response?.status || 500;
    res.status(status).json({ error: 'Failed to fetch chart data', details: err.message });
  }
});

// ── GET /api/global ────────────────────────────────────────────────────────
// Fetches global crypto market stats
router.get('/global', async (req, res) => {
  try {
    const cached = getCached('global');
    if (cached) return res.json(cached);

    const response = await axios.get(`${COINGECKO_BASE}/global`, { timeout: 10000 });
    setCache('global', response.data);
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching global data:', err.message);
    res.status(500).json({ error: 'Failed to fetch global market data' });
  }
});

module.exports = router;
