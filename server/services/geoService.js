// ── India-wide place search (OpenStreetMap Nominatim proxy) ──────────────
// Free, no API key. Results cached in-memory; proper User-Agent sent.
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const geoCache = new Map(); // key -> { data, expires }
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h for place lookups

function cacheGet(key) {
  const hit = geoCache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data;
  if (hit) geoCache.delete(key);
  return null;
}

function cacheSet(key, data, ttl = CACHE_TTL_MS) {
  if (geoCache.size > 2000) geoCache.clear(); // simple overflow guard
  geoCache.set(key, { data, expires: Date.now() + ttl });
}

const HEADERS = {
  'User-Agent': 'SafeStay/1.0 (student accommodation safety platform; India)',
  'Accept-Language': 'en'
};

export async function searchPlaces(query) {
  const key = `places:${query.toLowerCase().trim()}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  try {
    const url = `${NOMINATIM_BASE}/search?` + new URLSearchParams({
      q: query,
      countrycodes: 'in',
      addressdetails: '1',
      limit: '8',
      format: 'jsonv2'
    });
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
    const json = await res.json();
    const places = json.map(p => ({
      id: p.place_id,
      name: p.name || (p.display_name || '').split(',')[0],
      displayName: p.display_name,
      lat: Number(p.lat),
      lng: Number(p.lon),
      type: p.type,
      state: p.address?.state || null
    }));
    cacheSet(key, places);
    return places;
  } catch (e) {
    console.warn('Nominatim place search failed:', e.message);
    return null; // caller decides fallback
  }
}

// Reverse geocode coordinates to a human-readable locality name
export async function reverseGeocode(lat, lng) {
  const key = `rev:${lat.toFixed(3)},${lng.toFixed(3)}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  try {
    const target = `${NOMINATIM_BASE}/reverse?` + new URLSearchParams({
      lat: String(lat),
      lon: String(lng),
      zoom: '14',
      format: 'jsonv2'
    });
    const res = await fetch(target, { headers: HEADERS, signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
    const json = await res.json();
    const locality =
      json.address?.suburb ||
      json.address?.neighbourhood ||
      json.address?.village ||
      json.address?.town ||
      json.address?.city_district ||
      json.address?.city ||
      json.address?.state ||
      'India';
    const result = { locality: `${locality}, ${json.address?.state || 'India'}` };
    cacheSet(key, result);
    return result;
  } catch (e) {
    console.warn('Reverse geocode failed:', e.message);
    return { locality: 'India' };
  }
}
