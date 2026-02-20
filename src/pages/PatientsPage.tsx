import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Drawer from '../components/Drawer';
import Table from '../components/Table';
import { patients, type Patient, type RiskTier } from '../lib/mock';

export default function PatientsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | RiskTier>('all');
  const [hbaFilter, setHbaFilter] = useState<'all' | 'lt7' | 'gte7'>('all');
  const [sortBy, setSortBy] = useState<'visit' | 'hba1c'>('visit');
  const [selected, setSelected] = useState<Patient | null>(null);

  const filtered = useMemo(() => {
    return patients
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => (riskFilter === 'all' ? true : p.riskTier === riskFilter))
      .filter((p) => (hbaFilter === 'all' ? true : hbaFilter === 'lt7' ? p.hba1c < 7 : p.hba1c >= 7))
      .sort((a, b) => (sortBy === 'visit' ? new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime() : b.hba1c - a.hba1c));
  }, [search, riskFilter, hbaFilter, sortBy]);

  return (
    <div className="space-y-4">
      <div className="grid gap-2 md:grid-cols-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient" className="rounded-md border px-3 py-2 dark:bg-slate-900" />
        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value as 'all' | RiskTier)} className="rounded-md border px-3 py-2 dark:bg-slate-900">
          <option value="all">All risk tiers</option><option>Low</option><option>Moderate</option><option>High</option><option>Critical</option>
        </select>
        <select value={hbaFilter} onChange={(e) => setHbaFilter(e.target.value as 'all' | 'lt7' | 'gte7')} className="rounded-md border px-3 py-2 dark:bg-slate-900">
          <option value="all">All HbA1c</option><option value="lt7">&lt; 7</option><option value="gte7">≥ 7</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'visit' | 'hba1c')} className="rounded-md border px-3 py-2 dark:bg-slate-900">
          <option value="visit">Sort: Last visit</option><option value="hba1c">Sort: HbA1c</option>
        </select>
      </div>

      <Table headers={['Name', 'Risk', 'HbA1c', 'Last visit', 'Actions']}>
        {filtered.length === 0 ? (
          <tr><td className="px-4 py-6 text-sm text-slate-500" colSpan={5}>No matching patients.</td></tr>
        ) : (
          filtered.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3 text-sm">{p.name}</td>
              <td className="px-4 py-3 text-sm">{p.riskTier}</td>
              <td className="px-4 py-3 text-sm">{p.hba1c}</td>
              <td className="px-4 py-3 text-sm">{p.lastVisit}</td>
              <td className="px-4 py-3 text-sm">
                <button onClick={() => setSelected(p)} className="mr-2 rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">Profile</button>
                <button
                  onClick={() => navigate('/ai-risk', { state: { patient: p } })}
                  className="rounded bg-emerald-600 px-2 py-1 text-white"
                >
                  Compute Risk
                </button>
              </td>
            </tr>
          ))
        )}
      </Table>

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? 'Patient'}>
        {selected ? (
          <div className="space-y-2 text-sm">
            <p>HbA1c: {selected.hba1c}</p>
            <p>BMI: {selected.bmi}</p>
            <p>BP: {selected.systolicBP}</p>
            <p>LDL: {selected.ldl}</p>
            <p>Adherence: {selected.adherence}%</p>
            <p>Visit pattern: {selected.visitPattern}</p>
            <p>Complications history: {selected.complications.length ? selected.complications.join(', ') : 'None'}</p>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
