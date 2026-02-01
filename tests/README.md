# SIMOP Testing Guide

Dokumentasi lengkap untuk testing SIMOP (Sistem Monitoring Program).

## 📚 Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Structure](#test-structure)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

SIMOP menggunakan testing stack modern:

- **Vitest**: Unit & Integration testing framework
- **@nuxt/test-utils**: Official Nuxt testing utilities
- **Playwright**: End-to-end (E2E) testing
- **@faker-js/faker**: Generate realistic test data
- **pg-mem**: In-memory PostgreSQL database for testing

### Testing Layers

```
┌─────────────────────────────────────┐
│        E2E Tests (Playwright)       │
│  Full user flows & browser testing  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│     Integration Tests (Vitest)      │
│   API flows & database integration  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│       Unit Tests (Vitest)           │
│   Components, Utils, API endpoints  │
└─────────────────────────────────────┘
```

## Setup

### 1. Install Dependencies

Semua testing dependencies sudah ditambahkan ke `package.json`. Jalankan:

```bash
pnpm install
```

### 2. Environment Variables

Buat file `.env.test` untuk testing environment:

```env
DATABASE_URL=postgresql://test:test@localhost:5432/simop_test
BETTER_AUTH_SECRET=test-secret-key-for-testing
```

### 3. Playwright Installation

Install Playwright browsers:

```bash
pnpm exec playwright install
```

## Running Tests

### All Test Commands

```bash
# Run all unit tests
pnpm test

# Run unit tests with coverage
pnpm test:unit

# Run tests in watch mode (development)
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Run all tests (unit + E2E)
pnpm test:all
```

### Running Specific Tests

```bash
# Run specific test file
pnpm test tests/unit/server/api/programs/index.get.test.ts

# Run tests matching pattern
pnpm test programs

# Run tests for specific API endpoint
pnpm test tests/unit/server/api/programs/

# Run only E2E tests for authentication
pnpm test:e2e auth.spec.ts
```

### Watch Mode

Untuk development, gunakan watch mode:

```bash
pnpm test:watch
```

Watch mode akan:
- Re-run tests ketika file berubah
- Tampilkan summary setelah setiap run
- Allow filtering tests interactively

## Writing Tests

### Unit Test Structure

Gunakan pattern AAA (Arrange, Act, Assert):

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'

describe('Feature Name', () => {
  // Setup that runs before each test
  beforeEach(async () => {
    // Arrange: Setup test data
  })

  describe('Sub-feature', () => {
    it('should do something specific', async () => {
      // Arrange: Prepare test data
      const testData = { ... }
      
      // Act: Execute the function/endpoint
      const result = await $fetch('/api/endpoint', {
        method: 'POST',
        body: testData,
      })
      
      // Assert: Verify the outcome
      expect(result).toBeDefined()
      expect(result.status).toBe('success')
    })
  })
})
```

### API Endpoint Testing

#### GET Endpoint Example

```typescript
import { describe, it, expect } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'
import { createMockAdminSession } from '../../../utils/test-auth'

describe('GET /api/programs', () => {
  it('should return programs for authenticated admin', async () => {
    const session = createMockAdminSession()
    
    const response = await $fetch('/api/programs', {
      headers: {
        Cookie: `better-auth.session_token=${session.session.token}`,
      },
    })

    expect(response).toBeInstanceOf(Array)
    expect(response.length).toBeGreaterThan(0)
  })

  it('should return 401 for unauthenticated request', async () => {
    await expect(() => 
      $fetch('/api/programs')
    ).rejects.toThrowError(/401/)
  })
})
```

#### POST Endpoint Example

```typescript
describe('POST /api/programs/create', () => {
  it('should create new program', async () => {
    const session = createMockAdminSession()
    const newProgram = {
      namaKegiatan: 'Test Program',
      jenisPengawasan: 'Audit',
      areaPengawasan: 'Keuangan',
      irbanPj: 'Irban 1',
    }

    const response = await $fetch('/api/programs/create', {
      method: 'POST',
      body: newProgram,
      headers: {
        Cookie: `better-auth.session_token=${session.session.token}`,
      },
    })

    expect(response).toHaveProperty('id')
    expect(response.namaKegiatan).toBe(newProgram.namaKegiatan)
    expect(response.kodeProgram).toMatch(/^\d{4}-\d{2}-\d{3}$/)
  })
})
```

### Component Testing

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '~/components/MyComponent.vue'

describe('MyComponent', () => {
  it('should render correctly', () => {
    const wrapper = mount(MyComponent, {
      props: {
        title: 'Test Title',
      },
    })

    expect(wrapper.text()).toContain('Test Title')
  })

  it('should emit event on button click', async () => {
    const wrapper = mount(MyComponent)
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('submit')
  })
})
```

