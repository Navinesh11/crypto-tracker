/**
 * useCryptoData — Custom hook
 * Fetches and auto-refreshes top coin market data from our backend proxy.
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const REFRESH_INTERVAL = 45000; // 45 seconds

export function useCryptoData() {
  const [coins, setCoins] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [coinsRes, globalRes] = await Promise.all([
        axios.get(`${API_BASE}/coins`, { params: { per_page: 100, page: 1 } }),
        axios.get(`${API_BASE}/global`)
      ]);
      setCoins(coinsRes.data);
      setGlobalData(globalRes.data?.data || null);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch crypto data:', err);
      setError(err.response?.data?.error || 'Failed to load data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { coins, globalData, loading, error, lastUpdated, refetch: fetchData };
}

export function useCoinDetail(coinId) {
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coinId) return;
    setLoading(true);

    axios.get(`${API_BASE}/coin/${coinId}`)
      .then(res => setCoin(res.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load coin details.'))
      .finally(() => setLoading(false));
  }, [coinId]);

  return { coin, loading, error };
}

export function useCoinChart(coinId, days = 7) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coinId) return;
    setLoading(true);

    axios.get(`${API_BASE}/coin/${coinId}/chart`, { params: { days } })
      .then(res => setChartData(res.data))
      .catch(err => setError('Failed to load chart data.'))
      .finally(() => setLoading(false));
  }, [coinId, days]);

  return { chartData, loading, error };
}
