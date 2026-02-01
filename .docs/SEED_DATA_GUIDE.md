# Seed Data Verification Guide

## 🎯 Test Sequence (After Deployment)

### Step 1: Check Current State
```
GET https://simop-production.up.railway.app/api/db-check
```

Expected:
```json
{
  "counts": {
    "programs": 0  ← Currently empty
  }
}
```

---

### Step 2: Run Seed
```
GET https://simop-production.up.railway.app/api/seed-programs
```

Expected:
```json
{
  "success": true,
  "message": "3 sample programs created successfully!",
  "programs": [
    {
      "id": 1,
      "kodeProgram": "PKPT-IRBAN1-01",
      "namaKegiatan": "Audit Keuangan Daerah",
      ...
    },
    ...
  ]
}
```

---

### Step 3: Verify Data Inserted
```
GET https://simop-production.up.railway.app/api/db-check
```

Expected:
```json
{
  "counts": {
    "programs": 3  ← Data NOW EXISTS!
  }
}
```

---

### Step 4: Check Public Programs
```
GET https://simop-production.up.railway.app/api/public/programs
```

Expected: 2 programs (1 is secret, won't show)
```json
[
  {
    "kodeProgram": "PKPT-IRBAN1-01",
    "namaKegiatan": "Audit Keuangan Daerah",
    "status": "selesai",
    ...
  },
  {
    "kodeProgram": "PKPT-IRBAN2-01",
    "namaKegiatan": "Review Pelaksanaan Anggaran",
    "status": "pelaksanaan",
    ...
  }
]
```

---

## 🐘 Verify in Railway Postgres Dashboard

### Via Data Tab:
1. Railway → Postgres service
2. **Data** tab
3. Select schema: `public`
4. Click table: `pkpt_program`
5. Should see **3 rows**

### Via Query:
```sql
-- Count records
SELECT COUNT(*) FROM pkpt_program;
-- Should return: 3

-- View all programs
SELECT kode_program, nama_kegiatan, status 
FROM pkpt_program 
ORDER BY id;

-- Results:
-- PKPT-IRBAN1-01 | Audit Keuangan Daerah | selesai
-- PKPT-IRBAN2-01 | Review Pelaksanaan Anggaran | pelaksanaan
-- PKPT-IRBAN3-01 | Investigasi Kasus Khusus | perencanaan
```

---

## ✅ Confirmation Checklist

- [ ] `/api/db-check` shows `programs: 0` (before seed)
- [ ] `/api/seed-programs` returns success with 3 programs
- [ ] `/api/db-check` shows `programs: 3` (after seed)
- [ ] `/api/public/programs` shows 2 programs (1 secret excluded)
- [ ] Railway Postgres Data tab shows 3 rows in `pkpt_program`
- [ ] Data persists after app restart (not temporary!)

---

## 🚨 Important Notes

### Seed Data is PERMANENT!
- Data inserted to **real PostgreSQL database**
- **NOT temporary** or in-memory
- **Same as** user creating data via UI forms
- **Will persist** across deployments and restarts

### Can Run Seed Multiple Times?
**NO!** Will cause duplicate error because `kode_program` is UNIQUE.

If you want to reset:
```sql
-- Via Railway Query tab:
DELETE FROM pkpt_program;
-- Then run seed again
```

### Production vs Development
- **Development:** Seed anytime for testing
- **Production:** Only seed ONCE for initial demo data
- **Real data:** Users create via UI forms

---

## 📊 Data Flow

```
/api/seed-programs GET request
    ↓
Execute db.insert(pkptPrograms)
    ↓
SQL: INSERT INTO pkpt_program (kode_program, nama_kegiatan, ...) 
     VALUES ('PKPT-IRBAN1-01', 'Audit Keuangan', ...)
    ↓
PostgreSQL Railway writes to disk
    ↓
Data PERMANENT in database
    ↓
Can be queried anytime via /api/public/programs
```

---

## 🎯 Summary

| Question | Answer |
|----------|--------|
| Tables exist? | ✅ YES - 5 tables created via migration |
| Data exists? | ❌ NO - `pkpt_program` is empty (0 rows) |
| Seed is temporary? | ❌ NO - Seed inserts PERMANENT data |
| Where is data stored? | PostgreSQL Railway (persistent storage) |
| Need to run seed? | ✅ YES - To populate sample data |
| Can delete seed data? | ✅ YES - Via SQL DELETE or app CRUD |
