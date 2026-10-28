/**
 * Crypto Tracker Backend Server
 * Acts as a proxy to the CoinGecko API to avoid CORS issues
 * and to cache responses for performance.
 */

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cryptoRoutes = require('./routes/crypto');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET'],
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Rate limiting to prevent abuse of the CoinGecko API
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: { error: 'Too many requests. Please slow down.' }
});
app.use('/api', limiter);

// Routes
app.use('/api', cryptoRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Crypto Tracker backend running on http://localhost:${PORT}`);
});
