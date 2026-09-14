/**
 * Calculates Structural Vulnerability Index (SVI 0-100) and Maintenance Decay Index (MDI 0-100)
 * based on structural audit factors.
 */

export function calculateAuditScores(auditData) {
  let svi = 0;
  let mdi = 0;

  // 1. Construction Decade Factor
  switch (auditData.constructionDecade) {
    case '<1990':
      svi += 30;
      break;
    case '1990-2005':
      svi += 20;
      break;
    case '2006-2018':
      svi += 10;
      break;
    case '>2018':
      svi += 0;
      break;
    default:
      svi += 10;
  }

  // 2. Unapproved Floor Additions
  const floorsBuilt = Number(auditData.floorsBuilt || 1);
  const floorsPermitted = Number(auditData.floorsPermitted || 1);
  const extraFloors = Math.max(0, floorsBuilt - floorsPermitted);
  svi += extraFloors * 25;

  // 3. Basement Hazard Occupancy
  if (auditData.basementUsage === 'Student Rooms/Library') {
    svi += 25;
  } else if (auditData.basementUsage === 'Storage/Parking') {
    svi += 10;
  }

  // 4. Fire & Structural Hazards
  if (auditData.openWiringHazard) svi += 15;
  if (auditData.structuralCracks) svi += 20;
  if (auditData.fireExtinguishersExpiredOrMissing) svi += 20;
  if (Number(auditData.emergencyExitsCount || 1) < 2) svi += 10;

  // Clamp SVI (0-100)
  const sviScore = Math.min(100, Math.max(0, svi));

  // Determine SVI Grade
  let sviGrade = 'Grade A (Sound)';
  if (sviScore > 60) {
    sviGrade = 'Grade C/D (Severe Hazard)';
  } else if (sviScore >= 30) {
    sviGrade = 'Grade B (Moderate Risk)';
  }

  // --- Maintenance Decay Index (MDI) ---
  if (auditData.waterSeepageCeilingWalls) mdi += 25;
  if (auditData.dampnessMoldInRooms) mdi += 25;
  if (auditData.unrepairedPlumbingIssues) mdi += 20;
  if (auditData.openWiringHazard) mdi += 15;
  if (auditData.neglectedSewageHygiene) mdi += 15;

  // Clamp MDI (0-100)
  const maintenanceDecayScore = Math.min(100, Math.max(0, mdi));
  const isCriticallyNeglected = maintenanceDecayScore > 50;

  // Deposit Risk Rating
  let depositRiskRating = 'Safe / Fully Refunded';
  if (auditData.depositReturnedStatus === 'Refused Refund') {
    depositRiskRating = 'High Non-Refund Risk';
  } else if (auditData.depositReturnedStatus === 'Unfair Deductions') {
    depositRiskRating = 'Unfair Deductions Reported';
  }

  return {
    sviScore: Math.round(sviScore * 10) / 10,
    sviGrade,
    maintenanceDecayScore: Math.round(maintenanceDecayScore * 10) / 10,
    isCriticallyNeglected,
    depositRiskRating
  };
}

/**
 * Aggregates multiple audits for a hostel to calculate composite SVI, MDI, and deposit risk
 */
export function aggregateHostelAudits(audits) {
  if (!audits || audits.length === 0) {
    return {
      sviScore: 10.0,
      sviGrade: 'Grade A (Sound)',
      maintenanceDecayScore: 0.0,
      isCriticallyNeglected: false,
      depositRiskRating: 'Safe / Fully Refunded'
    };
  }

  let totalSVI = 0;
  let totalMDI = 0;
  const depositStats = {
    refused: 0,
    deductions: 0,
    returned: 0
  };

  audits.forEach(audit => {
    const scores = calculateAuditScores(audit);
    totalSVI += scores.sviScore;
    totalMDI += scores.maintenanceDecayScore;

    if (audit.depositReturnedStatus === 'Refused Refund') depositStats.refused++;
    else if (audit.depositReturnedStatus === 'Unfair Deductions') depositStats.deductions++;
    else depositStats.returned++;
  });

  const avgSVI = Math.round((totalSVI / audits.length) * 10) / 10;
  const avgMDI = Math.round((totalMDI / audits.length) * 10) / 10;

  let sviGrade = 'Grade A (Sound)';
  if (avgSVI > 60) sviGrade = 'Grade C/D (Severe Hazard)';
  else if (avgSVI >= 30) sviGrade = 'Grade B (Moderate Risk)';

  let depositRiskRating = 'Safe / Fully Refunded';
  if (depositStats.refused > 0) {
    depositRiskRating = 'High Non-Refund Risk';
  } else if (depositStats.deductions > 0) {
    depositRiskRating = 'Unfair Deductions Reported';
  }

  return {
    sviScore: avgSVI,
    sviGrade,
    maintenanceDecayScore: avgMDI,
    isCriticallyNeglected: avgMDI > 50,
    depositRiskRating
  };
}
