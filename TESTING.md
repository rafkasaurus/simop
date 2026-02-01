# SIMOP - Testing Quick Guide

Panduan singkat untuk menjalankan tests di SIMOP.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run all unit tests
pnpm test

# Run tests with coverage
pnpm test:unit

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Run all tests
pnpm test:all
```

## 📝 Test Commands

| Command | Description |
|---------|-------------|
| `pnpm test` | Run all unit tests |
| `pnpm test:unit` | Run unit tests with coverage report |
| `pnpm test:watch` | Run tests in watch mode (auto-reload) |
| `pnpm test:e2e` | Run end-to-end tests with Playwright |
| `pnpm test:all` | Run both unit & E2E tests |

## 📂 Test Structure

```
tests/
├── unit/                    # Unit tests untuk API, components, utils
│   ├── server/api/         # API endpoint tests
│   ├── components/         # Vue component tests
│   └── layouts/            # Layout component tests
├── integration/            # Integration tests (full CRUD flows)
├── e2e/                    # End-to-end tests (Playwright)
├── fixtures/               # Test data factories
├── utils/                  # Test utilities & helpers
└── setup.ts               # Global test setup
```

## ✅ Coverage Requirements

| Category | Target | Description |
|----------|--------|-------------|
| Overall | 80% | Minimum coverage untuk semua kode |
| API Endpoints | 90% | Server API harus well-tested |
| Utils | 85% | Utility functions |
| Components | 75% | Vue components |

View coverage report: `coverage/index.html` (setelah run `pnpm test:unit`)

## 🔧 Development Workflow

### 1. Write Test First (TDD)

```typescript
// tests/unit/server/api/my-feature.test.ts
describe('My Feature', () => {
  it('should do something', async () => {
    const result = await myFeature()
    expect(result).toBe('expected')
  })
})
```

### 2. Run Tests in Watch Mode

```bash
pnpm test:watch
```

### 3. Implement Feature

```typescript
// server/api/my-feature.ts
export default defineEventHandler(async (event) => {
  return 'expected'
})
```

### 4. Verify Coverage

```bash
pnpm test:unit
```

## 🧪 Writing Tests

### API Endpoint Test

```typescript
import { describe, it, expect } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'
import { createMockAdminSession } from '../../utils/test-auth'

describe('GET /api/programs', () => {
  it('should return programs for authenticated user', async () => {
    const session = createMockAdminSession()
    
    const response = await $fetch('/api/programs', {
      headers: {
        Cookie: `better-auth.session_token=${session.session.token}`,
      },
    })

    expect(response).toBeInstanceOf(Array)
  })
})
```

### Component Test

```typescript
import { mount } from '@vue/test-utils'
import MyComponent from '~/components/MyComponent.vue'

describe('MyComponent', () => {
  it('should render correctly', () => {
    const wrapper = mount(MyComponent, {
      props: { title: 'Test' },
    })
    
    expect(wrapper.text()).toContain('Test')
  })
})
```

## 🐛 Debugging Tests

### Run Specific Test File

```bash
pnpm test tests/unit/server/api/programs/index.get.test.ts
```

### Run Tests Matching Pattern

```bash
pnpm test programs
```

### Skip/Only Specific Tests

```typescript
// Run only this test
it.only('should run this test', () => { ... })

// Skip this test
it.skip('should skip this test', () => { ... })
```

### Add Console Logs

```typescript
it('should debug', async () => {
  console.log('Debug:', testData)
  const result = await someFunction()
  console.log('Result:', result)
  expect(result).toBeDefined()
})
```

## 📊 CI/CD Integration

Tests otomatis berjalan di CI/CD pipeline untuk:
- ✅ Every commit
- ✅ Every pull request
- ✅ Before deployment

Pipeline akan fail jika:
- ❌ Ada test yang gagal
- ❌ Coverage turun dibawah threshold
- ❌ Ada linter errors

## 🆘 Troubleshooting

### "Cannot find module" Error

```bash
# Re-install dependencies
pnpm install
```

### Tests Timeout

```typescript
// Increase timeout
it('long running test', async () => {
  // ...
}, 30000) // 30 seconds
```

### Database Errors

Check `.env.test` file dan pastikan test database ada.

### Flaky Tests

- Reset database state di `beforeEach`
- Avoid time-dependent tests
- Use deterministic test data

## 📚 Documentation

For detailed documentation, see [`tests/README.md`](tests/README.md)

## 🔗 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Nuxt Testing Guide](https://nuxt.com/docs/getting-started/testing)
- [Playwright Documentation](https://playwright.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)

## 📝 Best Practices

1. ✅ **Test Isolation** - Each test should be independent
2. ✅ **Descriptive Names** - Test names should clearly describe what they test
3. ✅ **AAA Pattern** - Arrange, Act, Assert
4. ✅ **Mock External** - Don't hit real APIs/databases in unit tests
5. ✅ **Fast Tests** - Unit tests should run quickly (<5s)
6. ✅ **Coverage** - Maintain minimum coverage thresholds
7. ✅ **Edge Cases** - Test both happy paths and error cases

## 🎯 Definition of Done

Feature dianggap complete jika:

- ✅ All tests pass
- ✅ Coverage meets requirements (≥80%)
- ✅ No linter errors
- ✅ E2E tests for critical flows pass
- ✅ Documentation updated
- ✅ Code reviewed

---

**Questions?** Check [`tests/README.md`](tests/README.md) for comprehensive guide.
