import { useMemo, useState } from 'react';
import Card from '../components/Card';
import { estimateSavings, recommendFollowUp } from '../lib/green';
import type { RiskTier } from '../lib/mock';

export default function FollowUpPage() {
  const [riskTier, setRiskTier] = useState<RiskTier>('Moderate');
  const [adherence, setAdherence] = useState(75);
  const [lastVisitDate, setLastVisitDate] = useState('2025-01-21');
  const [trend, setTrend] = useState<'improving' | 'stable' | 'worsening'>('stable');
  const [distance, setDistance] = useState(12);

  const recommendation = useMemo(() => recommendFollowUp(riskTier, adherence, trend), [riskTier, adherence, trend]);
  const savings = useMemo(() => estimateSavings(distance, recommendation), [distance, recommendation]);
  const nextVisitDate = useMemo(() => {
    const d = new Date(lastVisitDate);
    d.setDate(d.getDate() + (recommendation === 'Monthly In-person' ? 30 : recommendation === 'Telemedicine' ? 45 : 60));
    return d.toISOString().slice(0, 10);
  }, [lastVisitDate, recommendation]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Smart Follow-up Optimizer">
        <div className="grid gap-2 text-sm">
          <label>Risk tier<select value={riskTier} onChange={(e) => setRiskTier(e.target.value as RiskTier)} className="mt-1 w-full rounded border px-3 py-2 dark:bg-slate-900"><option>Low</option><option>Moderate</option><option>High</option><option>Critical</option></select></label>
          <label>Adherence<input type="number" value={adherence} onChange={(e) => setAdherence(Number(e.target.value))} className="mt-1 w-full rounded border px-3 py-2 dark:bg-slate-900" /></label>
          <label>Last visit date<input type="date" value={lastVisitDate} onChange={(e) => setLastVisitDate(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 dark:bg-slate-900" /></label>
          <label>HbA1c trend<select value={trend} onChange={(e) => setTrend(e.target.value as 'improving' | 'stable' | 'worsening')} className="mt-1 w-full rounded border px-3 py-2 dark:bg-slate-900"><option value="improving">Improving</option><option value="stable">Stable</option><option value="worsening">Worsening</option></select></label>
          <label>Travel distance (km)<input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="mt-1 w-full rounded border px-3 py-2 dark:bg-slate-900" /></label>
        </div>
      </Card>
      <Card title="Recommendation Output">
        <div className="space-y-2 text-sm">
          <p><strong>Recommended follow-up type:</strong> {recommendation}</p>
          <p><strong>Next visit date:</strong> {nextVisitDate}</p>
          <p><strong>Visits avoided:</strong> {savings.avoidedVisits}</p>
          <p><strong>Paper saved:</strong> {savings.paperSaved} forms</p>
          <p><strong>Carbon saved:</strong> {savings.carbonSaved} kg CO2e</p>
        </div>
      </Card>
    </div>
  );
}
