// ── Safe-Stay executable contract ─────────────────────────────────────────
// Zero-dependency, table-driven: each table row is one promised behavior or
// boundary of the platform. Run: npm test
import assert from 'node:assert/strict';
import { calculateAuditScores, sviGradeFor } from '../utils/sviCalculator.js';
import { validateRegistration } from '../utils/validation.js';
import { createRateLimiter } from '../utils/rateLimiter.js';
import {
  resolveOfflineListings,
  applyListingFilters,
  withDistanceAndRooms,
  roomsFor,
  haversineKm,
} from '../services/listingEngine.js';
import { nearestFlagshipCity, FLAGSHIP_CITIES } from '../flagshipCities.js';

let failures = 0;
function check(name, fn) {
  try { fn(); console.log(`✅ ${name}`); }
  catch (e) { failures++; console.error(`❌ ${name}\n   ${e.message}`); }
}

// ── 1. SVI scoring contract ────────────────────────────────────────────────
// weights: decade {<1990:30, 90-05:20, 06-18:10, >2018:0, unknown:10},
//          extra floor ×25, basement {student:25, storage:10, none:0},
//          wiring +15, cracks +20, extinguisher +20, exits<2 +10; clamp 0-100
const base = {
  constructionDecade: '>2018', floorsBuilt: 4, floorsPermitted: 4, basementUsage: 'None',
  emergencyExitsCount: 2, depositReturnedStatus: 'Returned Full',
};

const sviCases = [
  { name: 'sound building scores 0 / Grade A', svi: 0, grade: 'Grade A (Sound)', input: {} },
  { name: 'pre-1990 decade adds 30', svi: 30, grade: 'Grade B (Moderate Risk)', input: { constructionDecade: '<1990' } },
  { name: 'unknown decade falls back to +10', svi: 10, grade: 'Grade A (Sound)', input: { constructionDecade: 'unknown' } },
  { name: 'two illegal floors add 50', svi: 50, grade: 'Grade B (Moderate Risk)', input: { floorsBuilt: 6 } },
  { name: 'built below permitted adds 0', svi: 0, grade: 'Grade A (Sound)', input: { floorsBuilt: 2 } },
  { name: 'student basement adds 25', svi: 25, grade: 'Grade A (Sound)', input: { basementUsage: 'Student Rooms/Library' } },
  { name: 'all hazards clamp at 100 / Grade C/D', svi: 100, grade: 'Grade C/D (Severe Hazard)',
    input: { constructionDecade: '<1990', floorsBuilt: 9, basementUsage: 'Student Rooms/Library', openWiringHazard: true, structuralCracks: true, fireExtinguishersExpiredOrMissing: true, emergencyExitsCount: 0 } },
];
for (const c of sviCases) {
  check(`SVI: ${c.name}`, () => {
    const r = calculateAuditScores({ ...base, ...c.input });
    assert.equal(r.sviScore, c.svi);
    assert.equal(r.sviGrade, c.grade);
    assert.ok(r.sviScore >= 0 && r.sviScore <= 100);
  });
}

const mdiCases = [
  { name: 'no decay flags → MDI 0, not critical', mdi: 0, critical: false, input: {} },
  { name: 'seepage + mold = 50 is NOT critical (>50 boundary)', mdi: 50, critical: false, input: { waterSeepageCeilingWalls: true, dampnessMoldInRooms: true } },
  { name: 'seepage + mold + plumbing = 70 IS critical', mdi: 70, critical: true, input: { waterSeepageCeilingWalls: true, dampnessMoldInRooms: true, unrepairedPlumbingIssues: true } },
];
for (const c of mdiCases) {
  check(`MDI: ${c.name}`, () => {
    const r = calculateAuditScores({ ...base, ...c.input });
    assert.equal(r.maintenanceDecayScore, c.mdi);
    assert.equal(r.isCriticallyNeglected, c.critical);
  });
}

