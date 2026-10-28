/**
 * hooks/useCrypto.js — Data-fetching hooks with auto-refresh
 */

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = "/api"; // proxied to http://localhost:5000 via CRA proxy

// ─── useCoins: top 100 coins list ─────────────────────────────────────────────
export function useCoins(refreshInterval = 60000) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchCoins = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/coins`);
      setCoins(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchCoins, refreshInterval]);

  return { coins, loading, error, lastUpdated, refetch: fetchCoins };
}

// ─── useCoin: single coin detail ──────────────────────────────────────────────
export function useCoin(id) {
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`${API}/coin/${id}`)
      .then(({ data }) => { setCoin(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { coin, loading, error };
}

// ─── useCoinChart: price chart data ───────────────────────────────────────────
export function useCoinChart(id, days = 7) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`${API}/coin/${id}/chart`, { params: { days } })
      .then(({ data }) => setChartData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, days]);

  return { chartData, loading };
}

// ─── useGlobal: global market stats ───────────────────────────────────────────
export function useGlobal() {
  const [global, setGlobal] = useState(null);

  useEffect(() => {
    axios.get(`${API}/global`).then(({ data }) => setGlobal(data)).catch(console.error);
  }, []);

  return global;
}

// ─── useTrending ──────────────────────────────────────────────────────────────
export function useTrending() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/trending`)
      .then(({ data }) => setTrending(data.coins || []))
      .catch(console.error);
  }, []);

  return trending;
}
