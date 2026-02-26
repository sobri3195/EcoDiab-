import { useMemo, useState } from 'react';
import Card from '../components/Card';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';
import { useToast } from '../components/Toast';
import { api } from '../lib/api';
import { logError, logEvent } from '../lib/logger';

type MealSlot = 'Sarapan' | 'Makan Siang' | 'Snack' | 'Makan Malam';

type FoodItem = {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar: number;
  fiber: number;
  gi: number;
};

type PlannerState = Record<MealSlot, FoodItem[]>;

type PlannerTotals = {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar: number;
  fiber: number;
  glycemicLoad: number;
  impact: 'Rendah' | 'Sedang' | 'Tinggi';
};

const MEAL_SLOTS: MealSlot[] = ['Sarapan', 'Makan Siang', 'Snack', 'Makan Malam'];
const MAX_ITEMS_PER_SLOT = 4;
const HISTORY_LIMIT = 15;

const FOOD_LIBRARY: FoodItem[] = [
  { id: 'oatmeal', name: 'Oatmeal + Chia', calories: 220, carbs: 36, protein: 8, fat: 6, sugar: 4, fiber: 7, gi: 45 },
  { id: 'telur-rebus', name: 'Telur Rebus', calories: 70, carbs: 1, protein: 6, fat: 5, sugar: 1, fiber: 0, gi: 0 },
  { id: 'nasi-merah', name: 'Nasi Merah', calories: 215, carbs: 45, protein: 5, fat: 2, sugar: 1, fiber: 3, gi: 55 },
  { id: 'ayam-panggang', name: 'Ayam Panggang', calories: 180, carbs: 0, protein: 33, fat: 4, sugar: 0, fiber: 0, gi: 0 },
  { id: 'salmon', name: 'Salmon Panggang', calories: 210, carbs: 0, protein: 28, fat: 11, sugar: 0, fiber: 0, gi: 0 },
  { id: 'brokoli', name: 'Brokoli Kukus', calories: 55, carbs: 9, protein: 4, fat: 1, sugar: 2, fiber: 4, gi: 15 },
  { id: 'apel', name: 'Apel Iris', calories: 95, carbs: 25, protein: 1, fat: 0, sugar: 19, fiber: 4, gi: 38 },
  { id: 'greek-yogurt', name: 'Greek Yogurt Plain', calories: 130, carbs: 9, protein: 17, fat: 3, sugar: 7, fiber: 0, gi: 35 },
  { id: 'tempe', name: 'Tempe Panggang', calories: 190, carbs: 12, protein: 20, fat: 11, sugar: 2, fiber: 4, gi: 20 },
  { id: 'ubi-kukus', name: 'Ubi Kukus', calories: 115, carbs: 27, protein: 2, fat: 0, sugar: 6, fiber: 4, gi: 50 },
];

const createEmptyPlanner = (): PlannerState => ({
  Sarapan: [],
  'Makan Siang': [],
  Snack: [],
  'Makan Malam': [],
});

const calculateTotals = (planner: PlannerState): PlannerTotals => {
  const items = Object.values(planner).flat();
  const totals = items.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.carbs += item.carbs;
      acc.protein += item.protein;
      acc.fat += item.fat;
      acc.sugar += item.sugar;
      acc.fiber += item.fiber;
      acc.glycemicLoad += (item.carbs * item.gi) / 100;
      return acc;
    },
    { calories: 0, carbs: 0, protein: 0, fat: 0, sugar: 0, fiber: 0, glycemicLoad: 0 },
  );

  let impact: PlannerTotals['impact'] = 'Rendah';
  if (totals.glycemicLoad >= 80 || totals.sugar >= 60) {
    impact = 'Tinggi';
  } else if (totals.glycemicLoad >= 45 || totals.sugar >= 35) {
    impact = 'Sedang';
  }

  return { ...totals, impact };
};

const toComparisonPlanner = (planner: PlannerState): PlannerState =>
  Object.fromEntries(MEAL_SLOTS.map((slot) => [slot, [...planner[slot]]])) as PlannerState;

