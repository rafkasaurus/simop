# Test Fixing Summary

## Problem
The tests in `tests/unit/server/api/` are written as integration tests (using `$fetch` to make HTTP requests) but configured as unit tests. This creates a mismatch:

1. **Unit tests** should mock dependencies and test functions directly
2. **Integration/E2E tests** should start a server and make real HTTP requests

## Current Errors

### Error 1: "No context is available. (Forgot calling setup or createContext?)"
- **Cause**: Tests are using `$fetch` from `@nuxt/test-utils/e2e` but proper Nuxt test context isn't initialized
- **Location**: All tests in both test files

### Error 2: "Cannot read properties of undefined (reading 'url')"  
- **Cause**: When using Nuxt environment, the test setup fails because it's trying to start a Nuxt server in unit test mode
- **Location**: vitest-environment.mjs

### Error 3: "expected undefined to be 401"
- **Cause**: Authentication test expects `statusCode` property but `$fetch` error structure is different without proper context
- **Location**: `tests/unit/server/api/programs/index.get.test.ts` line 26

## Solution Options

### Option 1: Convert to True Unit Tests (RECOMMENDED for Unit Tests)
**Effort**: Medium | **Duration**: 2-3 hours

Remove `$fetch` and test handlers directly by mocking dependencies:

```typescript
import { describe, it, expect, vi } from 'vitest'
import handler from '~/server/api/programs/index.get'

// Mock drizzle
vi.mock('~/server/utils/drizzle', () => ({
  useDrizzle: () => mockDb,
}))

// Mock auth
vi.mock('~/server/utils/auth', () => ({
  requireAuth: vi.fn(),
}))

describe('GET /api/programs', () => {
  it('should return 401 for unauthenticated requests', async () => {
    const mockEvent = createMockEvent({ url: '/api/programs' })
    const authMock = vi.mocked(requireAuth)
    authMock.mockRejectedValue(createError({ statusCode: 401 }))
    
    await expect(handler(mockEvent)).rejects.toThrow()
  })
})
```

**Pros**:
- Fast execution
- True unit tests
- No server needed
- Easy to debug

**Cons**:
- Requires rewriting all test files
- More mocking code

---

### Option 2: Move to E2E Tests (RECOMMENDED for Current Tests)
**Effort**: Low | **Duration**: 30 minutes

Move tests to `tests/e2e/api/` and use proper e2e setup:

1. Move files:
   - `tests/unit/server/api/programs/index.get.test.ts` → `tests/e2e/api/programs.spec.ts`
   - `tests/unit/server/api/public/programs.get.test.ts` → `tests/e2e/api/public-programs.spec.ts`

2. Update imports:
```typescript
import { test, expect } from '@playwright/test'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

test.describe('GET /api/programs', () => {
  test.beforeAll(async () => {
    await setup({
      server: true,
    })
  })
  
  test('should return 401', async () => {
    // ... existing test code
  })
})
```

3. Run with: `pnpm test:e2e` instead of `pnpm test`

**Pros**:
- Minimal changes needed
- Tests API as users would use it
- Catches integration issues

**Cons**:
- Slower than unit tests
- Requires server startup
- More complex CI setup

---

### Option 3: Use Supertest-style Testing
**Effort**: Medium | **Duration**: 2 hours

Use direct HTTP testing without full Nuxt:

```typescript
import { describe, it, expect } from 'vitest'
import { createApp, toNodeListener } from 'h3'
import request from 'supertest'
import programsHandler from '~/server/api/programs/index.get'

describe('GET /api/programs', () => {
  const app = createApp()
  app.use('/api/programs', programsHandler)
  const server = toNodeListener(app)
  
  it('should return 401', async () => {
    const response = await request(server)
      .get('/api/programs')
      .expect(401)
  })
})
```

**Pros**:
- Faster than full e2e
- Real HTTP requests
- Stays in vitest

**Cons**:
- Needs supertest package
- Moderate refactoring needed

---

## Immediate Fix (Quick Win)

To get tests passing quickly, choose **Option 2** (Move to E2E):

1. Rename test files to `.spec.ts`
2. Move to `tests/e2e/api/`
3. Update to use Playwright test runner
4. Update imports to use `@nuxt/test-utils/e2e` properly
5. Run with `pnpm test:e2e`

This matches how the tests are currently written and requires minimal code changes.

---

## Recommended Long-term Solution

**For this project, use a hybrid approach:**

1. **Unit tests** (`tests/unit/`) - Test business logic directly with mocks
2. **E2E tests** (`tests/e2e/`) - Test API endpoints with real HTTP requests

Current API tests should become E2E tests because they're testing the full request/response cycle.

---

## Next Steps

1. **Decide**: Which option fits your needs?
2. **Execute**: Follow the steps from chosen option
3. **Verify**: Run tests to confirm they pass
4. **Document**: Update test documentation

---

## Files to Modify

### For Option 1 (Unit Tests):
- `tests/unit/server/api/programs/index.get.test.ts` - Rewrite with mocks
- `tests/unit/server/api/public/programs.get.test.ts` - Rewrite with mocks

### For Option 2 (E2E Tests):
- Move `tests/unit/server/api/programs/index.get.test.ts`
- Move `tests/unit/server/api/public/programs.get.test.ts`
- Update vitest.config.ts to exclude moved files
- Update playwright.config.ts if needed

### For Option 3 (Supertest):
- Install: `pnpm add -D supertest @types/supertest`
- Update both test files to use supertest
- Keep in `tests/unit/`

---

## Additional Notes

- The database seeding issue mentioned in CURRENT_STATUS.md is separate
- Authentication mocking in `tests/utils/test-auth.ts` would need updates for any approach
- Consider using `@nuxt/test-utils` version compatibility issues

---

**Created**: 2026-02-01  
**Author**: Kilo Code  
**Status**: Analysis Complete - Awaiting Decision
