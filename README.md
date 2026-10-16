# SIPRESMA (Sistem Informasi Prestasi Siswa Madrasah) - React + Vite Edition

Aplikasi web modern berbasis **React 19 + Vite** untuk pencatatan dan rekapitulasi prestasi siswa madrasah (Akademik & Non-Akademik) secara terintegrasi antara **Administrator Kesiswaan**, **Kepala Madrasah**, dan **Guru Pembimbing**.

---

## 🚀 Menjalankan Aplikasi dengan NPM

Node.js (LTS v24.20.0) dan npm (v11.19.0) telah terpasang di sistem Anda.

### 1. Menjalankan Server Pengembangan (Dev Server)
Di folder proyek (`C:\Users\ADMIN\.gemini\antigravity-ide\scratch\prestasi-madrasah`):
```bash
npm run dev
```
Aplikasi akan aktif di URL lokal:
👉 **http://localhost:5173/**

### 2. Membangun Bundel Produksi (Production Build)
```bash
npm run build
```
Hasil optimasi bundle produksi tersimpan di folder `dist/`.

### 3. Pratinjau Hasil Build
```bash
npm run preview
```

---

## 🌟 Fitur Utama

### 1. Dual-Tracking: Prestasi Diraih vs Agenda Lomba Akan Datang
- **🏆 Prestasi Yang Sudah Diraih**:
  - Rekapitulasi medali emas/perak/perunggu, juara 1/2/3, harapan, dan penghargaan khusus.
  - Kategorisasi: **Akademik** (KSM Sains, MYRES Riset, Robotika & AI, Olimpiade Bahasa) dan **Non-Akademik** (Keagamaan/Tahfidz, Seni Budaya/Kaligrafi, Olahraga/Pencak Silat/Futsal, Pramuka).
  - Filter interaktif: Kategori, Tingkat (Internasional, Nasional, Provinsi, Kab/Kota, Kecamatan), dan Tahun Ajaran.
  - Pencarian real-time nama siswa, NISN, nama kompetisi, atau pembimbing.
  - Viewer bukti sertifikat resmi dengan opsi unduh.
- **📅 Lomba & Agenda Yang Akan Berlangsung**:
  - Pendaftaran delegasi siswa dan guru pembimbing untuk lomba mendatang.
  - Countdown otomatis (H-x Hari / Hari Ini / Lewat Jadwal).
  - Indikator progres tahapan pembinaan & persiapan (contoh: *Pendaftaran Berkas*, *Pembinaan Intensif*, *Simulasi Uji Coba*, *Delegasi Berangkat*).
  - **Aksi Cepat "🎉 Selesaikan & Catat Juara"**: Satu klik untuk mengonversi agenda lomba yang telah selesai menjadi data prestasi diraih secara otomatis!

---

### 2. Multi-Role Terpadu (Hak Akses Pengguna)
Anda dapat berpindah peran secara instan melalui dropdown **"Pilih Peran"** di pojok kanan atas:

1. **👨‍💼 Administrator Kesiswaan (Ahmad Fauzi, S.Kom)**:
   - Akses penuh input, edit, hapus prestasi dan agenda lomba.
   - Verifikasi keabsahan dokumen dan sertifikat siswa.
   - Backup database dan tombol reset ke data percontohan awal.
2. **🎓 Kepala Madrasah (Dr. H. Miftahul Ulum, M.Ag)**:
   - Dashboard eksekutif & monitoring capaian mutu madrasah.
   - Grafik interaktif: Distribusi tingkat kejuaraan (Donut Chart) dan tren perolehan bulanan (Bar Chart).
   - Matriks rekapitulasi capaian per bidang kompetisi.
   - **Tombol "🖨️ Cetak Rekap Resmi"**: Format dokumen dinas resmi Kementerian Agama lengkap dengan Kop Surat Madrasah, nomor surat laporan, tabel terstruktur, serta kolom tanda tangan Kepala Madrasah & stempel.
3. **👩‍🏫 Guru Pembimbing (Ustadzah Siti Rohmah, M.Pd)**:
   - Mendaftarkan delegasi lomba yang akan berlangsung.
   - Memantau progres karantina/pembinaan intensif siswa.
   - Filter cepat **"🔍 Khusus Siswa Bimbingan Saya"** untuk fokus pada siswa dampingan.

---

### 3. Ekspor & Format Cetak Resmi
- **🖨️ Cetak Rekapitulasi Berkop Surat Resmi**: Menggunakan layout standar dinas Kementerian Agama (dilengkapi logo resmi madrasah, alamat lengkap, dan tanda tangan digital).
- **📥 Ekspor CSV / Excel**: Unduh seluruh rekapitulasi data prestasi siswa dengan format siap olah di Microsoft Excel atau Google Sheets.

---

## 📁 Struktur Berkas Proyek React + Vite

```
prestasi-madrasah/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx            # Navigasi & identitas peran
│   │   ├── Header.jsx             # Top bar, switcher peran, tema
│   │   ├── RoleBanner.jsx         # Banner kontekstual hak akses
│   │   ├── StatCards.jsx          # 4 kartu statistik interaktif
│   │   ├── Controls.jsx           # Tab & filter multi-parameter
│   │   ├── AchievedList.jsx       # Tampilan grid & tabel prestasi diraih
│   │   ├── UpcomingList.jsx       # Tampilan grid & tabel lomba mendatang
│   │   ├── AnalyticsView.jsx      # Grafik Canvas & matriks rekapitulasi
│   │   └── Modals.jsx             # Form Tambah/Edit, Cetak Kop, Sertifikat
│   ├── data/
│   │   └── initialData.js         # Master data kejuaraan & peran
│   ├── App.jsx                    # Root state management & reaktivitas
│   ├── index.css                  # Desain sistem Vanilla CSS lengkap
│   └── main.jsx                   # Entrypoint React 19
├── public/
│   └── assets/                    # Logo madrasah & sertifikat sampel
├── index.html                     # HTML root Vite
├── vite.config.js                 # Konfigurasi server Vite
└── package.json                   # Dependensi React & skrip npm
```
