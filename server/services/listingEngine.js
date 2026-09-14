// ── Listing engine — one pipeline shared verbatim by server and client ──────
// Pure module (no DB imports) so the browser bundles it safely.
// Priority: flagship-city seed data → deterministic generated listings.
// The server adds the live-database branch on top in routes/api.js.

import { SEED_HOSTELS, SEED_ROOMS, SEED_AMENITIES, SEED_AREA_SIGNALS } from '../seedData.js';
import { generateListingsForLocation } from './demoListingGenerator.js';
import { nearestFlagshipCity } from '../flagshipCities.js';

export const toPlain = (doc) => (doc && typeof doc.toObject === 'function' ? doc.toObject() : doc);

export function haversineKm([lng1, lat1], [lng2, lat2]) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const round1 = (n) => Math.round(n * 10) / 10;

// Rooms belonging to a hostel, with a guaranteed non-empty fallback.
export function roomsFor(rooms, hostelId) {
  const id = String(hostelId);
  const matches = rooms.filter(r => String(r.hostelId && r.hostelId._id ? r.hostelId._id : r.hostelId) === id);
  return matches.length ? matches : rooms.slice(0, 3);
}

// Seed listings for flagship cities; deterministic generated listings elsewhere.
// `label` (the searched place name) personalizes generated addresses.
export function resolveOfflineListings(lng, lat, label = 'India') {
  const flagship = nearestFlagshipCity(lat, lng);
  if (flagship) {
    return {
      hostels: SEED_HOSTELS,
      rooms: SEED_ROOMS,
      amenities: SEED_AMENITIES,
      signals: SEED_AREA_SIGNALS,
      dataSource: 'seed',
      label: flagship,
    };
  }
  const generated = generateListingsForLocation(lng, lat, label, 12);
  return { ...generated, rooms: SEED_ROOMS, dataSource: 'demo-generated', label };
}

// Gender / rent / name filtering. Empty result is a legitimate answer only for
// name search — gender & rent always match at least one listing by construction.
export function applyListingFilters(hostels, { gender, maxRent, aiQuery } = {}) {
  let out = hostels;
  if (gender && gender !== 'All') {
    out = out.filter(h => h.pgGenderCategory === gender || h.pgGenderCategory === 'Co-ed / Unisex');
  }
  if (maxRent) {
    const rentLimit = Number(maxRent);
    out = out.filter(h => h.cachedMinRent <= rentLimit);
  }
  if (aiQuery) {
    const q = String(aiQuery).toLowerCase();
    out = out.filter(h =>
      h.name.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q) ||
      (h.rooms || []).some(r => r.roomType.toLowerCase().includes(q))
    );
  }
  return out;
}

// Decorate hostels with distance from center + their rooms.
export function withDistanceAndRooms(hostels, rooms, center) {
  return hostels.map(raw => {
    const h = toPlain(raw);
    return {
      ...h,
      distanceKm: round1(haversineKm(center, h.location.coordinates)),
      rooms: roomsFor(rooms, h._id),
    };
  });
}
