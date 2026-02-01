import { beforeAll, afterAll, afterEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

// Setup Nuxt test environment
beforeAll(async () => {
  await setup({
    // Test context options
    rootDir: process.cwd(),
    browser: false,
    server: true,
  })
})

// Cleanup after each test
afterEach(() => {
  // Clear any test data or reset state if needed
})

// Cleanup after all tests
afterAll(async () => {
  //await cleanupTestDatabase()
})