check('SVI: deposit status maps to risk rating', () => {
  assert.equal(calculateAuditScores({ ...base, depositReturnedStatus: 'Refused Refund' }).depositRiskRating, 'High Non-Refund Risk');
  assert.equal(calculateAuditScores({ ...base, depositReturnedStatus: 'Unfair Deductions' }).depositRiskRating, 'Unfair Deductions Reported');
  assert.equal(calculateAuditScores({ ...base, depositReturnedStatus: 'Returned Full' }).depositRiskRating, 'Safe / Fully Refunded');
});

check('SVI: grade boundaries at 30 and 60', () => {
  assert.deepEqual([29, 30, 60, 61].map(sviGradeFor), [
    'Grade A (Sound)', 'Grade B (Moderate Risk)', 'Grade B (Moderate Risk)', 'Grade C/D (Severe Hazard)',
  ]);
});

// ── 2. Registration validation contract ───────────────────────────────────
const valid = { fullName: 'Shubham', email: 's@x.com', password: 'secret6', role: 'student', gender: 'Male' };

const registrationCases = [
  { name: 'valid payload → no errors', input: valid, errors: 0 },
  { name: 'empty strings → all 5 errors', input: { fullName: '', email: '', password: '', role: '', gender: '' }, errors: 5 },
  { name: 'name too short', input: { fullName: 'A' }, errors: 1 },
  { name: 'email without domain', input: { email: 'not-an-email' }, errors: 1 },
  { name: 'password under 6 chars', input: { password: '12345' }, errors: 1 },
  { name: 'role outside enum', input: { role: 'hacker' }, errors: 1 },
  { name: 'gender outside enum', input: { gender: 'Robot' }, errors: 1 },
];
for (const c of registrationCases) {
  check(`Register: ${c.name}`, () => {
    assert.equal(validateRegistration({ ...valid, ...c.input }).length, c.errors);
  });
}

// ── 3. Rate limiter contract (injectable clock) ───────────────────────────
function fakeRes() { return { statusCode: 0, body: null, status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; } }; }
function fakeReq(ip, path) { return { ip, path }; }

const limit = 3;
let clock = 0;
const limiter = createRateLimiter({ max: limit, windowMs: 1000, now: () => clock });
const attempt = (ip = '1.1.1.1') => {
  const res = fakeRes();
  limiter(fakeReq(ip, '/auth/login'), res, () => res.passed = true);
  return res;
};

check('Rate limit: allows up to max, then 429s', () => {
  for (let i = 0; i < limit; i++) assert.equal(attempt().passed, true, `attempt ${i + 1} should pass`);
  const blocked = attempt();
  assert.equal(blocked.statusCode, 429);
});

check('Rate limit: window reset lets requests through again', () => {
  clock = 1001; // past windowMs
  assert.equal(attempt().passed, true);
});

check('Rate limit: buckets are per IP+path', () => {
  assert.equal(attempt('2.2.2.2').passed, true, 'different IP unaffected');
  clock = 2001; // fresh window for 1.1.1.1
  assert.equal(attempt('1.1.1.1', '/auth/register').passed, true, 'same IP, different path unaffected');
});

// ── 4. Listing engine contract (shared server + client) ───────────────────
check('Listings: flagship point → 7 hand-crafted seed hostels', () => {
  const { lat, lng } = FLAGSHIP_CITIES.Kota;
  const s = resolveOfflineListings(lng, lat);
  assert.equal(s.dataSource, 'seed');
  assert.equal(s.hostels.length, 7);
  assert.ok(s.rooms.length > 0 && s.amenities.length > 0 && s.signals.length > 0);
});

