# Railway Environment Variables Setup

## 🔐 Required Environment Variables

Berikut adalah environment variables yang **HARUS di-set** di Railway untuk aplikasi berjalan dengan benar.

---

## 📋 Environment Variables List

### 1. **DATABASE_URL** ✅ AUTO-CONFIGURED
**Status:** Automatically set by Railway Postgres plugin  
**Value:** Auto-generated connection string  
**Action:** ✅ No action needed

**Format:**
```
postgresql://user:password@host:port/database
```

---

### 2. **BETTER_AUTH_SECRET** ⚠️ MUST SET MANUALLY
**Fungsi:** Secret key untuk encrypt authentication tokens  
**Length:** Minimum 32 characters (base64 recommended)  
**Generated Value:**
```
UPdLn0N0YyD4WI60p/2NSE7TaOGXG8HHs/k/+C1A7gQ=
```

**How to Set:**
1. Railway Dashboard → Your Project → simop service
2. **Variables** tab
3. Click **+ New Variable**
4. **Name:** `BETTER_AUTH_SECRET`
5. **Value:** Copy value di atas
6. Click **Add**

---

### 3. **BETTER_AUTH_URL** ⚠️ MUST SET MANUALLY
**Fungsi:** Base URL untuk authentication callbacks dan redirects  
**Value:** Railway public URL aplikasi Anda  

**Example:**
```
https://simop-production.up.railway.app
```

**How to Get Railway URL:**
1. Railway Dashboard → Your Project → simop service
2. **Settings** tab → **Domains** section
3. Copy **Railway Provided Domain** (example: `simop-production.up.railway.app`)

**How to Set:**
1. **Variables** tab → **+ New Variable**
2. **Name:** `BETTER_AUTH_URL`
3. **Value:** `https://your-app-name.up.railway.app`
4. Click **Add**

---

### 4. **NUXT_SESSION_PASSWORD** ⚠️ MUST SET MANUALLY
**Fungsi:** Secret key untuk encrypt session cookies  
**Length:** Minimum 32 characters (base64 recommended)  
**Generated Value:**
```
2OPFfX9jO122JMgu8n/koJuLaBsmGCaZlkInw08rHVw=
```

**How to Set:**
1. **Variables** tab → **+ New Variable**
2. **Name:** `NUXT_SESSION_PASSWORD`
3. **Value:** Copy value di atas
4. Click **Add**

---

## 🚀 Quick Setup Guide

### Step-by-Step:

**1. Go to Railway Dashboard**
   - https://railway.app/dashboard
   - Select your project (simop)
   - Click on **simop service** (bukan Postgres)

**2. Navigate to Variables Tab**
   - Click **Variables** di menu kiri

**3. Add Environment Variables**

Copy-paste RAW variables (tanpa modifikasi):

```bash
BETTER_AUTH_SECRET=UPdLn0N0YyD4WI60p/2NSE7TaOGXG8HHs/k/+C1A7gQ=
NUXT_SESSION_PASSWORD=2OPFfX9jO122JMgu8n/koJuLaBsmGCaZlkInw08rHVw=
```

**4. Update BETTER_AUTH_URL**

⚠️ **IMPORTANT:** Ganti dengan Railway URL Anda!

```bash
BETTER_AUTH_URL=https://YOUR-APP-NAME.up.railway.app
```

**Cara mendapatkan Railway URL:**
- Railway → Settings → Domains
- Copy **Railway Provided Domain**
- Example: `simop-production.up.railway.app`
- Set value: `https://simop-production.up.railway.app`

**5. Save & Redeploy**
   - Railway akan **auto-redeploy** setelah variables di-save
   - Wait 2-5 minutes untuk build & deploy

---

## 📊 Verification

### After Deployment, Verify:

**1. Check Variables Tab**
```
✅ DATABASE_URL (auto-set)
✅ BETTER_AUTH_SECRET (manual)
✅ BETTER_AUTH_URL (manual)
✅ NUXT_SESSION_PASSWORD (manual)
✅ PORT (auto-set by Railway)
✅ NODE_ENV=production (auto-set)
```

**2. Check Deployment Logs**
```
✅ 🚀 Starting database migrations...
✅ ✅ Migrations completed successfully!
✅ Listening on http://[::]:8080
```

**3. Test Application**
- Open Railway public URL
- Test login/register
- Verify authentication works

---

## 🔄 How to Regenerate Secrets

Jika perlu generate secrets baru:

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Using PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Using Online Tool (NOT RECOMMENDED for production):**
- https://randomkeygen.com/
- Select "CodeIgniter Encryption Keys" (256-bit)

---

## 🛡️ Security Best Practices

### ✅ DO:
- ✅ Use different secrets for dev/staging/production
- ✅ Store secrets securely (never commit to Git)
- ✅ Rotate secrets periodically
- ✅ Use generated random strings (base64/hex)

### ❌ DON'T:
- ❌ Use simple passwords like "password123"
- ❌ Commit secrets to Git repository
- ❌ Share secrets via unsecure channels
- ❌ Reuse secrets across different apps

---

## 🧪 Local Development (.env)

Untuk development lokal, pastikan `.env` file berisi:

```bash
DATABASE_URL="postgresql://postgres:root@localhost:5433/simop_db"
BETTER_AUTH_SECRET="a_very_secret_key_1234567890_abcdefgh"
BETTER_AUTH_URL="http://localhost:3000"
NUXT_SESSION_PASSWORD="very-long-password-for-encryption-at-least-32-chars"
```

⚠️ **IMPORTANT:** Jangan gunakan values yang sama antara local dan production!

---

## 🆘 Troubleshooting

### Error: "Session encryption failed"
**Solution:** Check `NUXT_SESSION_PASSWORD` di-set dan minimal 32 characters

### Error: "Authentication failed"
**Solution:** Verify `BETTER_AUTH_SECRET` dan `BETTER_AUTH_URL` benar

### Error: "Cannot connect to database"
**Solution:** Check `DATABASE_URL` dari Postgres plugin sudah linked

### App crashes after setting variables
**Solution:** 
1. Check logs for specific error
2. Verify no typos in variable names
3. Ensure no trailing spaces in values
4. Redeploy app

---

## 📚 References

- [Better Auth Docs](https://www.better-auth.com/docs/installation)
- [Nuxt Runtime Config](https://nuxt.com/docs/guide/going-further/runtime-config)
- [Railway Environment Variables](https://docs.railway.app/guides/variables)
