# **TECHNICAL DESIGN DOCUMENT (TDD)**

## **E-PKPT (Nuxt Edition)**

**Platform:** Web Application (Fullstack Nuxt 3\)

**Deployment:** Railway (Dockerized Container)

**Stack:** Nuxt 4, Vue 3, TailwindCSS \+ DaisyUI, Better Auth, Drizzle ORM, PostgreSQL

## **1\. ARSITEKTUR & STACK**

### **1.1 Core Stack**

* **Framework:** **Nuxt 4** (Menangani Frontend & Backend API).  
* **Language:** TypeScript (Wajib untuk DX terbaik di Nuxt).  
* **UI Library:** **DaisyUI** (Component class-based) \+ **TailwindCSS** (Utility).  
* **Icons:** nuxt-icon (Iconify).  
* **Build Tool:** Vite (Default Nuxt).

### **1.2 Data Layer (Backend)**

* **Server Engine:** Nitro (Built-in Nuxt).  
* **Database:** **PostgreSQL** (Rekomendasi utama di Railway).  
  * **Local Port:** 5433
  * **Username:** postgres
  * **Password:** root
* **ORM:** **Drizzle ORM** (Lebih ringan & support Better Auth).  
* **Auth:** **Better Auth** (Modern, Type-safe authentication).

### **1.3 Deployment (Docker Strategy)**

Aplikasi akan dibungkus dalam **Docker Container** untuk menjamin konsistensi lingkungan.

* **Base Image:** node:18-alpine (Ringan & Aman).  
* **Build Process:** Multi-stage build (agar image akhir kecil).  
* **Output:** Standalone server (node .output/server/index.mjs).  
* **Platform:** Railway (Deploy via Dockerfile).

## **2\. DESAIN DATABASE (DRIZZLE SCHEMA)**

Kita gunakan **Drizzle ORM** dengan definisi TypeScript.

### **2.1 Auth Tables (Better Auth Standard)**
*Otomatis digenerate oleh Better Auth (User, Session, Account, Verification).*
* **User:** id, name, email, emailVerified, image, createdAt, updatedAt, role, irbanUnit.

### **2.2 Application Tables**