### Integration Test Example

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createTestDatabase } from '../utils/test-db'

describe('Programs CRUD Flow', () => {
  let testDb: any
  let createdProgramId: string

  beforeEach(async () => {
    const { db } = createTestDatabase()
    testDb = db
    await seedTestData(db)
  })

  it('should complete full CRUD cycle', async () => {
    // Create
    const created = await createProgram(testData)
    expect(created).toHaveProperty('id')
    createdProgramId = created.id

    // Read
    const fetched = await getProgram(createdProgramId)
    expect(fetched.id).toBe(createdProgramId)

    // Update
    const updated = await updateProgram(createdProgramId, {
      status: 'pelaksanaan',
    })
    expect(updated.status).toBe('pelaksanaan')

    // Delete
    await deleteProgram(createdProgramId)
    await expect(() =>
      getProgram(createdProgramId)
    ).rejects.toThrowError(/404/)
  })
})
```

## Test Structure

### Directory Layout

```
tests/
├── unit/                    # Unit tests
│   ├── server/             # Server-side tests
│   │   ├── api/           # API endpoint tests
│   │   ├── utils/         # Utility function tests
│   │   └── database/      # Database schema tests
│   ├── components/        # Vue component tests
│   └── layouts/           # Layout component tests
├── integration/            # Integration tests
│   ├── programs-crud.test.ts
│   └── users-crud.test.ts
├── e2e/                    # E2E tests
│   ├── auth.spec.ts
│   └── admin-programs.spec.ts
├── fixtures/               # Test data factories
│   ├── programs.ts
│   └── users.ts
├── utils/                  # Test utilities
│   ├── test-db.ts
│   ├── test-auth.ts
│   └── test-helpers.ts
└── setup.ts               # Global test setup
```

### File Naming Conventions

- Unit tests: `*.test.ts`
- E2E tests: `*.spec.ts`
- Test utilities: `test-*.ts`
- Fixtures: Descriptive names (e.g., `programs.ts`, `users.ts`)

## Best Practices

### 1. Test Isolation

Setiap test harus independent:

```typescript
beforeEach(async () => {
  // Reset database state
  await clearTestDatabase()
  await seedTestData()
})

afterEach(async () => {
  // Cleanup
  await clearTestDatabase()
})
```

### 2. Descriptive Test Names

❌ Bad:
```typescript
it('works', () => { ... })
```

✅ Good:
```typescript
it('should return 401 when user is not authenticated', () => { ... })
```

### 3. One Assertion Per Test

❌ Bad:
```typescript
it('should handle program creation', async () => {
  const program = await createProgram(data)
  expect(program).toBeDefined()
  expect(program.status).toBe('active')
  expect(program.kodeProgram).toMatch(/pattern/)
  expect(program.createdAt).toBeInstanceOf(Date)
})
```

✅ Good:
```typescript
describe('Program Creation', () => {
  it('should create program with valid data', async () => {
    const program = await createProgram(data)
    expect(program).toBeDefined()
  })

  it('should set default status to active', async () => {
    const program = await createProgram(data)
    expect(program.status).toBe('active')
  })

  it('should generate kodeProgram with correct format', async () => {
    const program = await createProgram(data)
    expect(program.kodeProgram).toMatch(/^\d{4}-\d{2}-\d{3}$/)
  })
})
```

### 4. Use Test Fixtures

Gunakan fixtures untuk data yang konsisten:

```typescript
import { createMockProgram } from '../../fixtures/programs'

