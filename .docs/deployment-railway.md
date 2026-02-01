# Deployment Guide SIMOP ke Railway

Panduan lengkap untuk melakukan deployment aplikasi SIMOP (Sistem Monitoring Program) berbasis Nuxt.js dan PostgreSQL ke platform Railway.

---

## 🚀 Dua Cara Deploy

Ada **2 cara** untuk mengelola deployment ke Railway. Anda bisa memilih yang paling nyaman atau menggabungkan keduanya:

| Aspek | Via CLI (Command Line) | Via Website Dashboard |
|-------|------------------------|----------------------|
| **Cocok untuk** | Developer yang nyaman dengan terminal | Yang prefer tampilan visual & GUI |
| **Push code** | ✅ `railway up` | ✅ Auto-deploy dari GitHub |
| **Lihat logs** | ✅ `railway logs` | ✅ Tampilan real-time di browser |
| **Run command** | ✅ `railway run <command>` | ✅ Shell interaktif di browser |
| **Setup database** | ⚠️ Bisa, tapi lebih ribet | ✅ Lebih mudah (klik-klik saja) |
| **Set environment variables** | ✅ `railway variables set` | ✅ Form visual yang nyaman |
| **Monitoring resource** | ❌ Tidak tersedia | ✅ Grafik & metrics lengkap |

### Rekomendasi Penggunaan

| Step | Cara yang Disarankan | Alasan |
|------|---------------------|--------|
| Install CLI & Login | **CLI** | Lebih cepat, sekali setup |
| Inisialisasi Project | **CLI** (`railway init`) | Cepat dan langsung terhubung |
| Setup PostgreSQL | **Website Dashboard** | Visual, tinggal klik "New Database" |
| Set Environment Variables | **Website Dashboard** | Form yang nyaman, terlihat semua variable |
| Deploy aplikasi | **CLI** (`railway up`) | Cepat, tidak perlu buka browser |
| Lihat logs | **CLI** (`railway logs`) | Real-time di terminal |
| Database migration | **CLI** (`railway run npx drizzle-kit migrate`) | Langsung dari project lokal |
| Monitoring & troubleshooting | **Website Dashboard** | Lihat grafik resource, shell interaktif |

### Ringkasan Command CLI Alternatif

Semua yang bisa dilakukan di website, sebenarnya bisa juga via CLI:

```bash
# Setup database PostgreSQL via CLI
railway add --database postgres

# Set environment variables via CLI
railway variables set DATABASE_URL="postgresql://..."
railway variables set BETTER_AUTH_SECRET="your-secret-key"

# Deploy aplikasi
railway up

# Lihat logs real-time
railway logs

# Jalankan command dengan environment Railway
railway run npx drizzle-kit migrate
railway run npx drizzle-kit generate

# Buka dashboard di browser (kalau perlu GUI)
railway open
```

---

## 📋 Prasyarat

Sebelum memulai deployment, pastikan Anda memiliki:

