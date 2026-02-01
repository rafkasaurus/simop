import { beforeAll, afterAll, afterEach } from 'vitest'

// Global test setup - Initialize environment variables
beforeAll(async () => {
  // Set test environment variables for tests
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/simop_test'
  process.env.BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || 'test-secret-key-for-testing'
})

// Cleanup after each test
afterEach(() => {
  // Clear any test data or reset state if needed
})

// Cleanup after all tests
afterAll(async () => {
  // await cleanupTestDatabase()
})
