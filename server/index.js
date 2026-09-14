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

// (Auth endpoints are rate-limited inside routes/api.js.)

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
