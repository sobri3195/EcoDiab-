export type FollowUpType = 'Monthly In-person' | 'Telemedicine' | 'Remote Monitoring';

export function recommendFollowUp(
  tier: 'Low' | 'Moderate' | 'High' | 'Critical',
  adherence: number,
  trend: 'improving' | 'stable' | 'worsening'
): FollowUpType {
  if (tier === 'Critical' || trend === 'worsening') return 'Monthly In-person';
  if (tier === 'High' && adherence < 65) return 'Monthly In-person';
  if (tier === 'Low' && adherence >= 80) return 'Remote Monitoring';
  return 'Telemedicine';
}

export function estimateSavings(distanceKm: number, mode: FollowUpType) {
  const avoidedVisits = mode === 'Monthly In-person' ? 0 : mode === 'Telemedicine' ? 2 : 3;
  const paperSaved = avoidedVisits * 6;
  const emissionFactorKgPerKm = 0.21;
  const carbonSaved = Number((distanceKm * avoidedVisits * emissionFactorKgPerKm).toFixed(1));

  return { avoidedVisits, paperSaved, carbonSaved };
}

export function queueReductionProxy(avoidedVisits: number) {
  return Math.min(40, avoidedVisits * 3);
}
