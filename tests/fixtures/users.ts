import { faker } from '@faker-js/faker'

export interface MockUserData {
  id?: string
  username: string
  name: string
  email?: string
  emailVerified?: boolean
  role?: 'admin' | 'operator'
  irbanUnit?: string | null
  password?: string
}

/**
 * Create a mock admin user
 */
export function createMockAdmin(overrides?: Partial<MockUserData>): MockUserData {
  const id = overrides?.id || faker.string.uuid()
  const username = overrides?.username || faker.internet.userName().toLowerCase()
  
  return {
    id,
    username,
    name: overrides?.name || faker.person.fullName(),
    email: overrides?.email || faker.internet.email(),
    emailVerified: true,
    role: 'admin',
    irbanUnit: null,
    password: 'password123',
    ...overrides,
  }
}

/**
 * Create a mock operator user
 */
export function createMockOperator(
  irbanUnit: string = 'Irban 1',
  overrides?: Partial<MockUserData>
): MockUserData {
  const id = overrides?.id || faker.string.uuid()
  const username = overrides?.username || faker.internet.userName().toLowerCase()
  
  return {
    id,
    username,
    name: overrides?.name || faker.person.fullName(),
    email: overrides?.email || faker.internet.email(),
    emailVerified: true,
    role: 'operator',
    irbanUnit,
    password: 'password123',
    ...overrides,
  }
}

/**
 * Create multiple mock users
 */
export function createMockUserArray(count: number = 5): MockUserData[] {
  return Array.from({ length: count }, (_, index) => {
    const isAdmin = index === 0
    const irbanNum = (index % 4) + 1
    
    return isAdmin
      ? createMockAdmin({ id: `test-user-${index + 1}` })
      : createMockOperator(`Irban ${irbanNum}`, {
          id: `test-user-${index + 1}`,
        })
  })
}

/**
 * User data builder for flexible test data creation
 */
export class UserDataBuilder {
  private data: Partial<MockUserData> = {}

  withId(id: string): this {
    this.data.id = id
    return this
  }

  withUsername(username: string): this {
    this.data.username = username
    return this
  }

  withName(name: string): this {
    this.data.name = name
    return this
  }

  withEmail(email: string): this {
    this.data.email = email
    return this
  }

  asAdmin(): this {
    this.data.role = 'admin'
    this.data.irbanUnit = null
    return this
  }

  asOperator(irbanUnit: string): this {
    this.data.role = 'operator'
    this.data.irbanUnit = irbanUnit
    return this
  }

  withPassword(password: string): this {
    this.data.password = password
    return this
  }

  build(): MockUserData {
    if (this.data.role === 'admin') {
      return createMockAdmin(this.data)
    }
    return createMockOperator(this.data.irbanUnit || 'Irban 1', this.data)
  }
}

/**
 * Create user data builder
 */
export function userDataBuilder(): UserDataBuilder {
  return new UserDataBuilder()
}

/**
 * Get test credentials
 */
export function getTestCredentials() {
  return {
    admin: {
      username: 'admin',
      password: 'password123',
    },
    operator1: {
      username: 'operator1',
      password: 'password123',
    },
    operator2: {
      username: 'operator2',
      password: 'password123',
    },
  }
}
