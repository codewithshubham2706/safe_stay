// In-memory rate limiter for auth endpoints (per IP + path bucket).
// Sized for 1000+ users; buckets expire lazily — no timers.
// `now` is injectable so tests can drive window boundaries deterministically.

export function createRateLimiter({ max = 20, windowMs = 10 * 60 * 1000, now = Date.now } = {}) {
  const buckets = new Map(); // "ip:path" -> { start, count }

  function middleware(req, res, next) {
    const key = `${req.ip}:${req.path}`;
    const t = now();
    let bucket = buckets.get(key);
    if (!bucket || t - bucket.start > windowMs) {
      bucket = { start: t, count: 0 };
      buckets.set(key, bucket);
    }
    bucket.count += 1;
    if (buckets.size > 10000) buckets.clear(); // unbounded-IP guard
    if (bucket.count > max) {
      return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
    }
    next();
  }

  return middleware;
}
