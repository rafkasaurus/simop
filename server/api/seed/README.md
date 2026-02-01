# Database Seeding

## ⚠️ Important Note

**ONLY USE `/api/seed/init` (POST) for initial database seeding!**

### Proper Seeding

```bash
# Initialize database with users and programs
curl -X POST http://localhost:3000/api/seed/init
```

This will create:
- 1 Admin user: `admin` / `password123`
- 4 Operator users:
  - `operator1` / `password123` (Irban 1)
  - `operator2` / `password123` (Irban 2)
  - `operator3` / `password123` (Irban 3)
  - `operatorsus` / `password123` (Irban Khusus)
- 30 sample PKPT programs

### Why This Approach?

The `init.post.ts` endpoint uses `better-auth`'s `signUpEmail` API to create users with proper authentication records. This ensures:
1. Users are created in the `user` table
2. Password hashes are stored in the `account` table
3. Users can actually login to the system

### Deprecated Endpoints

The following endpoints are **deprecated** and should NOT be used:
- `/api/seed.get` - Creates admin without password
- `/api/seed-admin.post` - Creates admin user without proper auth
- `/api/seed-operators.get` - Creates operator users without passwords
- `/api/seed-programs.post` - Small sample, use init instead
- `/api/seed/programs.get` - **DANGEROUS**: Deletes all existing programs!

These files are kept for reference only and may be removed in future versions.

### Database Reset

If you need to completely reset the database:

1. Drop and recreate tables via migrations
2. Run the seed endpoint: `POST /api/seed/init`

### Production Seeding

For production environments:
1. Ensure DATABASE_URL is properly configured
2. Run migrations first
3. Call the seed endpoint once: `POST /api/seed/init`
4. IMMEDIATELY change the default passwords!

### Adding Custom Seed Data

To add custom programs or users:
1. Use the admin panel after seeding
2. Or extend the `init.post.ts` with your custom data