check('Listings: non-flagship point → 12 deterministic generated listings', () => {
  const a = resolveOfflineListings(73.8567, 18.5204); // Pune
  const b = resolveOfflineListings(73.8567, 18.5204);
  assert.equal(a.dataSource, 'demo-generated');
  assert.equal(a.hostels.length, 12);
  assert.deepEqual(a.hostels[0]._id, b.hostels[0]._id, 'same point must give identical listings');
  assert.ok(a.hostels.every(h => h.rooms.length > 0), 'every generated hostel carries rooms');
});

check('Listings: searched label personalizes generated addresses', () => {
  const s = resolveOfflineListings(78.4867, 17.385, 'Hyderabad');
  assert.equal(s.label, 'Hyderabad');
  assert.ok(s.hostels[0].address.includes('Hyderabad'));
});

check('Listings: nearby point resolves to flagship city (tolerance)', () => {
  const { lat, lng } = FLAGSHIP_CITIES.Kota;
  assert.equal(nearestFlagshipCity(lat + 0.01, lng - 0.01), 'Kota');
  assert.equal(nearestFlagshipCity(18.5204, 73.8567), null, 'Pune is not flagship');
});

const hostel = (id, gender, rent, name = 'PG') => ({
  _id: id, name, address: `1 ${name} Road`, pgGenderCategory: gender, cachedMinRent: rent,
  location: { type: 'Point', coordinates: [75.8458, 25.1388] },
  rooms: [{ hostelId: id, roomType: { h1: 'Single Sharing', h2: 'Double Sharing', h3: 'Triple Sharing' }[id] }],
});
const rooms = [{ hostelId: 'h1', roomType: 'Single' }, { hostelId: 'h2', roomType: 'Double' }];

const filterCases = [
  { name: 'no filters → all pass', params: {}, n: 3 },
  { name: 'gender "All" → all pass', params: { gender: 'All' }, n: 3 },
  { name: 'Female Only keeps female + co-ed', params: { gender: 'Female Only' }, n: 2 },
  { name: 'maxRent keeps ≤ limit (boundary equal)', params: { maxRent: 5000 }, n: 2 },
  { name: 'name filter matches name', params: { aiQuery: 'alpha' }, n: 1 },
  { name: 'name filter matches room type', params: { aiQuery: 'single' }, n: 1 },
  { name: 'name filter with no match → empty is valid', params: { aiQuery: 'zzz' }, n: 0 },
  { name: 'combined filters intersect', params: { gender: 'Male Only', maxRent: 4000 }, n: 1 },
];
const seedListings = [hostel('h1', 'Female Only', 6000, 'Alpha PG'), hostel('h2', 'Male Only', 5000, 'Beta PG'), hostel('h3', 'Co-ed / Unisex', 4000, 'Gamma PG')];
for (const c of filterCases) {
  check(`Filters: ${c.name}`, () => {
    assert.equal(applyListingFilters(seedListings, c.params).length, c.n);
  });
}

check('Rooms: matched by id; unmatched hostel gets non-empty fallback', () => {
  assert.deepEqual(roomsFor(rooms, 'h1'), [rooms[0]]);
  assert.deepEqual(roomsFor(rooms, 'h9'), rooms, 'fallback = all available rooms (up to 3) — never roomless');
});

check('Distance & decoration: every hostel gets distanceKm + rooms array', () => {
  const out = withDistanceAndRooms(seedListings, rooms, [75.8458, 25.1388]);
  assert.equal(out.length, 3);
  assert.ok(out.every(h => typeof h.distanceKm === 'number' && Array.isArray(h.rooms) && h.rooms.length > 0));
  assert.equal(out[0].distanceKm, 0, 'hostel at center has distance 0');
});

check('Distance: haversine matches known city pair within tolerance', () => {
  const km = haversineKm([75.8458, 25.1388], [77.2095, 28.6942]); // Kota → Delhi DU ≈ 418km
  assert.ok(Math.abs(km - 418) < 5, `expected ≈418km, got ${km}`);
});

console.log(failures === 0 ? '\n🎉 CONTRACT SATISFIED — all checks passed' : `\n💥 ${failures} contract check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
