// ── Flagship cities (single source of truth for client AND server) ─────────
// These cities have hand-crafted seed listings. Every other location in India
// gets deterministic generated listings instead.
export const FLAGSHIP_CITIES = {
  'Kota':                         { label: 'Kota',        lat: 25.1388, lng: 75.8458 },
  'Delhi - North Campus':         { label: 'Delhi DU',    lat: 28.6942, lng: 77.2095 },
  'Delhi - Kalu Sarai (IIT Hub)': { label: 'Kalu Sarai',  lat: 28.5447, lng: 77.1926 },
  'Bengaluru - Koramangala':      { label: 'Koramangala', lat: 12.9352, lng: 77.6245 },
};

// A searched point within this many degrees of a flagship center counts as that city.
const FLAGSHIP_TOLERANCE_DEG = 0.05;

export function nearestFlagshipCity(lat, lng) {
  for (const [name, c] of Object.entries(FLAGSHIP_CITIES)) {
    if (Math.abs(c.lat - lat) < FLAGSHIP_TOLERANCE_DEG && Math.abs(c.lng - lng) < FLAGSHIP_TOLERANCE_DEG) return name;
  }
  return null;
}

// Offline autocomplete fallback for the navbar search (used only when the
// backend geocoding endpoint is unreachable).
export const FALLBACK_CITIES = [
  { name: 'Kota',      displayName: 'Kota, Rajasthan, India',              lat: 25.1388, lng: 75.8458,  state: 'Rajasthan' },
  { name: 'Delhi',     displayName: 'Delhi, India',                        lat: 28.6139, lng: 77.209,   state: 'Delhi' },
  { name: 'Bengaluru', displayName: 'Bengaluru, Karnataka, India',         lat: 12.9716, lng: 77.5946,  state: 'Karnataka' },
  { name: 'Pune',      displayName: 'Pune, Maharashtra, India',            lat: 18.5204, lng: 73.8567,  state: 'Maharashtra' },
  { name: 'Hyderabad', displayName: 'Hyderabad, Telangana, India',         lat: 17.385,  lng: 78.4867,  state: 'Telangana' },
  { name: 'Mumbai',    displayName: 'Mumbai, Maharashtra, India',          lat: 19.076,  lng: 72.8777,  state: 'Maharashtra' },
  { name: 'Chennai',   displayName: 'Chennai, Tamil Nadu, India',          lat: 13.0827, lng: 80.2707,  state: 'Tamil Nadu' },
  { name: 'Jaipur',    displayName: 'Jaipur, Rajasthan, India',            lat: 26.9124, lng: 75.7873,  state: 'Rajasthan' },
  { name: 'Lucknow',   displayName: 'Lucknow, Uttar Pradesh, India',       lat: 26.8467, lng: 80.9462,  state: 'Uttar Pradesh' },
  { name: 'Bhopal',    displayName: 'Bhopal, Madhya Pradesh, India',       lat: 23.2599, lng: 77.4126,  state: 'Madhya Pradesh' },
  { name: 'Indore',    displayName: 'Indore, Madhya Pradesh, India',       lat: 22.7196, lng: 75.8577,  state: 'Madhya Pradesh' },
  { name: 'Patna',     displayName: 'Patna, Bihar, India',                 lat: 25.5941, lng: 85.1376,  state: 'Bihar' },
  { name: 'Kolkata',   displayName: 'Kolkata, West Bengal, India',         lat: 22.5726, lng: 88.3639,  state: 'West Bengal' },
  { name: 'Ahmedabad', displayName: 'Ahmedabad, Gujarat, India',           lat: 23.0225, lng: 72.5714,  state: 'Gujarat' },
  { name: 'Varanasi',  displayName: 'Varanasi, Uttar Pradesh, India',      lat: 25.3176, lng: 82.9739,  state: 'Uttar Pradesh' },
  { name: 'Guwahati',  displayName: 'Guwahati, Assam, India',              lat: 26.1445, lng: 91.7362,  state: 'Assam' },
];
