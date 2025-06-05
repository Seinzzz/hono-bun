import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { ContactTest, UserTest } from './test.utils'
import app from '..'
import { logger } from '../application/logging'

// contact create tests
describe('POST /api/contacts', () => {
  beforeEach(async () => {
    await UserTest.create()
  })

  afterEach(async () => {
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it('should reject if contact invalid', async () => {
    const response = await app.request('/api/contacts', {
      method: 'POST',
      headers: {
        Authorization: 'test',
      },
      body: JSON.stringify({
        first_name: '',
      }),
    })

    expect(response.status).toBe(400)

    const body = await response.json()
    expect(body.errors).toBeDefined()
  })

  // test if contact valid (only first_name)
  it('should success if contact valid (only first_name)', async () => {
    const response = await app.request('/api/contacts', {
      method: 'POST',
      headers: {
        Authorization: 'test',
      },
      body: JSON.stringify({
        first_name: 'yssc',
      }),
    })

    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body.data.id).toBeDefined()
    expect(body.data.first_name).toBe('yssc')
    expect(body.data.last_name).toBeNull()
    expect(body.data.email).toBeNull()
    expect(body.data.phone).toBeNull()
  })

  // test if contact valid (full data)
  it('should success if contact valid (full data)', async () => {
    const response = await app.request('/api/contacts', {
      method: 'POST',
      headers: {
        Authorization: 'test',
      },
      body: JSON.stringify({
        first_name: 'yssc',
        last_name: 'tmr',
        email: 'yssctmr@email.com',
        phone: '081437777777',
      }),
    })

    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body.data.id).toBeDefined()
    expect(body.data.first_name).toBe('yssc')
    expect(body.data.last_name).toBe('tmr')
    expect(body.data.email).toBe('yssctmr@email.com')
    expect(body.data.phone).toBe('081437777777')
  })
})
