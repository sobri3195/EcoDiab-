# EcoDiab Bottom Navigation App Model (Analisa + Prompt)

## 1) Ringkasan analisa codebase saat ini

Berdasarkan struktur aplikasi:

- Routing utama sudah cukup kaya dan memakai `react-router-dom` dengan banyak modul klinis (dashboard, patients, AI risk, alerts, education, dll).
- Layout workspace saat ini berfokus pada **sidebar + header** (`AppShell`), dengan `Sidebar` sebagai nav primer.
- Daftar modul sudah terpusat di `workspaceModules` (`src/lib/module-catalog.ts`), ini sangat bagus karena bisa dipakai ulang untuk model bottom navigation tanpa hardcode berulang.

Implikasi arsitektur:

- Bottom navigation paling aman dibuat sebagai **layer tambahan khusus mobile** (`md:hidden`) agar desktop tetap sidebar.
- Aksesibilitas sudah punya fondasi (toggle kontras, ukuran teks), jadi komponen bottom nav perlu menjaga touch target min 44px, label jelas, dan `aria-current` pada tab aktif.

---

## 2) Model bottom navigation yang direkomendasikan

### Tujuan
Meningkatkan UX mobile dengan pola 5 tab inti + 1 aksi cepat, sambil menjaga konsistensi modul EcoDiab.

### Struktur tab (v1)

1. **Home** → `/dashboard`
2. **Patients** → `/patients`
3. **Alerts** → `/alerts` (dengan badge unresolved count)
4. **Education** → `/education`
5. **More** → membuka bottom sheet untuk modul lain (`/ai-risk`, `/follow-up`, `/green`, dll)

### Prinsip desain

- Maksimal 5 item pada bottom bar agar tidak padat.
- Modul sekunder dipindah ke **More sheet** (search + quick links).
- Tetap sinkron dengan `workspaceModules` agar scalable saat modul bertambah.

---

## 3) Prompt siap pakai (untuk AI coding assistant)

> Gunakan prompt ini langsung ke coding assistant.

```txt
Kamu adalah senior frontend engineer React + TypeScript + Tailwind.

Konteks codebase:
- App memakai react-router-dom, route utama ada di src/App.tsx.
- Layout workspace ada di src/layouts/AppShell.tsx.
- Modul navigation terpusat di src/lib/module-catalog.ts sebagai workspaceModules.
- Sidebar saat ini di src/components/Sidebar.tsx.

Tugas:
Buat bottom navigation mobile-first TANPA merusak UX desktop.

Kebutuhan implementasi:
1) Buat komponen baru src/components/BottomNav.tsx.
2) Bottom nav hanya tampil di mobile (hidden di md ke atas).
3) Item bottom nav: Dashboard, Patients, Alerts, Education, More.
4) Alerts menampilkan badge unresolvedCount dari alert-center-context.
5) Tab aktif mengikuti pathname (gunakan useLocation).
6) Klik More membuka bottom sheet berisi:
   - Search modul
   - List modul dari workspaceModules (kecuali yang sudah jadi tab utama)
   - Navigasi ke route tujuan
7) Integrasikan BottomNav ke AppShell tanpa mengganggu sidebar desktop.
8) Tambahkan safe area support iOS (padding-bottom dengan env(safe-area-inset-bottom)).
9) Accessibility:
   - tiap tombol tab min-height 44px
   - aria-label jelas
   - aria-current="page" untuk tab aktif
10) Tambahkan animasi ringan (transition) untuk active state.
11) Tidak boleh hardcode list modul ganda; pakai konstanta/map terpusat agar maintainable.
12) Buat unit test minimal untuk:
   - highlight tab aktif berdasarkan route
   - badge Alerts muncul saat count > 0

Output yang diminta:
- Daftar file yang ditambah/diubah
- Potongan kode final
- Catatan alasan desain singkat
- Checklist testing
```

---

## 4) Ide fungsi menarik untuk versi berikutnya

1. **Quick Action FAB di tengah bottom nav**
   - Aksi cepat: “Tambah follow-up”, “Buat alert”, “Catat edukasi pasien”.

2. **Contextual Tab Reordering (opsional)**
   - Tab urut otomatis berdasarkan modul paling sering dipakai user (disimpan per role).

3. **Smart Alerts Peek Card**
   - Saat tab Alerts dipilih, tampil ringkasan 3 alert tertinggi tanpa pindah halaman penuh.

4. **Voice Shortcut (mobile clinic mode)**
   - Tombol mic untuk langsung buka modul via perintah sederhana: “buka pasien”, “buka lab insights”.

5. **Offline quick queue indicator**
   - Dot kecil pada tab bila ada mutasi offline yang belum sinkron.

6. **Patient Pinning**
   - Dari bottom sheet, user bisa pin 1–2 pasien favorit agar bisa diakses 1 tap.

7. **Role-aware navigation**
   - Clinician vs Admin punya prioritas tab berbeda, tetapi tetap dengan 5 slot utama.

8. **Gesture micro-interaction**
   - Swipe horizontal untuk pindah tab terdekat (opsional, bisa dimatikan demi aksesibilitas).

---

## 5) Saran implementasi bertahap (aman)

### Phase 1 (cepat, low risk)
- Tambah `BottomNav` statis 5 tab + active state + alert badge.
- Integrasi ke `AppShell` mobile only.

### Phase 2
- Tambah `More` bottom sheet + search modul dari `workspaceModules`.

### Phase 3
- Tambah personalisasi per role + telemetry event (tab_click, more_open, module_open).

### Phase 4
- Eksperimen fitur lanjutan: quick action FAB, contextual tab ranking.

---

## 6) KPI yang disarankan

- Mobile session duration
- Route depth per session (berapa modul dibuka)
- Alert response time
- Follow-up creation rate dari mobile
- Retention pengguna clinician mingguan

