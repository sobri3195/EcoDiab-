# Fitur Lengkap EcoDiab

Dokumen ini merangkum seluruh fitur utama yang saat ini tersedia di aplikasi **EcoDiab**.

## 1. Akses & Navigasi Aplikasi
- **Landing page** sebagai pintu masuk aplikasi.
- **Protected route** untuk membatasi akses halaman internal hanya bagi pengguna terautentikasi.
- Routing utama mencakup dashboard, pasien, AI risk, follow-up, green impact, dietary assistant, alert center, edukasi, achievements, dan personal goals.

## 2. Dashboard Klinis Cerdas
- Ringkasan metrik utama pasien dan performa layanan.
- Visualisasi data menggunakan chart (line, area, bar) untuk tren klinis dan operasional.
- Integrasi widget adaptif berbasis profil pasien/risk level untuk prioritas aksi.

## 3. Manajemen Data Pasien
- Daftar pasien dengan pencarian.
- Detail pasien melalui panel/drawer.
- Dukungan alur CRUD pasien (ambil data, tambah, ubah, dan sinkronisasi data ke context aplikasi).
- Timeline progres pasien untuk memudahkan evaluasi perkembangan.

## 4. AI Risk Prediction
- Form input parameter klinis (HbA1c, BMI, tekanan darah sistolik, LDL, komplikasi, adherence, frekuensi kunjungan).
- Prediksi risiko komplikasi berbasis API.
- Integrasi dari halaman pasien ke halaman risiko untuk prefill data pasien.

## 5. Follow-up Workflow
- Board follow-up dengan status **pending**, **overdue**, dan **completed**.
- Perubahan status task dengan interaksi drag-and-drop.
- Detail tindak lanjut melalui drawer agar tim medis dapat menindaklanjuti lebih cepat.

## 6. Dietary Assistant
- Meal planner per slot makan: sarapan, makan siang, snack, dan makan malam.
- Perhitungan total nutrisi: kalori, karbohidrat, protein, lemak, gula, serat, serta estimasi glycemic load/impact.
- Riwayat perencanaan menu untuk membantu monitoring pola makan.

## 7. Smart Alert Center
- Daftar alert dengan filter status (open/resolved) dan severity.
- Pencarian alert berdasarkan pasien/kategori/tindakan.
- Aksi cepat menyelesaikan alert individual maupun massal (resolve all visible).

## 8. Patient Education (Micro-learning)
- Modul edukasi berbasis lesson cards.
- Progress pembelajaran per pengguna (persisten di penyimpanan lokal).
- Mini-quiz per materi dan halaman achievements/ringkasan capaian belajar.

## 9. Personal Goal Tracker
- Pembuatan target personal (contoh: glukosa, berat, tekanan darah, aktivitas).
- Validasi input goal sebelum disimpan.
- Tracking progres goal, kalkulasi status (completed/on-track/at-risk), dan pembaruan progres berkala.

## 10. Green Impact
- Halaman green impact untuk menampilkan dampak keberlanjutan dari intervensi/pola diet.
- Mendukung positioning EcoDiab sebagai platform diabetes management yang menggabungkan outcome kesehatan dan environmental impact.

## 11. PWA & Offline-first Behavior
- Registrasi service worker untuk dukungan PWA.
- Inisialisasi mekanisme sinkronisasi offline queue agar aksi mutasi tetap bisa diproses saat koneksi kembali tersedia.
- Fondasi untuk pengalaman aplikasi yang lebih stabil pada koneksi terbatas.

## 12. Sistem UI/UX Pendukung
- Komponen reusable: card, table, modal, drawer, navbar, sidebar, toast, page state.
- State standar antarmuka: loading, empty state, error state.
- Notifikasi toast untuk feedback aksi pengguna.

## 13. Arsitektur Frontend
- React + TypeScript + Vite.
- App-level context untuk state global (autentikasi, pasien, data risiko, dsb).
- Alert center context terpisah untuk manajemen notifikasi klinis.
- Library utility/domain terstruktur (`api`, `risk`, `personal-goals`, `patient-education`, `dashboard-widgets`, `green`, dll.) agar logika lebih modular.