```typescript
// server/database/schema.ts
import { pgTable, serial, text, integer, boolean, timestamp, date } from 'drizzle-orm/pg-core'

export const pkptPrograms = pgTable('pkpt_program', {
  id: serial('id').primaryKey(), // Auto-increment
  kodeProgram: text('kode_program').unique().notNull(), // PKPT-[IRBAN]-[000]
  namaKegiatan: text('nama_kegiatan').notNull(),
  irbanPj: text('irban_pj').notNull(), // 'irban1', 'irban2', etc
  objekPengawasan: text('objek_pengawasan').notNull(),
  jenisPengawasan: text('jenis_pengawasan').notNull(), // 'audit', 'reviu'
  tglMulai: date('tgl_mulai').notNull(),
  tglSelesai: date('tgl_selesai').notNull(),
  status: text('status').notNull(), // 'pelaksanaan', 'selesai'
  progresPersen: integer('progres_persen').default(0),
  isPublished: boolean('is_published').default(true),
  
  // Relation to User (Better Auth User Table)
  createdById: text('created_by_id').notNull(), 
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

## **3\. LOGIKA BISNIS & AUTO-NUMBERING (BARU)**

### **3.1 Format Kode Program**

Kode program akan di-generate otomatis oleh Backend saat *create* data baru untuk menjamin urutan dan format yang konsisten.

**Format:** PKPT-\[TAHUN\]-\[KODE\_IRBAN\]-\[NO\_URUT\] (Opsional Tahun agar unik tiap tahun)

*Atau sesuai request:* PKPT-\[KODE\_IRBAN\]-\[NO\_URUT\]

**Mapping Kode Irban:**

* irban1 \-\> IRBAN1  
* irban2 \-\> IRBAN2  
* irban3 \-\> IRBAN3  
* irbansus \-\> IRBANSUS

**Contoh Hasil:**

* User Irban 1 input data ke-9 \-\> PKPT-IRBAN1-009  
* User Irban 2 input data ke-15 \-\> PKPT-IRBAN2-015

### **3.2 Logika Form Frontend**

* **Field irbanPj:**  
  * Jika Login sebagai **Admin**: Dropdown bisa dipilih (Irban 1, 2, 3, Sus).  
  * Jika Login sebagai **Operator**: Field otomatis terisi (Readonly) sesuai unit kerjanya (misal: Irban 2).  
* **Field kodeProgram:**  
  * Disembunyikan atau ditampilkan sebagai *"Akan di-generate otomatis oleh sistem"* (Readonly/Disabled).

## **4\. STRUKTUR PROYEK (NUXT)**

root/  
├── server/  
│   ├── api/  
│   │   ├── auth/            \# Login/Logout logic  
│   │   ├── programs/        \# CRUD API  
│   │   │   ├── index.get.ts \# Get All  
│   │   │   └── create.post.ts \# Create \+ Auto Numbering Logic  
│   │   └── stats/           \# Endpoint Widget  
│   └── middleware/          \# Server-side auth check  
├── pages/  
│   ├── index.vue            \# Login  
│   ├── admin/               \# Layout Admin  
│   ├── publik/              \# Layout Publik  
│   └── widget/              \# Layout Embed (Clean)  
├── server/
│   ├── database/
│   │   └── schema.ts    # Drizzle Schema
│   └── utils/
│       ├── drizzle.ts   # Db Connection
│       └── auth.ts      # Better Auth Config
├── drizzle.config.ts    # Drizzle Config  
├── Dockerfile               \# Konfigurasi Docker (BARU)  
└── .dockerignore

## **5\. RENCANA IMPLEMENTASI BERBASIS FASE (20 HARI)**

Strategi ini membagi pekerjaan menjadi 4 Fase utama untuk memudahkan pelaporan capaian Latsar.

### **Fase 1: Fondasi & Arsitektur Data (Estimasi: 5 Hari)**

*Fokus: Menyiapkan "Jantung" aplikasi (Database & API).*

* **Inisiasi Project:** Setup **Nuxt 4**, Tailwind, DaisyUI, dan Git Repo.  
* **Database Setup:** Konfigurasi **Drizzle ORM** dan koneksi PostgreSQL.  
* **Auth Setup:** Integrasi **Better Auth** (Google/Email) + Setup Schema User.
* **Seeding Data:** Script seed untuk data awal.  
* **CRUD API Backend:** Membuat endpoint dasar dengan Drizzle. **Implementasi logika Auto-Numbering**.

### **Fase 2: Antarmuka Admin & Manajemen (Estimasi: 7 Hari)**

*Fokus: Membuat alat kerja untuk internal Inspektorat.*

* **Admin Layout:** Membuat Sidebar dan Navbar responsive menggunakan komponen drawer DaisyUI.  
* **Manajemen Program (Read):** Menampilkan tabel data program dengan fitur filter (per Irban) dan badge status warna-warni. Sorting default berdasarkan kodeProgram.  
* **Form Input (Create/Update):** Membuat form reaktif. Field Irban menyesuaikan role user (locked jika operator).  
* **Dashboard Overview:** Membuat halaman dashboard dengan kartu statistik sederhana.

### **Fase 3: Transparansi Publik & Integrasi (Estimasi: 4 Hari)**

*Fokus: Sisi eksternal aplikasi yang dilihat masyarakat.*

* **Halaman Publik:** Membuat halaman /publik yang modern dan bersih untuk menampilkan kegiatan yang sedang berjalan.  
* **Widget Embed:** Membuat halaman khusus /widget/running tanpa header/footer yang dirancang khusus untuk \<iframe\>.  
* **Testing Integrasi:** Mencoba memasang kode iframe widget di file HTML statis untuk mensimulasikan website Inspektorat.  
* **Privacy Check:** Memastikan kegiatan dengan flag isPublished \= false benar-benar tidak muncul di publik.

### **Fase 4: Dockerization & Deployment (Estimasi: 4 Hari)**

*Fokus: Membawa aplikasi ke lingkungan produksi (Live).*

* **Docker Setup:** Membuat Dockerfile multi-stage build untuk mengoptimalkan ukuran image.  
* **Railway Deployment:** Menghubungkan GitHub ke Railway, setup PostgreSQL Service, dan deploy Docker container.  
* **Final UAT:** Melakukan tes login, input data, dan cek widget di lingkungan production (live URL).  
* **Dokumentasi:** Screenshot bukti sistem berjalan, kode sumber, dan penyusunan laporan aktualisasi.

## **6\. SNIPPET IMPLEMENTASI (AUTO-NUMBERING)**

Berikut adalah contoh implementasi logika generate kode di `server/api/programs/create.post.ts` menggunakan **Drizzle**:

```typescript
import { useDrizzle } from '~/server/utils/drizzle'
import { pkptPrograms } from '~/server/database/schema'
import { desc, like } from 'drizzle-orm'
import { auth } from '~/server/utils/auth' // Better Auth instance

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const session = await auth.api.getSession({ headers: event.headers })
  
  if (!session) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  
  const user = session.user

  // 1. Tentukan Irban Unit
  let targetIrban = body.irbanPj
  if (user.role === 'operator') {
    targetIrban = user.irbanUnit // Paksa sesuai unit login
  }

  // 2. Mapping Prefix
  const irbanCodeMap: Record<string, string> = {
    'irban1': 'IRBAN1',
    'irban2': 'IRBAN2',
    'irban3': 'IRBAN3',
    'irbansus': 'IRBANSUS',
    'sekretariat': 'SEKRET'
  }
    
  const codePrefix = `PKPT-${irbanCodeMap[targetIrban]}-`

  // 3. Cari nomor urut terakhir untuk prefix ini
  const lastProgram = await useDrizzle().query.pkptPrograms.findFirst({
    where: (t, { like }) => like(t.kodeProgram, `${codePrefix}%`),
    orderBy: [desc(pkptPrograms.kodeProgram)]
  })

  // 4. Hitung Nomor Baru
  let newSequence = 1
  if (lastProgram) {
    const lastSeqStr = lastProgram.kodeProgram.split('-').pop()
    const lastSeqNum = parseInt(lastSeqStr || '0')
    newSequence = lastSeqNum + 1
  }

  // 5. Format Kode Baru
  const newKodeProgram = `${codePrefix}${String(newSequence).padStart(3, '0')}`

  // 6. Simpan ke DB
  const newProgram = await useDrizzle().insert(pkptPrograms).values({
    ...body,
    irbanPj: targetIrban,
    kodeProgram: newKodeProgram,
    createdById: user.id
  }).returning()

  return newProgram[0]
})
```  
