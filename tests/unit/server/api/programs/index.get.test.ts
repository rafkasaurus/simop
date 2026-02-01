import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { createTestDatabase, seedTestUsers, seedTestPrograms, seedTestAccounts } from '../../../../utils/test-db'
import { createMockAdminSession, createMockOperatorSession } from '../../../../utils/test-auth'

describe('GET /api/programs', () => {
  let testDb: any

  beforeEach(async () => {
    // Create fresh test database for each test
    const { db } = createTestDatabase()
    testDb = db
    
    // Seed test data
    await seedTestUsers(db)
    await seedTestAccounts(db)
    await seedTestPrograms(db)
  })

  describe('Authentication', () => {
    it('should return 401 for unauthenticated requests', async () => {
      try {
        await $fetch('/api/programs')
        expect.fail('Should have thrown an error')
      } catch (error: any) {
        expect(error.statusCode).toBe(401)
        expect(error.statusMessage).toContain('Unauthorized')
      }
    })
  })

  describe('Admin Access', () => {
    it('should return all programs for admin', async () => {
      const session = createMockAdminSession()
      
      const response = await $fetch('/api/programs', {
        headers: {
          Cookie: `better-auth.session_token=${session.session.token}`,
        },
      })

      expect(response).toBeInstanceOf(Array)
      expect(response.length).toBeGreaterThan(0)
    })

    it('should filter programs by irbanPj when query parameter is provided', async () => {
      const session = createMockAdminSession()
      const targetIrban = 'Irban 1'
      
      const response = await $fetch(`/api/programs?irbanPj=${targetIrban}`, {
        headers: {
          Cookie: `better-auth.session_token=${session.session.token}`,
        },
      })

      expect(response).toBeInstanceOf(Array)
      response.forEach((program: any) => {
        expect(program.irbanPj).toBe(targetIrban)
      })
    })

    it('should return programs ordered by createdAt DESC', async () => {
      const session = createMockAdminSession()
      
      const response = await $fetch('/api/programs', {
        headers: {
          Cookie: `better-auth.session_token=${session.session.token}`,
        },
      })

      expect(response).toBeInstanceOf(Array)
      
      // Check if sorted by createdAt descending
      for (let i = 0; i < response.length - 1; i++) {
        const current = new Date(response[i].createdAt).getTime()
        const next = new Date(response[i + 1].createdAt).getTime()
        expect(current).toBeGreaterThanOrEqual(next)
      }
    })
  })

  describe('Operator Access', () => {
    it('should only return programs for operator irbanUnit', async () => {
      const session = createMockOperatorSession('Irban 1')
      
      const response = await $fetch('/api/programs', {
        headers: {
          Cookie: `better-auth.session_token=${session.session.token}`,
        },
      })

      expect(response).toBeInstanceOf(Array)
      response.forEach((program: any) => {
        expect(program.irbanPj).toBe('Irban 1')
      })
    })

    it('should not return programs from other irban units', async () => {
      const session = createMockOperatorSession('Irban 1')
      
      const response = await $fetch('/api/programs', {
        headers: {
          Cookie: `better-auth.session_token=${session.session.token}`,
        },
      })

      expect(response).toBeInstanceOf(Array)
      
      // Should not contain programs from Irban 2
      const hasOtherIrban = response.some((program: any) => program.irbanPj !== 'Irban 1')
      expect(hasOtherIrban).toBe(false)
    })

    it('should ignore irbanPj query parameter for operators', async () => {
      const session = createMockOperatorSession('Irban 1')
      
      // Try to filter for Irban 2 (should be ignored)
      const response = await $fetch('/api/programs?irbanPj=Irban 2', {
        headers: {
          Cookie: `better-auth.session_token=${session.session.token}`,
        },
      })

      expect(response).toBeInstanceOf(Array)
      
      // Should still only show Irban 1 programs
      response.forEach((program: any) => {
        expect(program.irbanPj).toBe('Irban 1')
      })
    })
  })

  describe('Data Integrity', () => {
    it('should return complete program objects with all fields', async () => {
      const session = createMockAdminSession()
      
      const response = await $fetch('/api/programs', {
        headers: {
          Cookie: `better-auth.session_token=${session.session.token}`,
        },
      })

      expect(response).toBeInstanceOf(Array)
      
      if (response.length > 0) {
        const program = response[0]
        
        // Check required fields
        expect(program).toHaveProperty('id')
        expect(program).toHaveProperty('kodeProgram')
        expect(program).toHaveProperty('namaKegiatan')
        expect(program).toHaveProperty('jenisPengawasan')
        expect(program).toHaveProperty('areaPengawasan')
        expect(program).toHaveProperty('status')
        expect(program).toHaveProperty('irbanPj')
        expect(program).toHaveProperty('progress')
        expect(program).toHaveProperty('createdAt')
        expect(program).toHaveProperty('updatedAt')
        expect(program).toHaveProperty('isSecret')
        expect(program).toHaveProperty('isPublished')
      }
    })

    it('should return empty array when no programs exist for operator irbanUnit', async () => {
      const session = createMockOperatorSession('Irban 5') // Non-existent irban
      
      const response = await $fetch('/api/programs', {
        headers: {
          Cookie: `better-auth.session_token=${session.session.token}`,
        },
      })

      expect(response).toBeInstanceOf(Array)
      expect(response.length).toBe(0)
    })
  })
})
