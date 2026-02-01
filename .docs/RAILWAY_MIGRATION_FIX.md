# Fix: Database Migration on Railway

## Problem
Aplikasi di Railway bisa connect ke PostgreSQL dan command migrasi berjalan tanpa error, tapi **tidak ada tabel yang dibuat** di database.

## Root Cause
Migration SQL files ada dan lengkap di `server/database/migrations/`, tapi **migrations tidak pernah dijalankan** saat deployment. Aplikasi hanya menjalankan `node .output/server/index.mjs` tanpa run migrations terlebih dahulu.

## Solution Applied
Menambahkan **automatic migration execution** sebelum aplikasi start menggunakan Drizzle ORM's programmatic migration API.

## Changes Made

### 1. Created Migration Script (`scripts/migrate.ts`)
Script standalone untuk menjalankan Drizzle migrations secara programmatic:

```typescript
import 'dotenv/config';
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

async function runMigrations() {
    const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
    const db = drizzle(migrationClient);
    
    await migrate(db, { 
        migrationsFolder: resolve(process.cwd(), "server/database/migrations") 
    });
    
    await migrationClient.end();
}
```

### 2. Updated `package.json`
- Added `tsx` dependency untuk run TypeScript files directly
- Added `migrate` script:
  ```json
  {
    "scripts": {
      "migrate": "tsx scripts/migrate.ts"
    },
    "dependencies": {
      "tsx": "^4.19.2"
    }
  }
  ```

### 3. Modified `Dockerfile`
- Copy migration script and dependencies to production image:
  ```dockerfile
  COPY --from=builder /app/node_modules ./node_modules
  COPY --from=builder /app/scripts ./scripts
  ```
  
- Run migrations **before** starting the app:
  ```dockerfile
  CMD pnpm run migrate && node .output/server/index.mjs
  ```

## How It Works

1. **Build Stage**: Aplikasi di-build seperti biasa
2. **Production Stage**: 
   - Copy built app + migrations + scripts
   - **RUN MIGRATIONS FIRST** using `pnpm run migrate`
   - If migrations succeed ✅ → Start app
   - If migrations fail ❌ → Container exits, deployment fails (safe!)

## Deployment Steps for Railway

1. ✅ **Code sudah dipush** ke GitHub
2. 🔄 **Railway akan auto-deploy** (jika auto-deploy enabled)
3. ⏳ **Wait for build** - Railway akan:
   - Build Docker image
   - Run migrations saat container start
   - Start aplikasi jika migrations berhasil

## Verify Deployment

### Check Railway Logs
Logs yang harus terlihat:
```
🚀 Starting database migrations...
📦 Connecting to database...
📂 Migrations folder: /app/server/database/migrations
⚙️  Running migrations...
✅ Migrations completed successfully!
```

### Check Database
Via Railway Dashboard → Postgres → Database tab:
- Seharusnya muncul tables: `user`, `session`, `account`, `verification`, `pkpt_program`
- Atau via psql/SQL editor:
  ```sql
  \dt -- list all tables
  SELECT * FROM user LIMIT 1;
  ```

## Manual Migration (Alternative)
Jika perlu run migrations manual via API endpoint:
```bash
curl https://your-app.railway.app/api/migrate
```

## Rollback Plan
Jika ada masalah, rollback ke commit sebelumnya:
```bash
git revert HEAD
git push
```

## Next Steps
✅ Monitor Railway deployment logs  
✅ Verify tables dibuat di database  
✅ Test aplikasi functionality  
✅ Seed initial data jika diperlukan  

## References
- [Drizzle ORM Migrations Docs](https://orm.drizzle.team/docs/migrations)
- [Drizzle postgres-js Migrator](https://orm.drizzle.team/docs/migrations#applying-changes-to-the-database)
