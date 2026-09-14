import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import { dbState } from './dbState.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Trust the reverse proxy (Render/Railway/Heroku) so req.ip is the real client IP
// — otherwise rate limiting would bucket ALL users behind the proxy together.
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/safestay';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Lightweight in-memory rate limiter (protects registration/auth endpoints)
// Default: 20 requests per 10 minutes per IP — sized for 1000+ concurrent users.
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 20);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
const rateBuckets = new Map();
function rateLimit(req, res, next) {
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  let bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.start > RATE_LIMIT_WINDOW_MS) {
    bucket = { start: now, count: 0 };
    rateBuckets.set(key, bucket);
  }
  bucket.count += 1;
  if (bucket.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
  }
  next();
}
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateBuckets) {
    if (now - bucket.start > RATE_LIMIT_WINDOW_MS) rateBuckets.delete(key);
  }
}, RATE_LIMIT_WINDOW_MS).unref();

// ── Fast DB-state gate ──────────────────────────────────────
// dbState (from ./dbState.js) tracks live mongoose connectivity so routes can
// skip DB queries instantly instead of hanging ~10s on server-selection timeout.

let reconnectTimer = null;

function connectDB() {
  mongoose.set('bufferTimeoutMS', 100);
  mongoose.connect(MONGO_URI, {
    maxPoolSize: 50,
    serverSelectionTimeoutMS: 3000
  }).then(() => {
    dbState.connected = true;
    console.log('✅ Connected to MongoDB Database with pool size 50');
  }).catch((err) => {
    dbState.connected = false;
    console.warn('⚠️ MongoDB unreachable — running on built-in in-memory seed engine:', err.message);
  });
  // Reconnect automatically; never leave queries waiting on a dead pool.
  mongoose.connection.on('connected', () => { dbState.connected = true; });
  mongoose.connection.on('disconnected', () => {
    dbState.connected = false;
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => { reconnectTimer = null; connectDB(); }, 5000);
    }
  });
}
connectDB();

// API Routes
app.use('/api/auth/login', rateLimit);
app.use('/api/auth/register', rateLimit);
app.use('/api', apiRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'HEALTHY', timestamp: new Date().toISOString(), service: 'Project Safe-Stay Engine' });
});

// Serve frontend static build in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Safe-Stay Server active on http://localhost:${PORT}`);
});
