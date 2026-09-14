import { calculateAuditScores, aggregateHostelAudits } from '../utils/sviCalculator.js';

console.log('--- Running SVI & MDI Calculator Unit Tests ---');

// Test 1: Sound Building (New, no hazards)
const soundBuilding = {
  constructionDecade: '>2018',
  floorsBuilt: 4,
  floorsPermitted: 4,
  basementUsage: 'None',
  emergencyExitsCount: 2,
  openWiringHazard: false,
  structuralCracks: false,
  waterSeepageCeilingWalls: false,
  dampnessMoldInRooms: false,
  unrepairedPlumbingIssues: false,
  neglectedSewageHygiene: false,
  fireExtinguishersExpiredOrMissing: false,
  depositReturnedStatus: 'Returned Full'
};

const result1 = calculateAuditScores(soundBuilding);
console.log('Test 1 (Sound Building):', result1);
if (result1.sviScore !== 0 || result1.sviGrade !== 'Grade A (Sound)' || result1.maintenanceDecayScore !== 0) {
  console.error('❌ Test 1 FAILED');
  process.exit(1);
} else {
  console.log('✅ Test 1 PASSED');
}

// Test 2: Severe Hazard Building (Old, extra floors, basement student room, wiring, cracks, seepage, mold)
const hazardBuilding = {
  constructionDecade: '<1990', // +30
  floorsBuilt: 6,
  floorsPermitted: 4, // 2 extra floors = +50
  basementUsage: 'Student Rooms/Library', // +25
  emergencyExitsCount: 1, // +10
  openWiringHazard: true, // +15
  structuralCracks: true, // +20
  waterSeepageCeilingWalls: true, // +25 MDI
  dampnessMoldInRooms: true, // +25 MDI
  unrepairedPlumbingIssues: true, // +20 MDI
  neglectedSewageHygiene: false,
  fireExtinguishersExpiredOrMissing: true, // +20
  depositReturnedStatus: 'Refused Refund'
};

const result2 = calculateAuditScores(hazardBuilding);
console.log('Test 2 (Hazard Building):', result2);
if (result2.sviScore !== 100 || result2.sviGrade !== 'Grade C/D (Severe Hazard)' || result2.maintenanceDecayScore !== 85 || !result2.isCriticallyNeglected) {
  console.error('❌ Test 2 FAILED');
  process.exit(1);
} else {
  console.log('✅ Test 2 PASSED');
}

// Test 3: Aggregation test
const aggResult = aggregateHostelAudits([soundBuilding, hazardBuilding]);
console.log('Test 3 (Composite Aggregation):', aggResult);
if (aggResult.sviScore !== 50 || aggResult.sviGrade !== 'Grade B (Moderate Risk)' || aggResult.depositRiskRating !== 'High Non-Refund Risk') {
  console.error('❌ Test 3 FAILED');
  process.exit(1);
} else {
  console.log('✅ Test 3 PASSED');
}

console.log('🎉 ALL SVI/MDI CALCULATOR TESTS PASSED SUCCESSFULLY!');
