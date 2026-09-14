// ── Deterministic demo listings generator ────────────────────────────────
// Produces realistic PG/hostel listings, amenities and safety signals around
// any [lng, lat] point in India, so the map is never empty anywhere a student
// searches. Same input coordinates always produce the same listings.
import { SEED_ROOMS } from '../seedData.js';

// Mulberry32 seeded PRNG
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const NAME_A = ['Shree', 'Sai', 'Balaji', 'Lakshmi', 'Ganesh', 'Krishna', 'Sunrise', 'Green', 'Silver', 'Golden', 'Royal', 'Elite', 'Metro', 'Urban', 'Comfort', 'Elite', 'Aashiyana', 'Sukoon', 'Apna', 'Safar'];
const NAME_B = ['Niwas', 'Residency', 'Boys PG', 'Girls PG', 'Hostel', 'Stay', 'Homes', 'Lodge', 'Comforts', 'Student Nest', 'Living', 'Rooms', 'PG & Mess', 'Academy PG'];
const STREET_A = ['MG Road', 'Station Road', 'Main Market', 'Ring Road', 'Bus Depot Road', 'Temple Street', 'College Road', 'Bazaar Marg', 'Lake View Road', 'Hill Street'];
const LOCAL_A = ['New', 'Old', 'Shanti', 'Gandhi', 'Nehru', 'Patel', 'Shivaji', 'Vivek', 'Ram', 'Krishna'];
const LOCAL_B = ['Nagar', 'Colony', 'Peth', 'Wadi', 'Layout', 'Extension', 'Palli', 'Mohalla', 'Ward', 'Enclave'];
const AMENITY_A = ['Fitzone', 'Powerhouse', 'Muscle', 'Iron', 'Pulse'];
const AMENITY_B = ['Gym', 'Fitness Center', 'Strength Studio'];
const MESS_A = ['Annapurna', 'Ghar Ka Khana', 'Tiffin Express', 'Rasoi', 'Home Style'];
const SHOP_A = ['Sri Krishna', 'Daily Needs', 'Fresh Mart', 'Balaji', 'Sai Ram'];
const CAFE_A = ['Chai Point', 'Bookworm', 'Study Hall', 'Silent Zone', 'Reading Room'];
const MED_A = ['City', 'Lifeline', 'Care', 'Apollo', 'Wellness'];
const MED_B = ['Pharmacy', 'Medical Store', 'Clinic', 'Nursing Home'];
const COVERS = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80'
];
const DEPOSIT_RISKS = ['Safe / Fully Refunded', 'Unfair Deductions Reported', 'High Non-Refund Risk'];

// Move ~dLat/dLng km away from origin (1 deg lat ≈ 111km; lng scaled by cos(lat))
function offsetPoint(originLat, originLng, dLatKm, dLngKm) {
  return [
    +(originLng + dLngKm / (111 * Math.cos((originLat * Math.PI) / 180) || 1)).toFixed(6),
    +(originLat + dLatKm / 111).toFixed(6)
  ];
}