const testProgram = createMockProgram({
  irbanPj: 'Irban 1',
  status: 'perencanaan',
})
```

### 5. Mock External Dependencies

```typescript
import { vi } from 'vitest'

vi.mock('../../utils/external-api', () => ({
  fetchExternalData: vi.fn(() => Promise.resolve({ data: 'mocked' })),
}))
```

### 6. Test Edge Cases

Selalu test:
- ✅ Happy path (normal flow)
- ✅ Error cases (invalid input, unauthorized)
- ✅ Edge cases (empty data, null values)
- ✅ Boundary conditions (min/max values)

### 7. Async/Await Handling

```typescript
// ✅ Good: Properly await async operations
it('should fetch data', async () => {
  const data = await fetchData()
  expect(data).toBeDefined()
})

// ❌ Bad: Missing await
it('should fetch data', () => {
  const data = fetchData() // Returns Promise, not actual data
  expect(data).toBeDefined()
})
```

## Coverage Requirements

Target coverage thresholds:

| Category | Target | Current |
|----------|--------|---------|
| Overall | 80% | - |
| API Endpoints | 90% | - |
| Utils | 85% | - |
| Components | 75% | - |

View coverage report:

```bash
pnpm test:unit
# Open coverage/index.html in browser
```

## Debugging Tests

### VSCode Debugging

1. Set breakpoint di test file
2. Run test dengan debugger:
   ```bash
   pnpm test --inspect-brk tests/path/to/test.ts
   ```
3. Attach VSCode debugger

### Console Debugging

```typescript
it('should debug test', async () => {
  console.log('Debug data:', testData)
  const result = await someFunction(testData)
  console.log('Result:', result)
  expect(result).toBeDefined()
})
```

### Filtering Tests

```typescript
// Run only this test
it.only('should run only this test', () => { ... })

// Skip this test
it.skip('should skip this test', () => { ... })

// Run tests matching pattern
describe.only('Programs API', () => { ... })
```

## Troubleshooting

### Common Issues

#### 1. "Cannot find module"

Pastikan dependencies sudah terinstall:
```bash
pnpm install
```

#### 2. Database Connection Errors

Check `.env.test` configuration dan ensure test database exists.

#### 3. Timeout Errors

Increase timeout di test:
```typescript
it('long running test', async () => {
  // ...
}, 30000) // 30 second timeout
```

#### 4. Flaky Tests

- Avoid time-dependent assertions
- Ensure proper cleanup between tests
- Use deterministic test data

### Getting Help

1. Check test output untuk error messages
2. Review test logs di `tests/logs/`
3. Check Vitest documentation: https://vitest.dev
4. Check Nuxt testing guide: https://nuxt.com/docs/getting-started/testing

## CI/CD Integration

Tests automatically run di CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - name: Install dependencies
        run: pnpm install
      - name: Run tests
        run: pnpm test:unit
      - name: Run E2E tests
        run: pnpm test:e2e
```

## Contributing

Saat menambahkan fitur baru:

1. ✅ Write tests first (TDD)
2. ✅ Ensure all tests pass
3. ✅ Check coverage doesn't decrease
4. ✅ Document complex test scenarios
5. ✅ Review test code sama seperti production code

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Nuxt Test Utils](https://nuxt.com/docs/getting-started/testing)
- [Playwright Documentation](https://playwright.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-testing-mistakes)

---

**Last Updated:** 2026-02-01
**Maintainer:** SIMOP Development Team
