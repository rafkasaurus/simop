import { newDb } from 'pg-mem'
import { drizzle } from 'drizzle-orm/pg-mem'
import * as schema from '../../server/database/schema'

/**
 * Create an in-memory test database
 */
export function createTestDatabase() {
  const mem = newDb()
  
  // Create the database schema
  mem.public.none(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      email_verified BOOLEAN NOT NULL DEFAULT false,
      image TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      role TEXT NOT NULL DEFAULT 'operator',
      irban_unit TEXT
    );

    CREATE TABLE sessions (
      id TEXT PRIMARY KEY,
      expires_at TIMESTAMP NOT NULL,
      token TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      user_agent TEXT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE accounts (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      access_token TEXT,
      refresh_token TEXT,
      id_token TEXT,
      access_token_expires_at TIMESTAMP,
      refresh_token_expires_at TIMESTAMP,
      scope TEXT,
      password TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(provider_id, account_id)
    );

    CREATE TABLE verification (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP,
      updated_at TIMESTAMP
    );

    CREATE TABLE pkpt_programs (
      id TEXT PRIMARY KEY,
      kode_program TEXT UNIQUE NOT NULL,
      nama_kegiatan TEXT NOT NULL,
      tujuan TEXT,
      jenis_pengawasan TEXT NOT NULL,
      area_pengawasan TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'perencanaan',
      tgl_mulai DATE,
      tgl_selesai DATE,
      realisasi_tgl_mulai DATE,
      realisasi_tgl_selesai DATE,
      progress INTEGER NOT NULL DEFAULT 0,
      irban_pj TEXT NOT NULL,
      tim_leader TEXT,
      anggota_tim TEXT[],
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_by_id TEXT REFERENCES users(id),
      is_secret BOOLEAN NOT NULL DEFAULT false,
      is_published BOOLEAN NOT NULL DEFAULT false
    );

    CREATE INDEX idx_users_username ON users(username);
    CREATE INDEX idx_users_role ON users(role);
    CREATE INDEX idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX idx_sessions_token ON sessions(token);
    CREATE INDEX idx_accounts_user_id ON accounts(user_id);
    CREATE INDEX idx_pkpt_programs_irban_pj ON pkpt_programs(irban_pj);
    CREATE INDEX idx_pkpt_programs_status ON pkpt_programs(status);
    CREATE INDEX idx_pkpt_programs_created_by_id ON pkpt_programs(created_by_id);
  `)

  const db = drizzle(mem.adapters.createPg(), { schema })
  
  return { db, mem }
}

/**
 * Clear all data from test database
 */
export function clearTestDatabase(db: any) {
  // Delete in correct order to avoid foreign key violations
  db.delete(schema.pkptPrograms)
  db.delete(schema.sessions)
  db.delete(schema.accounts)
  db.delete(schema.users)
}

/**
 * Seed test data for users
 */
export async function seedTestUsers(db: any) {
  const now = new Date()
  
  const users = [
    {
      id: 'test-admin-1',
      username: 'admin',
      name: 'Admin User',
      email: 'admin@test.com',
      emailVerified: true,
      role: 'admin',
      irbanUnit: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'test-operator-1',
      username: 'operator1',
      name: 'Operator Irban 1',
      email: 'operator1@test.com',
      emailVerified: true,
      role: 'operator',
      irbanUnit: 'Irban 1',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'test-operator-2',
      username: 'operator2',
      name: 'Operator Irban 2',
      email: 'operator2@test.com',
      emailVerified: true,
      role: 'operator',
      irbanUnit: 'Irban 2',
      createdAt: now,
      updatedAt: now,
    },
  ]

  await db.insert(schema.users).values(users)
  return users
}

/**
 * Seed test data for programs
 */
export async function seedTestPrograms(db: any) {
  const now = new Date()
  
  const programs = [
    {
      id: 'test-program-1',
      kodeProgram: '2026-01-001',
      namaKegiatan: 'Pemeriksaan Keuangan Daerah',
      tujuan: 'Audit keuangan',
      jenisPengawasan: 'Audit',
      areaPengawasan: 'Keuangan',
      status: 'perencanaan',
      tglMulai: new Date('2026-02-01'),
      tglSelesai: new Date('2026-03-01'),
      progress: 0,
      irbanPj: 'Irban 1',
      timLeader: 'John Doe',
      anggotaTim: ['Jane Doe', 'Bob Smith'],
      createdAt: now,
      updatedAt: now,
      createdById: 'test-admin-1',
      isSecret: false,
      isPublished: true,
    },
    {
      id: 'test-program-2',
      kodeProgram: '2026-02-001',
      namaKegiatan: 'Audit Internal',
      tujuan: 'Audit internal',
      jenisPengawasan: 'Audit',
      areaPengawasan: 'Internal',
      status: 'pelaksanaan',
      tglMulai: new Date('2026-02-01'),
      tglSelesai: new Date('2026-02-15'),
      progress: 50,
      irbanPj: 'Irban 2',
      timLeader: 'Alice Johnson',
      anggotaTim: ['Charlie Brown'],
      createdAt: now,
      updatedAt: now,
      createdById: 'test-operator-2',
      isSecret: true,
      isPublished: false,
    },
  ]

  await db.insert(schema.pkptPrograms).values(programs)
  return programs
}

/**
 * Create test accounts for authentication
 */
export async function seedTestAccounts(db: any) {
  const now = new Date()
  
  const accounts = [
    {
      id: 'test-account-admin-1',
      accountId: 'admin',
      providerId: 'credential',
      userId: 'test-admin-1',
      password: '$2a$10$hashedpassword', // "password" hashed
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'test-account-operator-1',
      accountId: 'operator1',
      providerId: 'credential',
      userId: 'test-operator-1',
      password: '$2a$10$hashedpassword',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'test-account-operator-2',
      accountId: 'operator2',
      providerId: 'credential',
      userId: 'test-operator-2',
      password: '$2a$10$hashedpassword',
      createdAt: now,
      updatedAt: now,
    },
  ]

  await db.insert(schema.accounts).values(accounts)
  return accounts
}
