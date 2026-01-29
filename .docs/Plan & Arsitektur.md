# **Implementation Plan: si-MOP (CodeIgniter 4 Edition)**

## **Overview**

Migrasi aplikasi **si-MOP** ke stack yang "Grounded" namun modern.

Fokus utama: **User Experience (SPA-like)**, **Estetika (Tailwind)**, dan **Kemudahan Deploy (Shared Hosting)**.

## **Tech Stack Final ✅**

* **Backend Framework**: CodeIgniter 4.x (Latest Stable)  
* **Language**: PHP 8.4 (via WAMP)  
* **Database**: MySQL / MariaDB  
* **Frontend Styling**: Tailwind CSS (via Local CLI Build)  
* **Frontend Logic**: Vanilla JS (ES6) \+ Fetch API (untuk AJAX/SPA)  
* **Deployment**: Shared Hosting (cPanel) \- Static CSS upload

## **Arsitektur Sistem**

### **1\. Struktur Folder (CI4 \+ Tailwind Setup)**

simop-ci4/  
├── app/  
│   ├── Config/              \# Konfigurasi Database, Routes  
│   ├── Controllers/  
│   │   ├── Admin/           \# Dashboard & CRUD Logic (JSON/Partial Return)  
│   │   ├── Auth.php         \# Login Logic  
│   │   └── PublicPage.php   \# Landing Page  
│   ├── Models/              \# UserModel, PkptProgramModel  
│   └── Views/  
│       ├── admin/  
│       │   ├── dashboard.php \# Container Utama (Sidebar \+ Content Div)  
│       │   ├── partials/     \# Potongan HTML (Table rows, Forms)  
│       │   └── modal.php     \# Template Modal Kosong  
│       ├── auth/             \# Login Page  
│       └── public/           \# Landing Page  
├── public/  
│   ├── css/  
│   │   ├── input.css        \# Source Tailwind (@tailwind base...)  
│   │   └── style.css        \# Output Tailwind (Generated)  
│   ├── js/  
│   │   └── admin-spa.js     \# Logic AJAX Dashboard  
│   └── index.php            \# Entry point  
├── tailwind.config.js       \# Config scan file PHP/JS  
└── .env                     \# Environment variables

### **2\. Konsep AJAX SPA & Modal (Dashboard)**

Agar tidak reload halaman saat admin bekerja:

1. **Main Container**: Halaman /admin hanya memuat Sidebar, Header, dan sebuah div id="main-content".  
2. **Data Loading**: Saat menu diklik, JS melakukan fetch() ke Controller.  
3. **Controller Response**:  
   * Untuk **Data**: Mengembalikan HTML Partial (misal: \<tr\>...\</tr\>) atau JSON.  
   * Untuk **Form**: Mengembalikan HTML Form yang siap dimasukkan ke dalam Modal.  
4. **Modal Logic**:  
   * Tombol "Tambah/Edit" memicu fetch() form.  
   * Form disubmit via AJAX POST.  
   * Jika sukses, Modal tutup & Tabel refresh otomatis.

### **3\. Strategi CSS (Local Build)**

Kita tidak menginstall Node.js di hosting.

1. **Local**: Run npx tailwindcss \-i ... \--watch saat coding.  
2. **Deploy**: Run npx tailwindcss ... \--minify sebelum upload.  
3. **Hosting**: Hanya menerima file public/css/style.css final.

## **Database Schema (Model)**

Menggunakan fitur CodeIgniter\\Model.

**PkptProgramModel Config:**

protected $table \= 'pkpt\_programs';  
protected $allowedFields \= \[  
    'kode\_program', 'nama\_kegiatan', 'irban\_penanggung\_jawab',  
    'objek\_pengawasan', 'jenis\_pengawasan', 'tgl\_mulai', 'tgl\_selesai',  
    'status', 'progres\_persen', 'is\_published'  
\];  
protected $useTimestamps \= true;

## **Deployment Plan**

1. **Build Assets**: Minify CSS di local.  
2. **Upload**: Upload folder app, public, system, writable (exclude node\_modules, .git).  
3. **Config**: Sesuaikan .env production.  
4. **Database**: Import SQL ke phpMyAdmin hosting.