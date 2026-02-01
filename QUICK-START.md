# 🚀 Quick Start Guide - E-PKPT Nuxt

## Initial Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment
Create `.env` file:
```env
DATABASE_URL=postgresql://user:password@host:port/database
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Run Migrations
```bash
pnpm db:migrate
```

### 4. Seed Database (ONE TIME ONLY!)
```bash
curl -X POST http://localhost:3000/api/seed/init

# Or using your API client (Thunder Client, Postman, etc.)
POST http://localhost:3000/api/seed/init
```

### 5. Start Development Server
```bash
pnpm dev
```

### 6. Login
Navigate to `http://localhost:3000/login`

**Default Credentials:**
- Admin: `admin` / `password123`  
- Operator 1: `operator1` / `password123`  
- Operator 2: `operator2` / `password123`  
- Operator 3: `operator3` / `password123`  
- Operator Sus: `operatorsus` / `password123`

⚠️ **IMPORTANT:** Change these passwords immediately after first login!

---

## Project Structure

```
simop/
├── app/
│   ├── pages/              # Route pages
│   │   ├── index.vue       # Home/Dashboard
│   │   ├── login.vue       # Login page
│   │   ├── publik.vue      # Public transparency page
│   │   └── admin/          # Admin-only pages
│   │       ├── index.vue   # Admin dashboard
│   │       ├── programs.vue # Program management
│   │       └── users.vue   # User management (admin only)
│   └── layouts/
│       └── admin.vue       # Admin layout
├── server/
│   ├── api/
│   │   ├── seed/
│   │   │   ├── init.post.ts ✅ USE THIS for seeding
│   │   │   └── README.md    # Seeding documentation
│   │   ├── programs/        # Program endpoints
│   │   ├── users/           # User management endpoints
│   │   └── public/          # Public API (no auth)
│   ├── database/
│   │   ├── schema.ts        # Database schema
│   │   └── migrations/      # SQL migrations
│   └── utils/
│       ├── auth.ts          # Better-auth config
│       └── drizzle.ts       # Database connection
└── lib/
    └── auth-client.ts       # Client-side auth
```

---

## API Endpoints

### Authentication
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get current session

### Programs (Authenticated)
- `GET /api/programs` - List programs (filtered by role)
- `GET /api/programs/:id` - Get single program
- `POST /api/programs/create` - Create program
- `PATCH /api/programs/:id` - Update program
- `DELETE /api/programs/:id` - Delete program

### Public
- `GET /api/public/programs` - List published non-secret programs

### Users (Admin Only)
- `GET /api/users` - List all users
- `POST /api/users/create` - Create user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Seeding
- `POST /api/seed/init` ✅ - Initialize database (use this!)

---

## User Roles & Permissions

### Admin
- ✅ View all programs from all Irban units
- ✅ Create/edit/delete any program
- ✅ Manage users (create, edit, delete)
- ✅ Set secret/rahasia status on programs
- ✅ Access to User Management page

### Operator
- ✅ View programs from their Irban unit only
- ✅ Create programs for their unit
- ✅ Edit/delete programs from their unit
- ❌ Cannot manage users
- ❌ Limited access to secret programs
- ❌ Cannot see other units' data

### Public (No Auth)
- ✅ View published programs via `/publik` page
- ❌ Cannot see secret/rahasia programs
- ❌ Cannot see draft programs
- ❌ No CRUD operations

---

## Common Tasks

### Create a New Program
1. Login as admin or operator
2. Go to "Data PKPT" menu
3. Click "Tambah Program"
4. Fill in the form:
   - Nama Kegiatan (required)
   - Objek Pengawasan (required)
   - Irban PJ (required - auto-set for operators)
   - Jenis: Regular or Riksus
   - Tanggal Mulai & Selesai
   - Status: Perencanaan/Pelaksanaan/Selesai
   - Progress percentage
   - Publish settings
5. Click "Simpan Program"

### Create a New User (Admin Only)
1. Login as admin
2. Go to "User Management" menu
3. Click "Tambah User"
4. Fill in:
   - Username (unique)
   - Password (min 6 chars)
   - Full Name
   - Role: Admin or Operator
   - Irban Unit (for operators)
5. Click "Buat User"

### Filter Programs
- Use dropdown: "Filter Unit" to filter by Irban
- Admin sees all by default
- Operators automatically filtered to their unit

---

## Troubleshooting

### Cannot Login
**Problem:** User exists but can't login  
**Cause:** User created without proper password (old buggy seed endpoints)  
**Solution:**
1. Delete the user from database
2. Re-seed using `POST /api/seed/init`
3. Or create user via admin panel

### "Programs already exist" when seeding
**Problem:** Database already has programs  
**Solution:** This is normal! New seed endpoint is non-destructive.  
If you want fresh data:
1. Drop the database
2. Re-run migrations: `pnpm db:migrate`
3. Seed again: `POST /api/seed/init`

### TypeScript Errors in Seed File
**Problem:** `Property 'users' does not exist on type '{}'`  
**Solution:** This is a TypeScript false positive. The runtime works fine.  
The drizzle schema is passed but TypeScript can't infer it properly.

### Operator Can't See Programs
**Problem:** Operator login successful but no programs shown  
**Cause:** Operator's `irbanUnit` doesn't match any program's `irbanPj`  
**Solution:** Check user's `irbanUnit` field matches program data

---

## Development Tips

### Hot Reload
Nuxt 3 has built-in hot reload:
- Frontend changes: instant
- API changes: auto-restart
- Database schema: requires manual migration

### Database Changes
When modifying [`schema.ts`](server/database/schema.ts):
1. Generate migration: `pnpm db:generate`
2. Review SQL in `migrations/` folder
3. Apply migration: `pnpm db:migrate`

### Testing Permissions
Use different browsers or incognito windows to test multiple user roles simultaneously:
- Chrome: Admin user
- Firefox: Operator user
- Incognito: Public access

---

## Production Deployment

### Environment Variables (Railway)
```env
DATABASE_URL=postgresql://... (provided by Railway Postgres)
BETTER_AUTH_SECRET=<generate-secure-random-string>
BETTER_AUTH_URL=https://your-app.railway.app
NODE_ENV=production
```

### Deploy Steps
1. Push to GitHub
2. Connect Railway to your repo
3. Add Postgres service in Railway
4. Set environment variables
5. Deploy will auto-run migrations
6. **One-time:** Call seed endpoint:
   ```bash
   curl -X POST https://your-app.railway.app/api/seed/init
   ```
7. **CRITICAL:** Login and change all default passwords!

### Security Checklist
- [ ] Change all default passwords
- [ ] Set strong `BETTER_AUTH_SECRET` (min 32 chars)
- [ ] Verify `BETTER_AUTH_URL` matches your domain
- [ ] Enable HTTPS (Railway does this automatically)
- [ ] Review user permissions
- [ ] Test in incognito: public can't access admin routes

---

## Resources

- [Nuxt 3 Docs](https://nuxt.com)
- [Better Auth Docs](https://better-auth.com)
- [DrizzleORM Docs](https://orm.drizzle.team)
- [DaisyUI Components](https://daisyui.com)
- [TailwindCSS](https://tailwindcss.com)

---

## Need Help?

1. Check [`CHANGELOG-FIXES.md`](CHANGELOG-FIXES.md) for recent changes
2. Review [`server/api/seed/README.md`](server/api/seed/README.md) for seeding issues
3. Check server logs for detailed error messages
4. TypeScript errors are often false positives - test runtime behavior

---

**Last Updated:** February 1, 2026  
**Version:** 1.0.0
