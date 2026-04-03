# Hardware Blueprint & Prompt (EcoDiab)

Dokumen ini menyiapkan **1 prompt siap pakai** untuk membantu kamu membuat model aplikasi EcoDiab dengan **bottom navigation**, sekaligus struktur folder `/hardware` untuk kategori:
- `pen`
- `glucose`
- `device`

## Struktur folder `/hardware`

```txt
hardware/
├── README.md        # dokumen ini (prompt + standar data)
├── pen/
│   └── .gitkeep
├── glucose/
│   └── .gitkeep
└── device/
    └── .gitkeep
```

## Prompt siap pakai

Salin prompt berikut ke AI assistant/LLM kamu:

```text
Kamu adalah Product Architect + Mobile UX Engineer untuk aplikasi EcoDiab.

Tujuan:
1) Buat model aplikasi diabetes management dengan bottom navigation.
2) Integrasikan modul hardware untuk 3 kategori: pen, glucose, dan device.
3) Hasil harus praktis untuk langsung dijadikan backlog pengembangan.

Konteks produk:
- App: EcoDiab (React + TypeScript).
- Fokus: tracking diabetes harian, konektivitas hardware, insight penggunaan.
- Pengguna utama: pasien diabetes dan caregiver.

Kebutuhan output:
A. Arsitektur Bottom Navigation (5 tab):
   - Home
   - Log
   - Hardware
   - Insights
   - Profile
   Untuk tiap tab, jelaskan:
   - tujuan user,
   - komponen utama,
   - state yang disimpan,
   - event analytics yang perlu di-track.

B. Desain modul Hardware:
   - hardware/pen
   - hardware/glucose
   - hardware/device
   Untuk tiap kategori berikan:
   - daftar data yang disimpan (id, model, serial, battery, status koneksi, lastSync, firmware, dsb),
   - alur pairing BLE/Wi-Fi,
   - alur sinkronisasi data,
   - error states + recovery.

C. Kontrak data (TypeScript):
   - Buat interface/type untuk PenDevice, GlucoseMeter, GenericDevice.
   - Buat contoh payload API untuk list, detail, dan sync result.

D. UX flow ringkas:
   - First-time setup hardware,
   - Reconnect device,
   - Manual fallback jika sync gagal.

E. Roadmap implementasi:
   - Sprint 1: fondasi nav + dummy data,
   - Sprint 2: hardware pairing mock,
   - Sprint 3: real sync + telemetry.

Format jawaban:
- Gunakan heading jelas per bagian (A-E).
- Sertakan tabel ringkas untuk data model.
- Sertakan checklist implementasi yang bisa langsung dipindahkan ke Jira/Trello.
- Bahasa: Indonesia.
```

## Standar isi folder hardware (rekomendasi)

Saat mulai implementasi, simpan aset berdasarkan kategori:
- `hardware/pen`: data/flow terkait insulin pen smart device.
- `hardware/glucose`: data/flow glucometer/CGM.
- `hardware/device`: perangkat umum (bridge, wearable, atau alat pihak ketiga).

Opsional tahap lanjut:
- Tambah file `schema.ts` per kategori.
- Tambah `mock-data.json` untuk simulasi pairing/sync.
- Tambah `integration-notes.md` per vendor hardware.