// Generates { hostels, amenities, signals } around [lng, lat]
export function generateListingsForLocation(lng, lat, label = 'India', count = 12) {
  const seed = hashCode(`${lng.toFixed(3)},${lat.toFixed(3)},${label}`);
  const rand = mulberry32(seed);
  const cityShort = (label || 'India').split(',')[0].trim();

  const hostels = [];
  const amenities = [];
  const signals = [];

  for (let i = 0; i < count; i++) {
    const dLatKm = (rand() - 0.5) * 4.4;         // within ~2.2 km
    const dLngKm = (rand() - 0.5) * 4.4;
    const [hLng, hLat] = offsetPoint(lat, lng, dLatKm, dLngKm);

    const genderRoll = rand();
    const gender = genderRoll < 0.4 ? 'Female Only' : genderRoll < 0.8 ? 'Male Only' : 'Co-ed / Unisex';
    const nameA = NAME_A[Math.floor(rand() * NAME_A.length)];
    const nameB = NAME_B[Math.floor(rand() * NAME_B.length)];
    const locality = `${LOCAL_A[Math.floor(rand() * LOCAL_A.length)]} ${LOCAL_B[Math.floor(rand() * LOCAL_B.length)]}`;
    const street = STREET_A[Math.floor(rand() * STREET_A.length)];
    const sviScore = Math.round(rand() * 100);
    const sviGrade = sviScore > 60 ? 'Grade C/D (Severe Hazard)' : sviScore >= 30 ? 'Grade B (Moderate Risk)' : 'Grade A (Sound)';
    const maintenanceDecayScore = Math.round(Math.max(0, sviScore - 10 + rand() * 20));
    const rent = Math.round((2500 + rand() * 9500) / 100) * 100;

    hostels.push({
      _id: `demo_${seed}_${i}`,
      name: `${nameA} ${nameB}`,
      aliasNames: [`${nameA} ${cityShort}`],
      address: `${Math.floor(rand() * 90) + 1}-${Math.floor(rand() * 9)}, ${street}, ${locality}, ${cityShort}`,
      location: { type: 'Point', coordinates: [hLng, hLat] },
      pgGenderCategory: gender,
      owner: {
        id: `owner_${seed}_${i}`,
        name: `${nameA} Properties`,
        phone: `+919${Math.floor(100000000 + rand() * 899999999)}`,
        whatsapp: `919${Math.floor(100000000 + rand() * 899999999)}`,
        aiVerificationStatus: rand() < 0.55 ? 'AI_Verified' : rand() < 0.5 ? 'Pending_AI_Audit' : 'Unverified'
      },
      sviScore,
      sviGrade,
      maintenanceDecayScore,
      isCriticallyNeglected: sviScore > 70,
      depositRiskRating: DEPOSIT_RISKS[Math.floor(rand() * DEPOSIT_RISKS.length)],
      monsoonFloodProne: rand() < 0.25,
      electricityRatePerUnit: Math.round(6 + rand() * 8),
      coverImage: COVERS[Math.floor(rand() * COVERS.length)],
      cachedMinRent: rent,
      rooms: SEED_ROOMS.slice(0, 3),
      isDemoListing: true
    });
  }

  // Amenities: 2 gyms, 2 mess, 2 shops, 2 cafes/libraries, 2 medical
  const amenityPlan = [
    { cat: 'Gym', sym: '🏋️', pool: AMENITY_A, pool2: AMENITY_B },
    { cat: 'Gym', sym: '🏋️', pool: AMENITY_A, pool2: AMENITY_B },
    { cat: 'Mess / Tiffin', sym: '🍲', pool: MESS_A, pool2: ['Tiffin Center', 'Mess & Tiffin'] },
    { cat: 'Mess / Tiffin', sym: '🍲', pool: MESS_A, pool2: ['Tiffin Center', 'Mess & Tiffin'] },
    { cat: 'Grocery / Daily Shop', sym: '🏪', pool: SHOP_A, pool2: ['General Store', 'Supermarket'] },
    { cat: 'Grocery / Daily Shop', sym: '🏪', pool: SHOP_A, pool2: ['General Store', 'Supermarket'] },
    { cat: 'Library', sym: '📚', pool: CAFE_A, pool2: ['Library', 'Study Cafe'] },
    { cat: 'Library', sym: '📚', pool: CAFE_A, pool2: ['Library', 'Study Cafe'] },
    { cat: 'Pharmacy / Medical', sym: '💊', pool: MED_A, pool2: MED_B },
    { cat: 'Pharmacy / Medical', sym: '💊', pool: MED_A, pool2: MED_B }
  ];
  amenityPlan.forEach((plan, i) => {
    const [aLng, aLat] = offsetPoint(lat, lng, (rand() - 0.5) * 3.4, (rand() - 0.5) * 3.4);
    amenities.push({
      _id: `demo_amenity_${seed}_${i}`,
      name: `${plan.pool[Math.floor(rand() * plan.pool.length)]} ${plan.pool2[Math.floor(rand() * plan.pool2.length)]}`,
      category: plan.cat,
      address: `${cityShort}`,
      location: { type: 'Point', coordinates: [aLng, aLat] },
      isDemoListing: true
    });
  });

  // Safety signals: mix of well-lit, dark alleys, flood-prone
  for (let i = 0; i < 4; i++) {
    const [sLng, sLat] = offsetPoint(lat, lng, (rand() - 0.5) * 3.0, (rand() - 0.5) * 3.0);
    const roll = rand();
    signals.push({
      _id: `demo_signal_${seed}_${i}`,
      location: { type: 'Point', coordinates: [sLng, sLat] },
      monsoonWaterloggingRisk: roll < 0.3,
      streetLightingRating: roll < 0.3 ? 'Bright Main Road' : roll < 0.6 ? 'Dark Narrow Alley' : 'Well Lit',
      isDemoListing: true
    });
  }

  return { hostels, amenities, signals };
}
