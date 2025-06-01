# Growish - Labora

<p align="center">
  <a href="https://growish-fe-1.vercel.app/" target="_blank">
    <img src="https://www.upload.ee/image/18163354/Logo.png" width="300" alt="Growish Logo" />
  </a>
</p>

## 📘 Deskripsi Proyek

Growish adalah aplikasi web yang terdiri dari dua sistem utama:

- **Labora** – Sistem Manajemen Bahan Pangan untuk **Peneliti Pangan (Researcher)**
- **LabGizi** – Sistem Manajemen Resep Makanan untuk **Ahli Gizi (Nutritionist)**

Aplikasi frontend ini dibangun menggunakan **Next.js**, dan berfungsi sebagai antarmuka pengguna untuk mengakses dan mengelola data melalui backend Growish API. Sistem menggunakan **autentikasi berbasis JWT** dan menyesuaikan tampilan serta fitur berdasarkan **peran pengguna**.

---

## 🔧 Sistem dan Fitur

### 🧪 Labora – Sistem Manajemen Bahan Pangan (Untuk Peneliti Pangan)

Peneliti Pangan dapat mengelola data bahan pangan yang akan digunakan dalam perumusan resep. Fitur-fitur utama:

#### 📦 Manajemen Bahan Pangan
- Tambah, edit, dan hapus bahan pangan
- Lihat detail kandungan nutrisi per bahan
- Upload dan ubah gambar bahan

#### 📊 Statistik dan Ringkasan
- Statistik bahan pangan dan kategori
- Statistik bahan pangan terbaru dalam 7 hari
- Statistik bahan pangan yang ditambahkan oleh pengguna saat ini
- Visualisasi distribusi kandungan utama dari setiap bahan pangan dalam bentuk diagram

---

### 🥗 LabGizi – Sistem Manajemen Resep Makanan (Untuk Ahli Gizi)

Ahli Gizi dapat menyusun resep makanan dari bahan pangan yang sudah tersedia. Fitur-fitur utama:

#### 📋 Manajemen Resep
- Buat resep dengan kombinasi bahan pangan
- Atur takaran dan jumlah bahan dalam resep
- Edit dan hapus resep

#### ⚖️ Kalkulasi Gizi Otomatis & Preview Resep
- Hitung total nilai gizi dari kombinasi bahan secara otomatis
- Lihat komposisi resep yang telah dibuat
- Lihat detail bahan pangan yang telah ditambahkan oleh peneliti pangan

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- [Next.js](https://nextjs.org/) – Framework React modern untuk aplikasi web SSR/SSG
- [TypeScript](https://www.typescriptlang.org/) – Superset JavaScript yang memberikan static typing
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework untuk styling cepat dan konsisten
- [JWT](https://jwt.io/) – JSON Web Token untuk manajemen autentikasi pengguna

### Backend (Growish API)
- [Express.js](https://expressjs.com/) – Web framework minimalis untuk Node.js
- [Supabase](https://supabase.com/) – Layanan backend sebagai pengganti Firebase (digunakan sebagai API layer)
- [PostgreSQL](https://www.postgresql.org/) – Database relasional yang digunakan di Supabase

---

## ⚙️ Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/mrcelino/growish-fe-1
cd growish-fe-1
```
### 2. Instal Dependensi
```bash
npm install
```
### 3. Konfigurasi Environment Variables
Buat file .env di root proyek:
```ini
NEXT_PUBLIC_API_URL=your-api-url
```
### 4. Jalankan Server
```bash
npm run dev
```

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