export default function DietaryAssistantPage() {
  const { pushToast } = useToast();
  const [form, setForm] = useState({ patientId: '', calories: 1600, sugar: 30, preference: 'standard', allergies: '' });
  const [result, setResult] = useState<{ summary: string; recommendations: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [planner, setPlanner] = useState<PlannerState>(() => createEmptyPlanner());
  const [selectedFoodId, setSelectedFoodId] = useState<string>(FOOD_LIBRARY[0].id);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [history, setHistory] = useState<PlannerState[]>([]);
  const [future, setFuture] = useState<PlannerState[]>([]);
  const [menuA, setMenuA] = useState<PlannerState | null>(null);
  const [menuB, setMenuB] = useState<PlannerState | null>(null);

  const totals = useMemo(() => calculateTotals(planner), [planner]);

  const updatePlanner = (updater: (current: PlannerState) => PlannerState) => {
    setPlanner((current) => {
      const next = updater(current);
      if (next === current) {
        return current;
      }
      setHistory((prev) => [...prev.slice(-(HISTORY_LIMIT - 1)), toComparisonPlanner(current)]);
      setFuture([]);
      return next;
    });
  };

  const addFoodToSlot = (slot: MealSlot, foodId: string) => {
    const food = FOOD_LIBRARY.find((item) => item.id === foodId);
    if (!food) {
      setValidationError('Makanan tidak ditemukan.');
      return;
    }

    updatePlanner((current) => {
      if (current[slot].length >= MAX_ITEMS_PER_SLOT) {
        setValidationError(`Maksimal ${MAX_ITEMS_PER_SLOT} item untuk ${slot}.`);
        return current;
      }
      if (current[slot].some((item) => item.id === food.id)) {
        setValidationError(`${food.name} sudah ada di ${slot}.`);
        return current;
      }
      setValidationError(null);
      return { ...current, [slot]: [...current[slot], food] };
    });
  };

  const removeFoodFromSlot = (slot: MealSlot, foodId: string) => {
    updatePlanner((current) => ({ ...current, [slot]: current[slot].filter((item) => item.id !== foodId) }));
  };

  const undo = () => {
    if (!history.length) {
      setValidationError('Tidak ada aksi untuk di-undo.');
      return;
    }
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setFuture((prev) => [toComparisonPlanner(planner), ...prev].slice(0, HISTORY_LIMIT));
    setPlanner(toComparisonPlanner(previous));
    setValidationError(null);
  };

  const redo = () => {
    if (!future.length) {
      setValidationError('Tidak ada aksi untuk di-redo.');
      return;
    }
    const [next, ...rest] = future;
    setFuture(rest);
    setHistory((prev) => [...prev.slice(-(HISTORY_LIMIT - 1)), toComparisonPlanner(planner)]);
    setPlanner(toComparisonPlanner(next));
    setValidationError(null);
  };

  const saveMenuSnapshot = (menu: 'A' | 'B') => {
    if (menu === 'A') {
      setMenuA(toComparisonPlanner(planner));
    } else {
      setMenuB(toComparisonPlanner(planner));
    }
    pushToast(`Menu ${menu} berhasil disimpan untuk perbandingan.`);
  };

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);
      const payload = await api.getDietaryRecommendation({ ...form, allergies: form.allergies.split(',').map((item) => item.trim()).filter(Boolean) });
      setResult(payload);
      pushToast('Rekomendasi diet berhasil dimuat.');
      logEvent('dietary_submit', { patientId: form.patientId });
    } catch (err) {
      setError('Gagal memuat rekomendasi menu.');
      logError('dietary_load', err);
    } finally {
      setLoading(false);
    }
  };

  const totalCardClass = totals.impact === 'Tinggi' ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/20' : totals.impact === 'Sedang' ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/20' : 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20';

  return (
    <div className="space-y-4">
      <Card title="Dietary Assistant Interaktif">
        <div className="grid gap-2 md:grid-cols-2">
          <input placeholder="Patient ID" value={form.patientId} onChange={(e) => setForm((prev) => ({ ...prev, patientId: e.target.value }))} className="rounded border px-3 py-2 dark:bg-slate-900" />
          <input type="number" placeholder="Kalori" value={form.calories} onChange={(e) => setForm((prev) => ({ ...prev, calories: Number(e.target.value) }))} className="rounded border px-3 py-2 dark:bg-slate-900" />
          <input type="number" placeholder="Gula (gram)" value={form.sugar} onChange={(e) => setForm((prev) => ({ ...prev, sugar: Number(e.target.value) }))} className="rounded border px-3 py-2 dark:bg-slate-900" />
          <select value={form.preference} onChange={(e) => setForm((prev) => ({ ...prev, preference: e.target.value }))} className="rounded border px-3 py-2 dark:bg-slate-900"><option value="standard">Standard</option><option value="vegan">Vegan</option><option value="low-carb">Low Carb</option></select>
          <input placeholder="Alergi (pisahkan koma)" value={form.allergies} onChange={(e) => setForm((prev) => ({ ...prev, allergies: e.target.value }))} className="rounded border px-3 py-2 dark:bg-slate-900 md:col-span-2" />
        </div>
        <button onClick={() => void fetchRecommendation()} className="mt-3 rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Ambil rekomendasi</button>

        <div className="mt-4">
          {loading ? <LoadingState label="Memuat rekomendasi..." /> : null}
          {error ? <ErrorState message={error} onRetry={() => void fetchRecommendation()} /> : null}
          {!loading && !error && !result ? <EmptyState message="Belum ada ringkasan diet." actionLabel="Mulai" onAction={() => void fetchRecommendation()} /> : null}
          {result ? (
            <div className="space-y-2 rounded border p-3 text-sm">
              <p><strong>Ringkasan harian:</strong> {result.summary}</p>
              <p className="font-semibold">Rekomendasi menu:</p>
              <ul className="list-disc pl-5">
                {result.recommendations.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ) : null}
        </div>
      </Card>

      <Card title="Interactive Meal Planner">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2 rounded border p-3 md:col-span-1">
            <p className="text-sm font-semibold">Library Makanan</p>
            <select value={selectedFoodId} onChange={(e) => setSelectedFoodId(e.target.value)} className="w-full rounded border px-3 py-2 text-sm dark:bg-slate-900">
              {FOOD_LIBRARY.map((food) => (
                <option key={food.id} value={food.id}>{food.name} ({food.calories} kkal)</option>
              ))}
            </select>
            <p className="text-xs text-slate-500">Pilih makanan lalu drag ke slot makan, atau gunakan tombol tambah.</p>
            <div className="max-h-56 space-y-2 overflow-auto">
              {FOOD_LIBRARY.map((food) => (
                <div
                  key={food.id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('food-id', food.id);
                    setSelectedFoodId(food.id);
                  }}
                  className="cursor-grab rounded border p-2 text-xs"
                >
                  <p className="font-semibold">{food.name}</p>
                  <p>Karbo {food.carbs}g • Protein {food.protein}g • GI {food.gi}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            {MEAL_SLOTS.map((slot) => (
              <div
                key={slot}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  addFoodToSlot(slot, event.dataTransfer.getData('food-id'));
                }}
                className="rounded border p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{slot}</p>
                  <button onClick={() => addFoodToSlot(slot, selectedFoodId)} className="rounded border px-2 py-1 text-xs">+ Tambah pilihan aktif</button>
                </div>
                {!planner[slot].length ? <p className="text-xs text-slate-500">Drop makanan di sini.</p> : null}
                <div className="flex flex-wrap gap-2">
                  {planner[slot].map((food) => (
                    <button key={`${slot}-${food.id}`} onClick={() => removeFoodFromSlot(slot, food.id)} className="rounded-full border px-3 py-1 text-xs" title="Klik untuk hapus">
                      {food.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={undo} className="rounded border px-3 py-1 text-xs font-semibold">Undo</button>
          <button onClick={redo} className="rounded border px-3 py-1 text-xs font-semibold">Redo</button>
          <button onClick={() => saveMenuSnapshot('A')} className="rounded border px-3 py-1 text-xs font-semibold">Simpan sebagai Menu A</button>
          <button onClick={() => saveMenuSnapshot('B')} className="rounded border px-3 py-1 text-xs font-semibold">Simpan sebagai Menu B</button>
        </div>
        {validationError ? <p className="mt-2 text-xs text-rose-600">{validationError}</p> : null}
      </Card>

      <Card title="Kartu Ringkasan Nutrisi & Prediksi Dampak Glikemik">
        <div className={`rounded border p-3 text-sm ${totalCardClass}`}>
          <p>Total kalori: <strong>{Math.round(totals.calories)} kkal</strong></p>
          <p>Makro: Karbo {Math.round(totals.carbs)}g • Protein {Math.round(totals.protein)}g • Lemak {Math.round(totals.fat)}g</p>
          <p>Serat {Math.round(totals.fiber)}g • Gula {Math.round(totals.sugar)}g</p>
          <p>Glycemic load estimasi: <strong>{totals.glycemicLoad.toFixed(1)}</strong></p>
          <p className="font-semibold">Prediksi dampak glikemik: {totals.impact}</p>
        </div>
      </Card>

      <Card title="Perbandingan Menu A vs B">
        {!menuA || !menuB ? (
          <EmptyState message="Simpan snapshot planner sebagai Menu A dan Menu B untuk melihat perbandingan." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {([
              { label: 'Menu A', totals: calculateTotals(menuA) },
              { label: 'Menu B', totals: calculateTotals(menuB) },
            ] as const).map((menu) => (
              <div key={menu.label} className="rounded border p-3 text-sm">
                <p className="font-semibold">{menu.label}</p>
                <p>Kalori: {Math.round(menu.totals.calories)} kkal</p>
                <p>Karbo: {Math.round(menu.totals.carbs)}g</p>
                <p>Gula: {Math.round(menu.totals.sugar)}g</p>
                <p>GL: {menu.totals.glycemicLoad.toFixed(1)}</p>
                <p>Dampak: {menu.totals.impact}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
