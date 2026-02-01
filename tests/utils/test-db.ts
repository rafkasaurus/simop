import { vi } from 'vitest'

/**
 * Create a mocked test database
 * This provides a simple in-memory mock for testing without real database
 */
export function createTestDatabase() {
  // Mock data storage
  const mockUsers: any[] = []
  const mockPrograms: any[] = []
  const mockAccounts: any[] = []
  
  // Create mock database with chainable query methods
  const mockDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockImplementation(() => Promise.resolve(mockPrograms)),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockImplementation((data: any) => {
      // Store data based on context
      if (Array.isArray(data)) {
        mockUsers.push(...data)
        mockPrograms.push(...data)
        mockAccounts.push(...data)
      }
      return Promise.resolve({ rowCount: 1 })
    }),
    delete: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue({ rowCount: 0 }),
    // Add direct table access for seeding
    users: mockUsers,
    pkptPrograms: mockPrograms,
    accounts: mockAccounts,
  }
  
  // Return mock db structure
  return { db: mockDb as any, mockUsers, mockPrograms, mockAccounts }
}

/**
 * Clear all data from test database
 */
export function clearTestDatabase(db: any) {
  // For mocked db, just clear arrays
  if (db.users) db.users.length = 0
  if (db.pkptPrograms) db.pkptPrograms.length = 0
  if (db.accounts) db.accounts.length = 0
}

/**
 * Seed test data for users
 * For mocked approach, we just push mock data to arrays
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

  // For mocked db, push to users array
  if (db.users) {
    db.users.push(...users)
  }
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

  // For mocked db, push to programs array
  if (db.pkptPrograms) {
    db.pkptPrograms.push(...programs)
  }
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

  // For mocked db, push to accounts array
  if (db.accounts) {
    db.accounts.push(...accounts)
  }
  return accounts
}
