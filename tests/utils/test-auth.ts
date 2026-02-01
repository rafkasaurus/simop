import type { Session } from 'better-auth/types'

/**
 * Create a mock admin session for testing
 */
export function createMockAdminSession(): Session {
  return {
    session: {
      id: 'mock-session-admin',
      userId: 'test-admin-1',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      token: 'mock-token-admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
    },
    user: {
      id: 'test-admin-1',
      username: 'admin',
      name: 'Admin User',
      email: 'admin@test.com',
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'admin',
      irbanUnit: null,
    },
  }
}

/**
 * Create a mock operator session for testing
 */
export function createMockOperatorSession(irbanUnit: string = 'Irban 1'): Session {
  return {
    session: {
      id: `mock-session-operator-${irbanUnit.toLowerCase().replace(/\s/g, '-')}`,
      userId: `test-operator-${irbanUnit.toLowerCase().replace(/\s/g, '-')}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      token: `mock-token-operator-${irbanUnit.toLowerCase().replace(/\s/g, '-')}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
    },
    user: {
      id: `test-operator-${irbanUnit.toLowerCase().replace(/\s/g, '-')}`,
      username: `operator_${irbanUnit.toLowerCase().replace(/\s/g, '_')}`,
      name: `Operator ${irbanUnit}`,
      email: `operator${irbanUnit.toLowerCase().replace(/\s/g, '')}@test.com`,
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'operator',
      irbanUnit,
    },
  }
}

/**
 * Create a null session (unauthenticated)
 */
export function createMockUnauthorizedSession(): null {
  return null
}

/**
 * Create mock auth headers for requests
 */
export function mockAuthHeaders(session: Session | null): Record<string, string> {
  if (!session) {
    return {}
  }
  
  return {
    'Authorization': `Bearer ${session.session.token}`,
    'Cookie': `better-auth.session_token=${session.session.token}`,
  }
}

/**
 * Mock the auth session for testing
 */
export function mockAuthSession(session: Session | null) {
  // This would be used to mock the auth() function in tests
  return {
    session: session?.session || null,
    user: session?.user || null,
  }
}
