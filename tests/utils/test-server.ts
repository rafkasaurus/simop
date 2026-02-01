/**
 * Test Server Utilities
 * Utilities for testing Nuxt API handlers directly without spinning up a server
 */

import type { H3Event } from 'h3'
import { createEvent, toWebRequest } from 'h3'
import { IncomingMessage, ServerResponse } from 'node:http'
import { Readable } from 'node:stream'

/**
 * Create a mock H3Event for testing API handlers
 */
export function createMockEvent(options: {
  method?: string
  url?: string
  headers?: Record<string, string>
  body?: any
  query?: Record<string, string>
} = {}): H3Event {
  const {
    method = 'GET',
    url = '/',
    headers = {},
    body,
    query = {},
  } = options

  // Build URL with query parameters
  const urlObj = new URL(url, 'http://localhost:3000')
  Object.entries(query).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value)
  })

  // Create mock IncomingMessage
  const req = new Readable() as IncomingMessage
  req.method = method
  req.url = urlObj.pathname + urlObj.search
  req.headers = {
    host: 'localhost:3000',
    ...headers,
  }

  // Add body if provided
  if (body) {
    req.push(JSON.stringify(body))
    req.push(null)
    req.headers['content-type'] = 'application/json'
  }

  // Create mock ServerResponse
  const res = new ServerResponse(req)

  // Create H3Event
  const event = createEvent(req, res)

  return event
}

/**
 * Create mock event with authentication
 */
export function createAuthenticatedEvent(
  token: string,
  options: Parameters<typeof createMockEvent>[0] = {}
): H3Event {
  return createMockEvent({
    ...options,
    headers: {
      ...options.headers,
      cookie: `better-auth.session_token=${token}`,
    },
  })
}

/**
 * Mock session data in event context
 */
export function setMockSession(event: H3Event, session: any) {
  // @ts-ignore - setting context for testing
  event.context.session = session
}

/**
 * Extract response from H3Event
 */
export async function getEventResponse(event: H3Event): Promise<{
  status: number
  body: any
  headers: Record<string, string>
}> {
  const res = event.node.res
  
  return new Promise((resolve) => {
    let body = ''
    const chunks: Buffer[] = []

    res.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })

    res.on('end', () => {
      body = Buffer.concat(chunks).toString('utf-8')
      
      let parsedBody = body
      try {
        parsedBody = JSON.parse(body)
      } catch (e) {
        // Not JSON, keep as string
      }

      resolve({
        status: res.statusCode || 200,
        body: parsedBody,
        headers: res.getHeaders() as Record<string, string>,
      })
    })
  })
}
