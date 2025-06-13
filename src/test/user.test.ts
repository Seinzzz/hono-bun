import { describe, it, expect, afterEach, beforeEach } from 'bun:test'
import app from '..'
import { logger } from '../application/logging'
import { UserTest } from './test.utils'

// Register Test
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

// Login Test
describe('POST /api/users/login', () => {
  beforeEach(async () => {
    await UserTest.create()
  })

  afterEach(async () => {
    await UserTest.delete()
  })

  // when login success
  it('should be able to login', async () => {
    const response = await app.request('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'test',
        password: 'test',
      }),
    })

    const body = await response.json()
    logger.debug(body)

    expect(response.status).toBe(200)
    expect(body.data.token).toBeDefined()
  })

  // when login failed
  it('should be rejected if username is wrong', async () => {
    const response = await app.request('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'fre',
        password: 'test',
      }),
    })

    const body = await response.json()
    logger.debug(body)

    expect(response.status).toBe(401)
    expect(body.errors).toBeDefined()
  })

  it('should be rejected if password is wrong', async () => {
    const response = await app.request('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'test',
        password: 'fre',
      }),
    })

    const body = await response.json()
    logger.debug(body)

    expect(response.status).toBe(401)
    expect(body.errors).toBeDefined()
  })
})

// get test
describe('GET /api/users/current', () => {
  beforeEach(async () => {
    await UserTest.create()
  })

  afterEach(async () => {
    await UserTest.delete()
  })

  it('should be able to get user', async () => {
    const response = await app.request('/api/users/current', {
      method: 'GET',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(200)

    const body = await response.json()

    expect(body.data).toBeDefined()
    expect(body.data.username).toBe('test')
    expect(body.data.name).toBe('test')
  })
  it('should not be able to get user if token is invalid', async () => {
    const response = await app.request('/api/users/login', {
      method: 'GET',
      headers: {
        Authorization: 'salah',
      },
    })

    expect(response.status).toBe(401)

    const body = await response.json()

    expect(body.errors).toBeDefined()
  })
  it('should not be able to get user if there is no Authorization header', async () => {
    const response = await app.request('/api/users/login', {
      method: 'GET',
    })

    expect(response.status).toBe(401)

    const body = await response.json()
    logger.debug(body)

    expect(body.errors).toBeDefined()
  })
})

// update test
describe('PATCH /api/users/current', () => {
  beforeEach(async () => {
    await UserTest.create()
  })

  afterEach(async () => {
    await UserTest.delete()
  })

  it('should reject if request is invalid', async () => {
    const response = await app.request('/api/users/current', {
      method: 'PATCH',
      headers: {
        Authorization: 'test',
      },
      body: JSON.stringify({
        name: '',
        password: '',
      }),
    })

    expect(response.status).toBe(400)

    const body = await response.json()

    expect(body.errors).toBeDefined()
  })

  it('should be able to update name', async () => {
    const response = await app.request('/api/users/current', {
      method: 'PATCH',
      headers: {
        Authorization: 'test',
      },
      body: JSON.stringify({
        name: 'fre',
      }),
    })

    expect(response.status).toBe(200)

    const body = await response.json()
    // logger.error(body)

    expect(body.data).toBeDefined()
    expect(body.data.username).toBe('test')
    expect(body.data.name).toBe('fre')
  })

  it('should be able to update password', async () => {
    let response = await app.request('/api/users/current', {
      method: 'PATCH',
      headers: {
        Authorization: 'test',
      },
      body: JSON.stringify({
        password: 'fre',
      }),
    })

    expect(response.status).toBe(200)

    const body = await response.json()

    expect(body.data).toBeDefined()
    expect(body.data.username).toBe('test')

    response = await app.request('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'test',
        password: 'fre',
      }),
    })

    expect(response.status).toBe(200)
  })
})

// logout test
describe('DELETE /api/users/logout', () => {
  beforeEach(async () => {
    await UserTest.create()
  })

  afterEach(async () => {
    await UserTest.delete()
  })

  it('should be able to logout', async () => {
    const response = await app.request('/api/users/logout', {
      method: 'DELETE',
      headers: {},
    })
  })

  it('should not be able to logout', async () => {
    const response = await app.request('/api/users/logout', {
      method: 'DELETE',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(200)

    const body = await response.json()

    expect(body.data).toBe(true)
  })

  it('should not be able to logout if token is invalid', async () => {
    let response = await app.request('/api/users/logout', {
      method: 'DELETE',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(200)

    let body = await response.json()

    response = await app.request('/api/users/logout', {
      method: 'DELETE',
      headers: {
        Authorization: '',
      },
    })

    body = await response.json()

    expect(body.errors).toBeDefined()
    expect(response.status).toBe(401)
  })
})
