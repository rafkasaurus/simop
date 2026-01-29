# **Checklist Pengerjaan si-MOP (CI4 + Tailwind + SPA)**

## **Phase 1: Setup & Konfigurasi Awal**

* [x] **Install CodeIgniter 4**  
  * Download manual (ZIP) atau via Composer: composer create-project codeigniter4/appstarter simop-ci4  
* [x] **Setup Environment (.env)**  
  * Copy env jadi .env  
  * Set CI_ENVIRONMENT = development  
  * Konfigurasi Database: hostname, database, username, password.  
  * Set app.baseURL (Contoh WAMP: 'http://localhost/simop-ci4/public/').  
* [x] **Setup Tailwind CSS (Local Only)**  
  * npm init -y  
  * npm install -D tailwindcss  
  * npx tailwindcss init  
  * **Config tailwind.config.js**:  
    content: ["./app/Views/**/*.php", "./public/js/**/*.js"],

* [x] **Jalankan Development Tools**  
  * **Terminal 1 (Tailwind Watch)**:  
    npx tailwindcss -i ./public/css/input.css -o ./public/css/style.css --watch  
  * **Terminal 2 / Browser**:  
    Jika pakai WAMP, pastikan Apache jalan. Buka http://localhost/simop-ci4/public.

## **Phase 2: Database & Model**

* [x] **Buat Database** simop_db di phpMyAdmin.  
* [x] **Import Schema** (Gunakan file db.sql).  
* [x] **Buat Model**:  
  * app/Models/UserModel.php  
  * app/Models/PkptProgramModel.php

## **Phase 3: Authentication**

* [x] **Controller Auth**: Method loginView, loginAction, logout.  
* [x] **View Login**: Styling dengan Tailwind (Centered Card).  
* [x] **Auth Filter**: Proteksi route /admin.

## **Phase 4: Admin Dashboard (AJAX SPA)**

* [x] **Backend (Controller)**:  
  * index(): Load view container utama.  
  * read_data(): Return HTML baris tabel.  
  * form_add() & form_edit($id): Return HTML Form untuk modal.  
  * save() & delete(): Return JSON {status: 'ok'}.  
* [x] **Frontend (View & JS)**:  
  * dashboard.php: Layout Sidebar + Content Area + Modal Wrapper.  
  * admin-spa.js:  
    * Fungsi loadTable(): Fetch data tabel.  
    * Fungsi openModal(url): Fetch form, inject ke modal, tampilkan modal.  
    * Fungsi submitForm(e): Handle submit form via AJAX.

## **Phase 5: Styling & UI Components**

* [ ] **Tailwind Input**: Buat public/css/input.css.  
* [ ] **Styling Modal**:  
  * Backdrop gelap (bg-black/50 fixed inset-0).  
  * Box Putih (bg-white rounded-lg shadow-xl).  
  * Transisi/Animasi sederhana.  
* [ ] **Styling Sidebar**: Fixed width, full height, active state color.

## **Phase 6: Public Area**

* [ ] **Public Controller**: Read data is_published = 1.  
* [ ] **Landing Page**: Tampilkan data dalam tabel/grid card yang rapi.  
* [ ] **Widget Page**: Halaman khusus iframe (tanpa sidebar/header).

## **Phase 7: Finalisasi & Deploy**

* [ ] **Minify CSS**: npx tailwindcss -i ... -o ... --minify  
* [ ] **Konfigurasi Production**: Ubah .env (CI_ENVIRONMENT = production).  
* [ ] **Upload**: FileZilla/cPanel Upload (Ingat: index.php disesuaikan path-nya).