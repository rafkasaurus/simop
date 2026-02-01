import { faker } from '@faker-js/faker'

export interface MockProgramData {
  id?: string
  kodeProgram?: string
  namaKegiatan: string
  tujuan?: string
  jenisPengawasan: string
  areaPengawasan: string
  status?: string
  tglMulai?: Date
  tglSelesai?: Date
  realisasiTglMulai?: Date | null
  realisasiTglSelesai?: Date | null
  progress?: number
  irbanPj: string
  timLeader?: string
  anggotaTim?: string[]
  createdById?: string
  isSecret?: boolean
  isPublished?: boolean
}

/**
 * Create a single mock program
 */
export function createMockProgram(overrides?: Partial<MockProgramData>): MockProgramData {
  const id = overrides?.id || faker.string.uuid()
  const year = new Date().getFullYear()
  const irbanNum = faker.number.int({ min: 1, max: 4 })
  const seqNum = faker.number.int({ min: 1, max: 999 }).toString().padStart(3, '0')
  
  return {
    id,
    kodeProgram: `${year}-0${irbanNum}-${seqNum}`,
    namaKegiatan: faker.helpers.arrayElement([
      'Audit Keuangan Daerah',
      'Pemeriksaan APBD',
      'Audit Kinerja',
      'Evaluasi Pengelolaan Keuangan',
      'Reviu Laporan Keuangan',
    ]),
    tujuan: faker.lorem.sentence(),
    jenisPengawasan: faker.helpers.arrayElement([
      'Audit',
      'Reviu',
      'Evaluasi',
      'Pemantauan',
      'Konsultansi',
    ]),
    areaPengawasan: faker.helpers.arrayElement([
      'Keuangan',
      'Kinerja',
      'Kepegawaian',
      'Barang Milik Daerah',
      'Pelayanan Publik',
    ]),
    status: faker.helpers.arrayElement([
      'perencanaan',
      'pelaksanaan',
      'pelaporan',
      'selesai',
    ]),
    tglMulai: faker.date.future(),
    tglSelesai: faker.date.future(),
    realisasiTglMulai: null,
    realisasiTglSelesai: null,
    progress: faker.number.int({ min: 0, max: 100 }),
    irbanPj: `Irban ${irbanNum}`,
    timLeader: faker.person.fullName(),
    anggotaTim: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () =>
      faker.person.fullName()
    ),
    createdById: overrides?.createdById || faker.string.uuid(),
    isSecret: faker.datatype.boolean(),
    isPublished: faker.datatype.boolean(),
    ...overrides,
  }
}

/**
 * Create multiple mock programs
 */
export function createMockProgramArray(count: number = 5): MockProgramData[] {
  return Array.from({ length: count }, (_, index) =>
    createMockProgram({ id: `test-program-${index + 1}` })
  )
}

/**
 * Program data builder for flexible test data creation
 */
export class ProgramDataBuilder {
  private data: Partial<MockProgramData> = {}

  withId(id: string): this {
    this.data.id = id
    return this
  }

  withKodeProgram(kodeProgram: string): this {
    this.data.kodeProgram = kodeProgram
    return this
  }

  withNamaKegiatan(namaKegiatan: string): this {
    this.data.namaKegiatan = namaKegiatan
    return this
  }

  withIrbanPj(irbanPj: string): this {
    this.data.irbanPj = irbanPj
    return this
  }

  withStatus(status: string): this {
    this.data.status = status
    return this
  }

  withCreatedById(createdById: string): this {
    this.data.createdById = createdById
    return this
  }

  asSecret(): this {
    this.data.isSecret = true
    return this
  }

  asPublished(): this {
    this.data.isPublished = true
    return this
  }

  asPublic(): this {
    this.data.isSecret = false
    this.data.isPublished = true
    return this
  }

  build(): MockProgramData {
    return createMockProgram(this.data)
  }
}

/**
 * Create program data builder
 */
export function programDataBuilder(): ProgramDataBuilder {
  return new ProgramDataBuilder()
}
