# CryptoNexus — Live Cryptocurrency Tracker Dashboard

A full-stack cryptocurrency tracker with a **Dark Neon** design, real-time data from CoinGecko, and an interactive React frontend backed by an Express proxy.

---

## 🗂 Project Structure

```
crypto-tracker/
├── backend/
│   ├── routes/
│   │   └── crypto.js          # All API proxy routes
│   ├── server.js              # Express app entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx        # Sticky nav + theme toggle
    │   │   ├── GlobalStats.jsx   # Market cap / BTC dominance ticker
    │   │   ├── Dashboard.jsx     # Main sortable coin table
    │   │   ├── SearchBar.jsx     # Search + sort controls
    │   │   ├── CoinCard.jsx      # Compact card with sparkline
    │   │   ├── Chart.jsx         # Interactive Chart.js price chart
    │   │   ├── TopMovers.jsx     # Gainers / Losers panels
    │   │   └── Watchlist.jsx     # Watchlist grid
    │   ├── hooks/
    │   │   └── useCrypto.js      # useCoins, useCoin, useCoinChart, useGlobal
    │   ├── pages/
    │   │   ├── DashboardPage.jsx
    │   │   ├── CoinDetailPage.jsx
    │   │   └── WatchlistPage.jsx
    │   ├── utils/
    │   │   └── format.js         # Currency / number formatters
    │   ├── styles/
    │   │   └── global.css        # Dark Neon theme + responsive styles
    │   ├── App.js                # Router + ThemeContext + WatchlistContext
    │   └── index.js
    └── package.json
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # edit PORT if needed
npm run dev            # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm start              # starts on http://localhost:3000
```

CRA proxies `/api/*` to `http://localhost:5000` via the `"proxy"` field in `frontend/package.json`.

---

## 🌐 API Endpoints (Backend)

| Method | Endpoint               | Description                              |
|--------|------------------------|------------------------------------------|
| GET    | `/api/coins`           | Top 100 coins by market cap (USD)        |
| GET    | `/api/coin/:id`        | Full details for a single coin           |
| GET    | `/api/coin/:id/chart`  | Price history (`?days=1/7/30/90/365`)    |
| GET    | `/api/global`          | Global market stats                      |
| GET    | `/api/trending`        | Top trending coins (24h)                 |

---

## ✨ Features

- **Live price tracking** — auto-refreshes every 60 seconds
- **24h / 7d / 30d price change** — green/red indicators
- **Interactive charts** (Chart.js) with 1D / 7D / 30D / 90D / 1Y range tabs
- **Search** by name or symbol, **sort** by price, market cap, gainers, losers
- **Top Gainers / Losers** panels
- **Global market overview** (total cap, BTC dominance, 24h volume)
- **Watchlist** persisted in localStorage
- **Dark / Light mode** toggle (persisted in localStorage)
- **Responsive** — mobile-first grid + hidden table columns on small screens

---

## 🎨 Theme

| Token            | Dark Value    | Light Value  |
|------------------|---------------|--------------|
| Background       | `#060810`     | `#f0f2fa`    |
| Card             | `#111524`     | `#ffffff`    |
| Accent Green     | `#00ff88`     | `#00b864`    |
| Accent Blue      | `#00cfff`     | —            |
| Positive         | `#00ff88`     | `#00b864`    |
| Negative         | `#ff4466`     | `#ff4466`    |
| Display font     | Orbitron      | Orbitron     |
| Mono font        | JetBrains Mono| JetBrains Mono|

---

## 🔑 Optional: CoinGecko API Key

CoinGecko's free tier is rate-limited. For higher limits, sign up for a Pro key at https://www.coingecko.com/en/api and set it in `backend/.env`:

```
COINGECKO_API_KEY=your_key_here
```

---

## 🏗 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, React Router 6, Chart.js|
| Styling   | CSS Variables, Grid, Flexbox      |
| HTTP      | Axios                             |
| Backend   | Node.js, Express 4                |
| Data      | CoinGecko API v3                  |
| Storage   | localStorage (watchlist + theme)  |