1. **Akun Railway** - Daftar di [https://railway.app](https://railway.app)
2. **Railway CLI** - Command line interface untuk Railway
3. **Node.js** (v18+) dan **pnpm** terinstall
4. **Git** terinstall
5. **Project SIMOP** yang sudah siap untuk deployment

---

## 🚀 Langkah-langkah Deployment

### 1. Install Railway CLI

#### Windows (PowerShell)
```powershell
powershell -Command "irm https://railway.app/install.ps1 | iex"
```

#### macOS/Linux
```bash
curl -fsSL https://railway.app/install.sh | sh
```

Verifikasi instalasi:
```bash
railway --version
```

### 2. Login ke Railway

```bash
railway login
```

Perintah ini akan membuka browser untuk proses autentikasi.

### 3. Inisialisasi Project

Masuk ke direktori project SIMOP dan inisialisasi project Railway:

```bash
cd c:\Project Latsar\simop
railway init
```

Pilih opsi:
- **Create a new project** - Buat project baru di Railway

Project akan dibuat dan folder `.railway/` akan ditambahkan ke project Anda (sudah ada di `.gitignore`).

### 4. Setup PostgreSQL Database

Tambahkan service PostgreSQL ke project:

```bash
railway add --database postgres
```

Atau via Dashboard Railway:
1. Buka project di dashboard Railway
2. Klik **New** → **Database** → **Add PostgreSQL**

Setelah database dibuat, Railway akan otomatis generate `DATABASE_URL`.

### 5. Setup Environment Variables

Tambahkan semua environment variables yang diperlukan:

```bash
railway variables set DATABASE_URL="postgresql://..."
railway variables set BETTER_AUTH_SECRET="your-secret-key-min-32-chars"
railway variables set BETTER_AUTH_URL="https://your-app-name.railway.app"
railway variables set NUXT_SESSION_PASSWORD="another-secret-min-32-chars"
```

#### Penjelasan Variables:

| Variable | Deskripsi | Cara Generate |
|----------|-----------|---------------|
| `DATABASE_URL` | Connection string PostgreSQL | Otomatis dari Railway PostgreSQL |
| `BETTER_AUTH_SECRET` | Secret key untuk Better Auth | `openssl rand -hex 32` atau random string 32+ karakter |
| `BETTER_AUTH_URL` | URL aplikasi di Railway | `https://[project-name].railway.app` |
| `NUXT_SESSION_PASSWORD` | Password untuk session Nuxt | `openssl rand -hex 32` atau random string 32+ karakter |

> **Catatan:** Railway akan secara otomatis menyediakan `DATABASE_URL` saat Anda menambahkan service PostgreSQL. Anda dapat melihat nilainya di Dashboard → Project → Variables.

### 6. Update Konfigurasi Auth (trustedOrigins)

Sebelum deploy, update file [`server/utils/auth.ts`](server/utils/auth.ts:18) untuk menambahkan domain Railway ke `trustedOrigins`:

```typescript
export const auth = betterAuth({
    // ... konfigurasi database ...
    
    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        // Tambahkan URL Railway Anda
        "https://your-app-name.railway.app",
        "https://your-app-name.up.railway.app",
    ],
    
    // ... rest of config ...
});
```

**Catatan:** Ganti `your-app-name` dengan nama domain yang diberikan Railway.

### 7. Deploy Aplikasi

Lakukan deployment dengan perintah:

```bash
railway up
```

Atau deploy dari GitHub (Continuous Deployment):
1. Push project ke repository GitHub
2. Hubungkan repository di Dashboard Railway
3. Railway akan otomatis deploy setiap push ke branch main

### 8. Database Migration

Setelah aplikasi berhasil deploy, jalankan migration untuk setup database:

#### Via Railway CLI (Local dengan remote database):
```bash
railway run npx drizzle-kit migrate
```

#### Via Railway Dashboard (Shell):
1. Buka project di Dashboard Railway
2. Pilih service aplikasi
3. Klik tab **Shell**
4. Jalankan: `npx drizzle-kit migrate`

#### Generate migration baru (jika ada perubahan schema):
```bash
railway run npx drizzle-kit generate
```

### 9. Verifikasi Deployment

1. Buka URL aplikasi di browser: `https://your-app-name.railway.app`
2. Cek logs di Dashboard Railway untuk memastikan tidak ada error
3. Test fitur login dan database

---

## 🔧 Opsi: Deploy Hanya via CLI (Tanpa Buka Website)

Jika Anda ingin melakukan **semua step deployment tanpa membuka browser sama sekali**, berikut urutan command lengkapnya:

```bash
# 1. Login ke Railway (buka browser untuk autentikasi)
railway login

# 2. Inisialisasi project baru
cd c:\Project Latsar\simop
railway init
# Pilih: Create a new project

# 3. Tambahkan PostgreSQL database
railway add --database postgres

# 4. Set semua environment variables
railway variables set BETTER_AUTH_SECRET="$(openssl rand -hex 32)"
railway variables set NUXT_SESSION_PASSWORD="$(openssl rand -hex 32)"

# 5. Cek DATABASE_URL yang sudah dibuat oleh Railway
railway variables get DATABASE_URL

# 6. Update trustedOrigins di server/utils/auth.ts (manual edit file)
# Tambahkan domain Railway yang akan didapat setelah deploy

# 7. Deploy aplikasi
railway up

# 8. Lihat domain yang diberikan Railway
railway status

# 9. Update BETTER_AUTH_URL dengan domain yang benar
railway variables set BETTER_AUTH_URL="https://your-app-name.railway.app"

# 10. Jalankan database migration
railway run npx drizzle-kit migrate

# 11. Verifikasi deployment - lihat logs
railway logs
```

### Kenapa Website Dashboard Lebih Direkomendasikan untuk Beberapa Step?

| Step | Kenapa Website Lebih Mudah? |
|------|----------------------------|
| **Setup Database** | Tinggal klik "New" → "Database" → "PostgreSQL". Via CLI harus hafal command `railway add --database postgres` |
| **Set Variables** | Form visual dengan tampilan semua variable sekaligus. Via CLI harus set satu per satu |
| **Lihat DATABASE_URL** | Langsung terlihat nilai lengkapnya. Via CLI `railway variables get DATABASE_URL` terkadang terpotong |
| **Monitoring** | Grafik CPU, memory, dan network real-time. CLI tidak punya fitur ini |

### Hybrid Approach (Rekomendasi Terbaik)

Gunakan **kombinasi CLI + Website** untuk workflow tercepat:

1. **CLI**: Login, init project, deploy (`railway login`, `railway init`, `railway up`)
2. **Website**: Setup database & environment variables (lebih nyaman visual)
3. **CLI**: Migration & logs (`railway run npx drizzle-kit migrate`, `railway logs`)
4. **Website**: Monitoring dan troubleshooting (grafik resource, shell interaktif)

---

## ⚙️ Konfigurasi Tambahan

### Nuxt Config Runtime

Pastikan [`nuxt.config.ts`](nuxt.config.ts:14) sudah memiliki runtimeConfig:

```typescript
export default defineNuxtConfig({
  // ... config lainnya ...
  
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    betterAuth: {
      secret: process.env.BETTER_AUTH_SECRET,
      url: process.env.BETTER_AUTH_URL,
    }
  },
  
  // ... config lainnya ...
});
```

### Drizzle Config

File [`drizzle.config.ts`](drizzle.config.ts:1) sudah dikonfigurasi untuk membaca `DATABASE_URL`:

```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './server/database/migrations',
    schema: './server/database/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
```

---

## 🔧 Troubleshooting Umum

### 1. Error: "Database connection failed"

**Solusi:**
- Verifikasi `DATABASE_URL` sudah benar di Railway Variables
- Pastikan service PostgreSQL sudah running (tidak suspended)
- Cek network connection di Dashboard Railway

### 2. Error: "Better Auth - Invalid URL"

**Solusi:**
- Pastikan `BETTER_AUTH_URL` sudah di-set dan sesuai dengan domain Railway
- Pastikan URL menggunakan `https://` bukan `http://`

### 3. Error: "CORS / trustedOrigins"

**Solusi:**
- Tambahkan domain Railway ke `trustedOrigins` di [`server/utils/auth.ts`](server/utils/auth.ts:18)
- Pastikan tidak ada typo pada domain

### 4. Migration Error

**Solusi:**
```bash
# Cek status migrasi
railway run npx drizzle-kit check

# Push perubahan langsung (hati-hati di production!)
railway run npx drizzle-kit push

# Drop dan recreate (HANYA untuk development!)
railway run npx drizzle-kit drop
```

### 5. Build Error

**Solusi:**
- Pastikan semua dependencies terinstall: `pnpm install`
- Cek Node.js version compatibility
- Lihat build logs di Dashboard Railway untuk detail error

### 6. Service Suspended (tidak bisa start)

**Solusi:**
- Railway free tier memiliki batas usage. Upgrade ke plan berbayar atau:
- Restart service manual dari Dashboard
- Optimasi aplikasi untuk mengurangi resource usage

---

## 📝 Perintah Railway yang Berguna

| Perintah | Deskripsi |
|----------|-----------|
| `railway login` | Login ke akun Railway |
| `railway logout` | Logout dari akun Railway |
| `railway init` | Inisialisasi project baru |
| `railway up` | Deploy aplikasi ke Railway |
| `railway down` | Stop deployment |
| `railway status` | Cek status deployment |
| `railway logs` | Melihat logs aplikasi |
| `railway run <command>` | Jalankan command dengan environment Railway |
| `railway variables` | List semua environment variables |
| `railway variables set KEY=value` | Set environment variable |
| `railway variables get KEY` | Get nilai environment variable |
| `railway open` | Buka project di browser |
| `railway link` | Hubungkan ke project yang sudah ada |
| `railway disconnect` | Putuskan koneksi dari project |

---

## 🔄 Continuous Deployment (CD)

Untuk setup CD dengan GitHub:

1. Push project ke GitHub repository
2. Buka Dashboard Railway → Project Settings
3. Pilih **GitHub Repo** sebagai source
4. Pilih repository SIMOP
5. Railway akan otomatis deploy setiap push ke branch main

---

## 📚 Referensi

- [Railway Documentation](https://docs.railway.app/)
- [Nuxt Deployment Guide](https://nuxt.com/docs/getting-started/deployment)
- [Better Auth Documentation](https://www.better-auth.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

---

## 💡 Tips

1. **Gunakan Railway CLI** untuk akses cepat ke logs dan variables
2. **Setup monitoring** di Dashboard Railway untuk memantau resource usage
3. **Backup database** secara berkala menggunakan Railway PostgreSQL backups
4. **Gunakan staging environment** sebelum deploy ke production
5. **Jaga secret keys** dengan baik dan rotate secara berkala
