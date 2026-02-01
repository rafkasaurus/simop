import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  test: {
    environment: 'node',
    // For unit tests, we use node environment
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '.nuxt/',
        '*.config.ts',
        '*.config.js',
        'migrations/',
        'server/database/migrations/',
        '.output/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/types.ts',
        'scripts/',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      include: ['server/**/*.ts', 'app/**/*.vue', 'app/**/*.ts'],
    },
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '#app': fileURLToPath(new URL('./.nuxt', import.meta.url)),
    },
  },
})
