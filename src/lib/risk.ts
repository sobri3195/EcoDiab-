import type { RiskTier } from './mock';

export type RiskInput = {
  hba1c: number;
  bmi: number;
  systolicBP: number;
  ldl: number;
  priorComplications: string[];
  adherence: number;
  visitFrequency: number;
};

export type RiskResult = {
  score: number;
  tier: RiskTier;
  complicationProbability: number;
  hospitalizationRisk: number;
  recommendations: string[];
};

export function calculateRisk(input: RiskInput): RiskResult {
  // Deterministic demo formula. Replaceable by RF/XGBoost/NN in production.
  let score = 0;
  score += Math.min(35, Math.max(0, (input.hba1c - 5.5) * 6));
  score += Math.min(15, Math.max(0, (input.bmi - 22) * 1.2));
  score += Math.min(15, Math.max(0, (input.systolicBP - 120) * 0.35));
  score += Math.min(10, Math.max(0, (input.ldl - 90) * 0.12));
  score += Math.min(12, input.priorComplications.length * 4);
  score += Math.min(8, Math.max(0, (75 - input.adherence) * 0.25));
  score += Math.min(5, Math.max(0, (3 - input.visitFrequency) * 2));

  const boundedScore = Math.round(Math.min(100, Math.max(0, score)));

  let tier: RiskTier = 'Low';
  if (boundedScore >= 80) tier = 'Critical';
  else if (boundedScore >= 60) tier = 'High';
  else if (boundedScore >= 35) tier = 'Moderate';

  const complicationProbability = Math.min(95, Math.round(15 + boundedScore * 0.7));
  const hospitalizationRisk = Math.min(85, Math.round(8 + boundedScore * 0.55));

  const recommendations: string[] = [
    'Optimize glycemic control with personalized medication review.',
    'Promote paperless follow-up log and telemedicine where feasible.',
  ];

  if (input.adherence < 70) recommendations.push('Schedule adherence coaching and reminder interventions.');
  if (input.systolicBP > 140) recommendations.push('Intensify blood pressure monitoring and antihypertensive plan.');
  if (input.priorComplications.length > 0) recommendations.push('Prioritize specialist screening for existing complications.');

  return {
    score: boundedScore,
    tier,
    complicationProbability,
    hospitalizationRisk,
    recommendations,
  };
}
