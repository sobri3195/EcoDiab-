import { useCallback, useEffect, useMemo, useState } from 'react';
import Drawer from '../components/Drawer';
import { EmptyState, ErrorState, LoadingState } from '../components/PageState';
import Table from '../components/Table';
import { useToast } from '../components/Toast';
import { api, type PatientPayload } from '../lib/api';
import { useAppContext } from '../lib/app-context';
import { logError, logEvent } from '../lib/logger';

type FormState = { name: string; age: string; medicalHistory: string };
const initialForm: FormState = { name: '', age: '', medicalHistory: '' };

export default function PatientsPage() {
  const { pushToast } = useToast();
  const { patients, setPatients } = useAppContext();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<PatientPayload | null>(null);
  const [editing, setEditing] = useState<PatientPayload | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getPatients();
      setPatients(response);
      logEvent('patients_loaded', { count: response.length });
    } catch (err) {
      setError('Gagal mengambil daftar pasien.');
      logError('patients_load', err);
    } finally {
      setLoading(false);
    }
  }, [setPatients]);

  useEffect(() => {
    void loadPatients();
  }, [loadPatients]);

  const filtered = useMemo(() => patients.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())), [patients, search]);

  const validateForm = () => {
    if (!form.name.trim()) return 'Nama wajib diisi.';
    const age = Number(form.age);
    if (Number.isNaN(age) || age < 1 || age > 120) return 'Umur harus antara 1-120.';
    if (form.medicalHistory.trim().length < 8) return 'Riwayat medis minimal 8 karakter.';
    return null;
  };

  const submitForm = async () => {
    const validation = validateForm();
    if (validation) {
      pushToast(validation);
      return;
    }

    const payload = { name: form.name.trim(), age: Number(form.age), medicalHistory: form.medicalHistory.trim() };
    try {
      if (editing) {
        const updated = await api.updatePatient(editing.id, payload);
        setPatients(patients.map((item) => (item.id === editing.id ? updated : item)));
        pushToast('Pasien berhasil diperbarui.');
        logEvent('patient_update', { id: editing.id });
      } else {
        const created = await api.createPatient(payload);
        setPatients([created, ...patients]);
        pushToast('Pasien berhasil ditambahkan.');
        logEvent('patient_create', { id: created.id });
      }
      setForm(initialForm);
      setEditing(null);
    } catch (err) {
      pushToast('Gagal menyimpan data pasien.');
      logError('patient_save', err);
    }
  };

  const removePatient = async (id: string) => {
    try {
      await api.deletePatient(id);
      setPatients(patients.filter((item) => item.id !== id));
      pushToast('Pasien berhasil dihapus.');
      logEvent('patient_delete', { id });
    } catch (err) {
      pushToast('Gagal menghapus pasien.');
      logError('patient_delete', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2 md:grid-cols-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient" className="rounded-md border px-3 py-2 dark:bg-slate-900" />
        <button onClick={() => { setEditing(null); setForm(initialForm); }} className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Tambah Pasien</button>
        <button onClick={() => void loadPatients()} className="rounded-md border px-3 py-2 text-sm">Refresh</button>
      </div>

      <div className="rounded-xl border p-4">
        <h3 className="mb-2 text-sm font-semibold">{editing ? 'Edit Pasien' : 'Form Pasien Baru'}</h3>
        <div className="grid gap-2 md:grid-cols-3">
          <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Nama" className="rounded border px-3 py-2 dark:bg-slate-900" />
          <input value={form.age} onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))} placeholder="Umur" type="number" className="rounded border px-3 py-2 dark:bg-slate-900" />
          <input value={form.medicalHistory} onChange={(e) => setForm((prev) => ({ ...prev, medicalHistory: e.target.value }))} placeholder="Riwayat medis" className="rounded border px-3 py-2 dark:bg-slate-900" />
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={() => void submitForm()} className="rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white">Simpan</button>
          {editing ? <button onClick={() => { setEditing(null); setForm(initialForm); }} className="rounded border px-3 py-2 text-xs">Batal</button> : null}
        </div>
      </div>

      {loading ? <LoadingState label="Memuat data pasien..." /> : null}
      {error ? <ErrorState message={error} onRetry={() => void loadPatients()} /> : null}
      {!loading && !error && filtered.length === 0 ? <EmptyState message="Tidak ada pasien." actionLabel="Tambah Data" onAction={() => setForm(initialForm)} /> : null}

      {!loading && !error && filtered.length > 0 ? (
        <Table headers={['Name', 'Age', 'History', 'Actions']}>
          {filtered.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3 text-sm">{p.name}</td>
              <td className="px-4 py-3 text-sm">{p.age}</td>
              <td className="px-4 py-3 text-sm">{p.medicalHistory}</td>
              <td className="px-4 py-3 text-sm">
                <button onClick={() => setSelected(p)} className="mr-2 rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">Detail</button>
                <button onClick={() => { setEditing(p); setForm({ name: p.name, age: String(p.age), medicalHistory: p.medicalHistory }); }} className="mr-2 rounded bg-blue-600 px-2 py-1 text-white">Edit</button>
                <button onClick={() => void removePatient(p.id)} className="rounded bg-rose-600 px-2 py-1 text-white">Hapus</button>
              </td>
            </tr>
          ))}
        </Table>
      ) : null}

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? 'Patient'}>
        {selected ? <div className="space-y-2 text-sm"><p>Umur: {selected.age}</p><p>Riwayat medis: {selected.medicalHistory}</p></div> : null}
      </Drawer>
    </div>
  );
}
