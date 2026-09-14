export const SEED_HOSTELS = [
  // --- KOTA COACHING HUB ---
  {
    _id: "hostel_kota_1",
    name: "Starlight Scholars Residency (Female Only)",
    aliasNames: ["Starlight Girls PG", "Starlight Kota"],
    address: "Plot 42, Rajiv Gandhi Nagar, Kota, Rajasthan",
    location: { type: "Point", coordinates: [75.8458, 25.1388] },
    pgGenderCategory: "Female Only",
    owner: {
      id: "user_owner_1",
      name: "Rajesh Kumar Sharma",
      phone: "+919829012345",
      whatsapp: "919829012345",
      aiVerificationStatus: "AI_Verified"
    },
    sviScore: 12.5,
    sviGrade: "Grade A (Sound)",
    maintenanceDecayScore: 10.0,
    isCriticallyNeglected: false,
    depositRiskRating: "Safe / Fully Refunded",
    monsoonFloodProne: false,
    electricityRatePerUnit: 8.5,
    coverImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    cachedMinRent: 6500
  },
  {
    _id: "hostel_kota_2",
    name: "Vigyan Nagar Boys Luxury PG",
    aliasNames: ["Vigyan Boys PG"],
    address: "B-12, Vigyan Nagar Main Road, Kota, Rajasthan",
    location: { type: "Point", coordinates: [75.8492, 25.1352] },
    pgGenderCategory: "Male Only",
    owner: {
      id: "user_owner_2",
      name: "Mahendra Singh",
      phone: "+919414123456",
      whatsapp: "919414123456",
      aiVerificationStatus: "Pending_AI_Audit"
    },
    sviScore: 35.0,
    sviGrade: "Grade B (Moderate Risk)",
    maintenanceDecayScore: 45.0,
    isCriticallyNeglected: false,
    depositRiskRating: "Unfair Deductions Reported",
    monsoonFloodProne: true,
    electricityRatePerUnit: 10.0,
    coverImage: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
    cachedMinRent: 5200
  },
  {
    _id: "hostel_kota_3",
    name: "Coral Park Heritage Student Rooms",
    aliasNames: ["Coral Park PG"],
    address: "Street 8, Coral Park, Kota, Rajasthan",
    location: { type: "Point", coordinates: [75.8420, 25.1410] },
    pgGenderCategory: "Co-ed / Unisex",
    owner: {
      id: "user_owner_3",
      name: "Sanjay Gupta",
      phone: "+919828887766",
      whatsapp: "919828887766",
      aiVerificationStatus: "Rejected"
    },
    sviScore: 72.0,
    sviGrade: "Grade C/D (Severe Hazard)",
    maintenanceDecayScore: 80.0,
    isCriticallyNeglected: true,
    depositRiskRating: "High Non-Refund Risk",
    monsoonFloodProne: true,
    electricityRatePerUnit: 12.0,
    coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    cachedMinRent: 4500
  },

  // --- DELHI UNIVERSITY NORTH CAMPUS ---
  {
    _id: "hostel_delhi_1",
    name: "Kamla Nagar Safe Haven Girls PG",
    aliasNames: ["Kamla Nagar Girls Hostel"],
    address: "Block F, Kamla Nagar, Delhi",
    location: { type: "Point", coordinates: [77.2095, 28.6942] },
    pgGenderCategory: "Female Only",
    owner: {
      id: "user_owner_4",
      name: "Sunita Mittal",
      phone: "+919811223344",
      whatsapp: "919811223344",
      aiVerificationStatus: "AI_Verified"
    },
    sviScore: 18.0,
    sviGrade: "Grade A (Sound)",
    maintenanceDecayScore: 15.0,
    isCriticallyNeglected: false,
    depositRiskRating: "Safe / Fully Refunded",
    monsoonFloodProne: false,
    electricityRatePerUnit: 9.0,
    coverImage: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    cachedMinRent: 8500
  },
  {
    _id: "hostel_delhi_2",
    name: "Hudson Lane Student Hub",
    aliasNames: ["Hudson Lane PG"],
    address: "Lane 3, Hudson Lane, Kingsway Camp, Delhi",
    location: { type: "Point", coordinates: [77.2040, 28.6980] },
    pgGenderCategory: "Co-ed / Unisex",
    owner: {
      id: "user_owner_5",
      name: "Rohan Verma",
      phone: "+919871009988",
      whatsapp: "919871009988",
      aiVerificationStatus: "AI_Verified"
    },
    sviScore: 28.0,
    sviGrade: "Grade A (Sound)",
    maintenanceDecayScore: 20.0,
    isCriticallyNeglected: false,
    depositRiskRating: "Safe / Fully Refunded",
    monsoonFloodProne: false,
    electricityRatePerUnit: 9.5,
    coverImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    cachedMinRent: 7800
  },
  {
    _id: "hostel_delhi_3",
    name: "Kalu Sarai FIITJEE Scholars PG",
    aliasNames: ["Kalu Sarai Boys Hostel"],
    address: "Main Market, Kalu Sarai, Near Hauz Khas Metro, New Delhi",
    location: { type: "Point", coordinates: [77.1926, 28.5447] },
    pgGenderCategory: "Male Only",
    owner: {
      id: "user_owner_6",
      name: "Vikram Saxena",
      phone: "+919810998877",
      whatsapp: "919810998877",
      aiVerificationStatus: "Pending_AI_Audit"
    },
    sviScore: 68.5,
    sviGrade: "Grade C/D (Severe Hazard)",
    maintenanceDecayScore: 65.0,
    isCriticallyNeglected: true,
    depositRiskRating: "Unfair Deductions Reported",
    monsoonFloodProne: true,
    electricityRatePerUnit: 11.0,
    coverImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    cachedMinRent: 6000
  },

  // --- BENGALURU KORAMANGALA HUB ---
  {
    _id: "hostel_blr_1",
    name: "Koramangala 5th Block Co-Living & PG",
    aliasNames: ["Koramangala Smart Stay"],
    address: "12th Main Road, 5th Block Koramangala, Bengaluru",
    location: { type: "Point", coordinates: [77.6245, 12.9352] },
    pgGenderCategory: "Co-ed / Unisex",
    owner: {
      id: "user_owner_7",
      name: "Anand Reddy",
      phone: "+919900112233",
      whatsapp: "919900112233",
      aiVerificationStatus: "AI_Verified"
    },
    sviScore: 15.0,
    sviGrade: "Grade A (Sound)",
    maintenanceDecayScore: 12.0,
    isCriticallyNeglected: false,
    depositRiskRating: "Safe / Fully Refunded",
    monsoonFloodProne: false,
    electricityRatePerUnit: 7.5,
    coverImage: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80",
    cachedMinRent: 9500
  }
];

