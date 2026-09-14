/**
 * Structural Vulnerability Index (SVI 0-100) & Maintenance Decay Index (MDI 0-100)
 * from structural audit answers. Weights are integers, so scores are integers.
 */

export const SVI_GRADES = {
  A: 'Grade A (Sound)',
  B: 'Grade B (Moderate Risk)',
  CD: 'Grade C/D (Severe Hazard)',
};

// SVI >= 30 → Grade B; SVI > 60 → Grade C/D. Used by audits, listings and UI.
export function sviGradeFor(sviScore) {
  if (sviScore > 60) return SVI_GRADES.CD;
  if (sviScore >= 30) return SVI_GRADES.B;
  return SVI_GRADES.A;
}

const DECADE_WEIGHT = { '<1990': 30, '1990-2005': 20, '2006-2018': 10, '>2018': 0 };
const BASEMENT_WEIGHT = { 'Student Rooms/Library': 25, 'Storage/Parking': 10 };
const MDI_WEIGHTS = [
  ['waterSeepageCeilingWalls', 25],
  ['dampnessMoldInRooms', 25],
  ['unrepairedPlumbingIssues', 20],
  ['openWiringHazard', 15],
  ['neglectedSewageHygiene', 15],
];

const clamp100 = (n) => Math.min(100, Math.max(0, n));

export function calculateAuditScores(a) {
  const svi = clamp100(
    (DECADE_WEIGHT[a.constructionDecade] ?? 10) + // unknown decade → mid penalty
    Math.max(0, Number(a.floorsBuilt || 1) - Number(a.floorsPermitted || 1)) * 25 +
    (BASEMENT_WEIGHT[a.basementUsage] ?? 0) +
    (a.openWiringHazard ? 15 : 0) +
    (a.structuralCracks ? 20 : 0) +
    (a.fireExtinguishersExpiredOrMissing ? 20 : 0) +
    (Number(a.emergencyExitsCount || 1) < 2 ? 10 : 0)
  );

  const mdi = clamp100(MDI_WEIGHTS.reduce((sum, [flag, weight]) => sum + (a[flag] ? weight : 0), 0));

  return {
    sviScore: svi,
    sviGrade: sviGradeFor(svi),
    maintenanceDecayScore: mdi,
    isCriticallyNeglected: mdi > 50,
    depositRiskRating:
      a.depositReturnedStatus === 'Refused Refund' ? 'High Non-Refund Risk'
      : a.depositReturnedStatus === 'Unfair Deductions' ? 'Unfair Deductions Reported'
      : 'Safe / Fully Refunded',
  };
}
