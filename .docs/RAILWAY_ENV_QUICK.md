# 🚀 Quick Copy-Paste: Railway Environment Variables

## Variables to Add in Railway Dashboard

### 1. BETTER_AUTH_SECRET
```
UPdLn0N0YyD4WI60p/2NSE7TaOGXG8HHs/k/+C1A7gQ=
```

### 2. NUXT_SESSION_PASSWORD
```
2OPFfX9jO122JMgu8n/koJuLaBsmGCaZlkInw08rHVw=
```

### 3. BETTER_AUTH_URL
⚠️ **GANTI dengan Railway URL Anda!**
```
https://YOUR-APP-NAME.up.railway.app
```

**Cara mendapatkan Railway URL:**
- Railway Dashboard → Settings → Domains
- Copy "Railway Provided Domain"
- Tambahkan `https://` di depan

---

## Step-by-Step Railway Setup

1. **Go to Railway Dashboard**
   - railway.app/dashboard
   - Pilih project → simop service

2. **Click "Variables" tab**

3. **Add 3 variables:**

   **Variable 1:**
   - Name: `BETTER_AUTH_SECRET`
   - Value: `UPdLn0N0YyD4WI60p/2NSE7TaOGXG8HHs/k/+C1A7gQ=`

   **Variable 2:**
   - Name: `NUXT_SESSION_PASSWORD`
   - Value: `2OPFfX9jO122JMgu8n/koJuLaBsmGCaZlkInw08rHVw=`

   **Variable 3:**
   - Name: `BETTER_AUTH_URL`
   - Value: `https://` + Railway domain Anda

4. **Save** → Railway akan auto-redeploy

5. **Wait 2-5 minutes** untuk deployment selesai

---

## ✅ Checklist

- [ ] Add `BETTER_AUTH_SECRET`
- [ ] Add `NUXT_SESSION_PASSWORD`
- [ ] Add `BETTER_AUTH_URL` (dengan Railway URL yang benar)
- [ ] Verify `DATABASE_URL` sudah ada (auto dari Postgres plugin)
- [ ] Wait for redeploy to complete
- [ ] Test aplikasi di browser

---

## 🔍 How to Verify

After deployment:
1. Railway → Deployments → Latest deployment
2. Check logs untuk:
   ```
   ✅ Migrations completed successfully
   ✅ Listening on http://[::]:8080
   ```
3. Open app URL dan test login

---

**Lihat `.docs/RAILWAY_ENV_SETUP.md` untuk penjelasan lengkap.**