export const SEED_ROOMS = [
  // Starlight Scholars
  { hostelId: "hostel_kota_1", roomType: "Single Sharing AC", monthlyRent: 11000, securityDeposit: 11000, mealsIncluded: true, acAvailable: true, attachedWashroom: true, isAvailable: true },
  { hostelId: "hostel_kota_1", roomType: "Double Sharing AC", monthlyRent: 7500, securityDeposit: 7500, mealsIncluded: true, acAvailable: true, attachedWashroom: true, isAvailable: true },
  { hostelId: "hostel_kota_1", roomType: "Triple Sharing Non-AC", monthlyRent: 6500, securityDeposit: 5000, mealsIncluded: true, acAvailable: false, attachedWashroom: false, isAvailable: true },

  // Vigyan Nagar Boys
  { hostelId: "hostel_kota_2", roomType: "Single Sharing Non-AC", monthlyRent: 7500, securityDeposit: 10000, mealsIncluded: true, acAvailable: false, attachedWashroom: true, isAvailable: true },
  { hostelId: "hostel_kota_2", roomType: "Double Sharing Non-AC", monthlyRent: 5200, securityDeposit: 6000, mealsIncluded: false, acAvailable: false, attachedWashroom: true, isAvailable: true },

  // Coral Park Heritage (Hazard PG)
  { hostelId: "hostel_kota_3", roomType: "Double Sharing Basement Room", monthlyRent: 4500, securityDeposit: 9000, mealsIncluded: false, acAvailable: false, attachedWashroom: false, isAvailable: true },
  { hostelId: "hostel_kota_3", roomType: "Triple Sharing Compact", monthlyRent: 3800, securityDeposit: 8000, mealsIncluded: false, acAvailable: false, attachedWashroom: false, isAvailable: true },

  // Kamla Nagar Girls
  { hostelId: "hostel_delhi_1", roomType: "Single Sharing Deluxe", monthlyRent: 13500, securityDeposit: 13500, mealsIncluded: true, acAvailable: true, attachedWashroom: true, isAvailable: true },
  { hostelId: "hostel_delhi_1", roomType: "Double Sharing Executive", monthlyRent: 8500, securityDeposit: 8500, mealsIncluded: true, acAvailable: true, attachedWashroom: true, isAvailable: true },

  // Hudson Lane
  { hostelId: "hostel_delhi_2", roomType: "Double Sharing AC", monthlyRent: 7800, securityDeposit: 7800, mealsIncluded: true, acAvailable: true, attachedWashroom: true, isAvailable: true },

  // Kalu Sarai
  { hostelId: "hostel_delhi_3", roomType: "Double Sharing Non-AC", monthlyRent: 6000, securityDeposit: 12000, mealsIncluded: true, acAvailable: false, attachedWashroom: false, isAvailable: true },

  // Koramangala
  { hostelId: "hostel_blr_1", roomType: "Single Studio Room", monthlyRent: 16000, securityDeposit: 16000, mealsIncluded: true, acAvailable: true, attachedWashroom: true, isAvailable: true },
  { hostelId: "hostel_blr_1", roomType: "Double Sharing Modern", monthlyRent: 9500, securityDeposit: 9500, mealsIncluded: true, acAvailable: true, attachedWashroom: true, isAvailable: true }
];

