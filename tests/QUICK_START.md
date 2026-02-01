# 🚀 Testing Quick Start Guide

Panduan cepat untuk memulai testing di SIMOP.

## ✅ Prerequisites

1. Node.js 18+ installed
2. pnpm installed
3. SIMOP project cloned

## 📦 Step 1: Install Dependencies

Dependencies sudah ditambahkan ke [`package.json`](../package.json). Jalankan:

```bash
pnpm install
```

**Wait for installation to complete.** Ini akan menginstall:
- Vitest (unit testing)
- @nuxt/test-utils (Nuxt integration
)
- Playwright (E2E testing)
- Faker (test data generation)
- Dan library pendukung lainnya

## 🔧 Step 2: Setup Environment (Optional)

Buat file `.env.test` di root project (optional untuk basic tests):

```env
DATABASE_URL=postgresql://test:test@localhost:5432/simop_test
BETTER_AUTH_SECRET=test-secret-for-testing
NODE_ENV=test
```

## 🧪 Step 3: Run Your First Test

### Option A: Run All Tests

```bash
pnpm test
```

### Option B: Run Tests in Watch Mode (Recommended for Development)

```bash
pnpm test:watch
```

This will:
- Run tests automatically when files change
- Show real-time results
- Allow interactive filtering

### Option C: Run Specific Test File

```bash
pnpm test tests/unit/server/api/programs/index.get.test.ts
```

## 📊 Step 4: Check Coverage

Run tests with coverage report:

```bash
pnpm test:unit
```

Coverage report akan di-generate di `coverage/index.html`. Buka di browser untuk melihat:
- Overall coverage percentage
- Coverage per file
- Uncovered lines

## 🎭 Step 5: Run E2E Tests

Install Playwright browsers (first time only):

```bash
pnpm exec playwright install
```

Run E2E tests:

```bash
pnpm test:e2e
```

## 📝 Step 6: Write Your First Test

### 1. Create Test File

```bash
# Example: tests/unit/server/api/my-feature.test.ts
```

### 2. Write Test Using Example Template

```typescript
import { describe, it, expect } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'

describe('My Feature', () => {
  it('should work correctly', async () => {
    // Arrange: Setup test data
    const testData = { ... }
    
    // Act: Execute the function
    const result = await $fetch('/api/my-endpoint', {
      method: 'POST',
      body: testData,
    })
    
    // Assert: Verify the outcome
    expect(result).toBeDefined()
  })
})
```

### 3. Run Your Test

```bash
pnpm test my-feature
```

## 🎯 Common Commands

| Command | Purpose |
|---------|---------|
| `pnpm test` | Run all unit tests |
| `pnpm test:watch` | Watch mode (auto-reload) |
| `pnpm test:unit` | Run with coverage |
| `pnpm test:e2e` | Run E2E tests |
| `pnpm test my-pattern` | Run tests matching pattern |

## 📚 Next Steps

1. **Eksplor Example Tests:**
   - [`tests/unit/server/api/programs/index.get.test.ts`](unit/server/api/programs/index.get.test.ts)
   - [`tests/unit/server/api/public/programs.get.test.ts`](unit/server/api/public/programs.get.test.ts)
   - [`tests/e2e/auth.spec.ts`](e2e/auth.spec.ts)

2. **Pelajari Test Utilities:**
   - [`tests/utils/test-db.ts`](utils/test-db.ts) - Database helpers
   - [`tests/utils/test-auth.ts`](utils/test-auth.ts) - Auth helpers
   - [`tests/fixtures/programs.ts`](fixtures/programs.ts) - Test data factories

3. **Baca Dokumentasi Lengkap:**
   - [`tests/README.md`](README.md) - Comprehensive guide
   - [`TESTING.md`](../TESTING.md) - Quick reference
   - [`tests/IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md) - Progress tracker

## 🐛 Troubleshooting

### Issue: "Cannot find module"

**Solution:**
```bash
pnpm install
```

### Issue: Tests timeout

**Solution:**
Increase timeout in test:
```typescript
it('long test', async () => {
  // ...
}, 30000) // 30 seconds
```

### Issue: TypeScript errors

**Solution:**
Wait for dependencies installation to complete. TS errors will auto-resolve.

### Issue: Database connection error

**Solution:**
Tests use in-memory database (pg-mem), no real database required for unit tests.

## 💡 Tips

1. **Use Watch Mode** during development: `pnpm test:watch`
2. **Run Specific Tests** to speed up feedback: `pnpm test my-feature`
3. **Check Examples** before writing new tests
4. **Use Test Builders** from fixtures for consistent data
5. **Keep Tests Isolated** - each test should be independent

## 🆘 Need Help?

- Check [`tests/README.md`](README.md) for detailed documentation
- Review example tests for patterns
- Check Vitest docs: https://vitest.dev
- Check Playwright docs: https://playwright.dev

## ✅ Checklist

Before writing tests, ensure:

- [x] Dependencies installed (`pnpm install`)
- [x] Can run tests (`pnpm test`)
- [x] Reviewed example tests
- [x] Understand test structure
- [ ] Written first test
- [ ] Tests pass
- [ ] Coverage meets requirements

---

**Ready to start testing!** 🎉

For detailed information, see [`tests/README.md`](README.md).
