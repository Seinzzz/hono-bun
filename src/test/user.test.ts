import { describe, it, expect, afterEach } from 'bun:test'
import app from '..'
import { logger } from '../application/logging'
import { UserTest } from './test.utils'

describe('POST /api/user', () => {
  afterEach(async () => {
    UserTest.delete()
  })

  it("shouldn't register user if request is invalid ", async () => {
    const response = await app.request('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username: '',
        password: '',
        name: '',
      }),
    })

    const body = await response.json()
    logger.debug(body)

    expect(response.status).toBe(400)
    expect(body.errors).toBeDefined()
  })

  it("shouldn't register user with existing username", async () => {
    await UserTest.create()

    const response = await app.request('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username: 'test',
        password: 'test',
        name: 'test',
      }),
    })

    const body = await response.json()
    logger.debug(body)

    expect(response.status).toBe(400)
    expect(body.errors).toBeDefined()
  })

  it("shouldn't register user with existing username", async () => {
    const response = await app.request('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username: 'test',
        password: 'test',
        name: 'test',
      }),
    })

    const body = await response.json()
    logger.debug(body)

    expect(response.status).toBe(200)
    expect(body.data).toBeDefined()
    expect(body.data.username).toBe('test')
    expect(body.data.name).toBe('test')
  })
})