export const SEED_AMENITIES = [
  // Kota
  { _id: "amenity_1", name: "FitZone Gold Gym", category: "Gym", location: { type: "Point", coordinates: [75.8465, 25.1392] }, address: "Rajiv Gandhi Nagar, Kota", averageMonthlyCost: 1200 },
  { _id: "amenity_2", name: "Annapurna Shuddh Tiffin & Mess", category: "Mess / Tiffin", location: { type: "Point", coordinates: [75.8450, 25.1380] }, address: "Plot 15, Rajiv Gandhi Nagar, Kota", averageMonthlyCost: 3200 },
  { _id: "amenity_3", name: "24/7 Silent Study Zone Library", category: "Library", location: { type: "Point", coordinates: [75.8472, 25.1401] }, address: "Near Allen Supath, Kota", averageMonthlyCost: 1500 },
  { _id: "amenity_4", name: "Apollo Pharmacy & Meds", category: "Pharmacy / Medical", location: { type: "Point", coordinates: [75.8445, 25.1375] }, address: "Vigyan Nagar Crossing, Kota", averageMonthlyCost: 0 },
  { _id: "amenity_5", name: "Reliance Smart Point Grocery", category: "Grocery / Daily Shop", location: { type: "Point", coordinates: [75.8480, 25.1360] }, address: "Vigyan Nagar Main, Kota", averageMonthlyCost: 0 },

  // Delhi
  { _id: "amenity_6", name: "Kamla Nagar Fitness Club", category: "Gym", location: { type: "Point", coordinates: [77.2090, 28.6945] }, address: "Spark Mall, Kamla Nagar, Delhi", averageMonthlyCost: 1800 },
  { _id: "amenity_7", name: "DU Student Food Point & Mess", category: "Mess / Tiffin", location: { type: "Point", coordinates: [77.2098, 28.6938] }, address: "Kamla Nagar, Delhi", averageMonthlyCost: 3500 },
  { _id: "amenity_8", name: "Hauz Khas Reader's Den Library", category: "Library", location: { type: "Point", coordinates: [77.1930, 28.5452] }, address: "Kalu Sarai Market, Delhi", averageMonthlyCost: 1600 }
];

