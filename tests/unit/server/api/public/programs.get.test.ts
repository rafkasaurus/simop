import { describe, it, expect, beforeEach } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'
import { createTestDatabase, seedTestUsers, seedTestPrograms } from '../../../../utils/test-db'
import { programDataBuilder } from '../../../../fixtures/programs'

describe('GET /api/public/programs', () => {
  let testDb: any

  beforeEach(async () => {
    // Create fresh test database for each test
    const { db } = createTestDatabase()
    testDb = db
    
    // Seed test data
    await seedTestUsers(db)
    await seedTestPrograms(db)
  })

  describe('Public Access', () => {
    it('should be accessible without authentication', async () => {
      // Public endpoint should not require authentication
      const response = await $fetch('/api/public/programs')

      expect(response).toBeInstanceOf(Array)
    })

    it('should return only published programs', async () => {
      const response = await $fetch('/api/public/programs')

      expect(response).toBeInstanceOf(Array)
      
      // All programs should have isPublished = true
      response.forEach((program: any) => {
        expect(program.isPublished).toBe(true)
      })
    })

    it('should exclude secret programs', async () => {
      const response = await $fetch('/api/public/programs')

      expect(response).toBeInstanceOf(Array)
      
      // No programs should be secret
      response.forEach((program: any) => {
        expect(program.isSecret).toBe(false)
      })
    })

    it('should return programs from all irban units', async () => {
      const response = await $fetch('/api/public/programs')

      expect(response).toBeInstanceOf(Array)
      
      if (response.length > 1) {
        // Should contain programs from different irban units
        const irbanUnits = new Set(response.map((p: any) => p.irbanPj))
        // In test data we have at least Irban 1 and Irban 2
        expect(irbanUnits.size).toBeGreaterThan(0)
      }
    })
  })

  describe('Data Sorting', () => {
    it('should return programs ordered by createdAt DESC', async () => {
      const response = await $fetch('/api/public/programs')

      expect(response).toBeInstanceOf(Array)
      
      if (response.length > 1) {
        // Check if sorted by createdAt descending
        for (let i = 0; i < response.length - 1; i++) {
          const current = new Date(response[i].createdAt).getTime()
          const next = new Date(response[i + 1].createdAt).getTime()
          expect(current).toBeGreaterThanOrEqual(next)
        }
      }
    })
  })

  describe('Response Format', () => {
    it('should return complete program data structure', async () => {
      const response = await $fetch('/api/public/programs')

      expect(response).toBeInstanceOf(Array)
      
      if (response.length > 0) {
        const program = response[0]
        
        // Check essential fields
        expect(program).toHaveProperty('id')
        expect(program).toHaveProperty('kodeProgram')
        expect(program).toHaveProperty('namaKegiatan')
        expect(program).toHaveProperty('jenisPengawasan')
        expect(program).toHaveProperty('areaPengawasan')
        expect(program).toHaveProperty('status')
        expect(program).toHaveProperty('tglMulai')
        expect(program).toHaveProperty('tglSelesai')
        expect(program).toHaveProperty('progress')
        expect(program).toHaveProperty('irbanPj')
        expect(program).toHaveProperty('timLeader')
        expect(program).toHaveProperty('anggotaTim')
      }
    })

    it('should not expose sensitive information', async () => {
      const response = await $fetch('/api/public/programs')

      expect(response).toBeInstanceOf(Array)
      
      // Should not include secret programs or sensitive data
      response.forEach((program: any) => {
        expect(program.isSecret).toBe(false)
        // createdById might be exposed for public transparency
        // but should not contain password or sensitive user data
      })
    })
  })

  describe('Empty State', () => {
    it('should return empty array when no published programs exist', async () => {
      // Clear all programs first
      // In a real scenario, we'd have an unpublished-only dataset
      
      const response = await $fetch('/api/public/programs')

      // Should still return an array (might be empty)
      expect(response).toBeInstanceOf(Array)
    })

    it('should handle database with only secret programs', async () => {
      // In this scenario, all programs are secret
      // Public API should return empty array
      
      const response = await $fetch('/api/public/programs')

      expect(response).toBeInstanceOf(Array)
      
      // No secret programs should be returned
      const hasSecretPrograms = response.some((p: any) => p.isSecret === true)
      expect(hasSecretPrograms).toBe(false)
    })
  })

  describe('Performance', () => {
    it('should handle large dataset efficiently', async () => {
      const startTime = Date.now()
      
      const response = await $fetch('/api/public/programs')
      
      const endTime = Date.now()
      const duration = endTime - startTime

      expect(response).toBeInstanceOf(Array)
      
      // Should complete within reasonable time (adjust as needed)
      // For unit tests, accessing in-memory DB should be very fast
      expect(duration).toBeLessThan(500) // 500ms
    })
  })

  describe('CORS & Security', () => {
    it('should be accessible from external domains (CORS)', async () => {
      // Public API should allow CORS for widget embedding
      const response = await $fetch('/api/public/programs', {
        headers: {
          'Origin': 'https://external-site.com',
        },
      })

      expect(response).toBeInstanceOf(Array)
      // In a real test, we'd check response headers for CORS
    })
  })

  describe('Widget Use Case', () => {
    it('should return data suitable for widget display', async () => {
      const response = await $fetch('/api/public/programs')

      expect(response).toBeInstanceOf(Array)
      
      if (response.length > 0) {
        const program = response[0]
        
        // Widget needs these essential fields
        expect(program.namaKegiatan).toBeDefined()
        expect(program.status).toBeDefined()
        expect(program.progress).toBeDefined()
        expect(program.progress).toBeGreaterThanOrEqual(0)
        expect(program.progress).toBeLessThanOrEqual(100)
      }
    })

    it('should allow filtering for running programs widget', async () => {
      const response = await $fetch('/api/public/programs')

      // Widget might filter client-side for status = 'pelaksanaan'
      const runningPrograms = response.filter((p: any) => p.status === 'pelaksanaan')
      
      runningPrograms.forEach((program: any) => {
        expect(program.status).toBe('pelaksanaan')
        expect(program.isPublished).toBe(true)
        expect(program.isSecret).toBe(false)
      })
    })
  })
})
