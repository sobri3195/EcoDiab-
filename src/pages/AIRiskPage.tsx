import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/Card';
import { useToast } from '../components/Toast';
import { calculateRisk, type RiskInput, type RiskResult } from '../lib/risk';
import type { Patient } from '../lib/mock';

const complicationOptions = ['Neuropathy', 'Retinopathy', 'Nephropathy', 'CVD'];

const defaultInput: RiskInput = {
  hba1c: 7,
  bmi: 25,
  systolicBP: 130,
  ldl: 110,
  priorComplications: [],
  adherence: 75,
  visitFrequency: 3,
};

export default function AIRiskPage() {
  const location = useLocation();
  const { pushToast } = useToast();
  const [input, setInput] = useState<RiskInput>(defaultInput);
  const [result, setResult] = useState<RiskResult | null>(null);

  useEffect(() => {
    const patient = (location.state as { patient?: Patient } | null)?.patient;
    if (patient) {
      setInput({
        hba1c: patient.hba1c,
        bmi: patient.bmi,
        systolicBP: patient.systolicBP,
        ldl: patient.ldl,
        priorComplications: patient.complications,
        adherence: patient.adherence,
        visitFrequency: patient.visitFrequency,
      });
      pushToast(`Prefilled from ${patient.name}`);
    }
  }, [location.state, pushToast]);

  const toggleComplication = (item: string) => {
    setInput((prev) => ({
      ...prev,
      priorComplications: prev.priorComplications.includes(item)
        ? prev.priorComplications.filter((c) => c !== item)
        : [...prev.priorComplications, item],
    }));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Risk Stratification Form">
        <p className="mb-3 text-xs text-amber-600">Demo deterministic model (replaceable by RF/XGBoost/NN).</p>
        <div className="grid gap-2">
          {([
            ['HbA1c', 'hba1c'],
            ['BMI', 'bmi'],
            ['Systolic BP', 'systolicBP'],
            ['LDL', 'ldl'],
            ['Medication adherence (0-100)', 'adherence'],
            ['Visit frequency (per year)', 'visitFrequency'],
          ] as const).map(([label, key]) => (
            <label key={key} className="text-sm">
              {label}
              <input
                type="number"
                value={input[key]}
                onChange={(e) => setInput((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-slate-900"
              />
            </label>
          ))}

          <fieldset className="mt-2">
            <legend className="mb-1 text-sm">Prior complications</legend>
            <div className="flex flex-wrap gap-2">
              {complicationOptions.map((option) => (
                <label key={option} className="inline-flex items-center gap-1 text-sm">
                  <input type="checkbox" checked={input.priorComplications.includes(option)} onChange={() => toggleComplication(option)} />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            onClick={() => {
              setResult(calculateRisk(input));
              pushToast('Risk score computed.');
            }}
            className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white"
          >
            Compute Risk
          </button>
        </div>
      </Card>

      <Card title="Risk Results">
        {result ? (
          <div className="space-y-2 text-sm">
            <p><strong>Risk score:</strong> {result.score}/100</p>
            <p><strong>Tier:</strong> {result.tier}</p>
            <p><strong>6–12 month complications probability:</strong> {result.complicationProbability}%</p>
            <p><strong>Hospitalization risk:</strong> {result.hospitalizationRisk}%</p>
            <div>
              <p className="font-semibold">Personalized recommendations:</p>
              <ul className="list-disc pl-5">
                {result.recommendations.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No output yet. Fill form and compute to see results.</p>
        )}
      </Card>
    </div>
  );
}