export const SEED_AREA_SIGNALS = [
  // Kota Rajiv Gandhi Nagar
  {
    localityName: "Rajiv Gandhi Nagar (Coaching Hub)",
    location: { type: "Point", coordinates: [75.8458, 25.1388] },
    streetLightingRating: "Well-Lit Main Road",
    nightSafetyScore: 4.8,
    monsoonWaterloggingRisk: false,
    nearestPoliceBeatKm: 0.3,
    nearestHospitalKm: 0.8
  },
  // Kota Coral Park
  {
    localityName: "Coral Park Lowlands",
    location: { type: "Point", coordinates: [75.8420, 25.1410] },
    streetLightingRating: "Dark Narrow Alley",
    nightSafetyScore: 2.1,
    monsoonWaterloggingRisk: true,
    nearestPoliceBeatKm: 1.8,
    nearestHospitalKm: 2.5
  },
  // Delhi Kamla Nagar
  {
    localityName: "Kamla Nagar North Campus",
    location: { type: "Point", coordinates: [77.2095, 28.6942] },
    streetLightingRating: "Well-Lit Main Road",
    nightSafetyScore: 4.6,
    monsoonWaterloggingRisk: false,
    nearestPoliceBeatKm: 0.2,
    nearestHospitalKm: 0.6
  },
  // Delhi Kalu Sarai
  {
    localityName: "Kalu Sarai FIITJEE Lane",
    location: { type: "Point", coordinates: [77.1926, 28.5447] },
    streetLightingRating: "Dimly Lit",
    nightSafetyScore: 3.0,
    monsoonWaterloggingRisk: true,
    nearestPoliceBeatKm: 0.9,
    nearestHospitalKm: 1.2
  }
];

export const SEED_STRUCTURAL_AUDITS = [
  {
    _id: "audit_1",
    hostelId: "hostel_kota_1",
    userId: "user_student_1",
    constructionDecade: ">2018",
    structureType: "RCC Framed",
    floorsBuilt: 4,
    floorsPermitted: 4,
    basementUsage: "None",
    emergencyExitsCount: 2,
    openWiringHazard: false,
    structuralCracks: false,
    waterSeepageCeilingWalls: false,
    dampnessMoldInRooms: false,
    unrepairedPlumbingIssues: false,
    neglectedSewageHygiene: false,
    fireExtinguishersExpiredOrMissing: false,
    depositReturnedStatus: "Returned Full",
    overallRating: 5,
    pros: "Exceptional safety, dual fire exits, 24/7 security guard, clean tiffin food.",
    cons: "Strict entry curfew at 10:00 PM.",
    renterAdvice: "Best PG for female NEET aspirants in Rajiv Gandhi Nagar.",
    evidencePhotos: [
      { url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80", tag: "Highlight / Positive" },
      { url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80", tag: "Highlight / Positive" }
    ],
    isVerifiedResident: true
  },
  {
    _id: "audit_2",
    hostelId: "hostel_kota_3",
    userId: "user_student_2",
    constructionDecade: "<1990",
    structureType: "Brick Masonry",
    floorsBuilt: 6,
    floorsPermitted: 3,
    basementUsage: "Student Rooms/Library",
    emergencyExitsCount: 1,
    openWiringHazard: true,
    structuralCracks: true,
    waterSeepageCeilingWalls: true,
    dampnessMoldInRooms: true,
    unrepairedPlumbingIssues: true,
    neglectedSewageHygiene: true,
    fireExtinguishersExpiredOrMissing: true,
    depositReturnedStatus: "Refused Refund",
    overallRating: 1,
    pros: "Cheap rent.",
    cons: "Severe ceiling water leakage, illegal 6th floor addition, basement floods during monsoon. Owner refused to return ₹9,000 security deposit!",
    renterAdvice: "AVOID AT ALL COSTS! Structural hazard and deposit scam.",
    evidencePhotos: [
      { url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80", tag: "Structural Defect / Warning" },
      { url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80", tag: "Neglected Maintenance / Decay" }
    ],
    isVerifiedResident: true
  }
];
