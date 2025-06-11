import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { ContactTest, UserTest } from './test.utils'
import app from '..'

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

// get contact tests
describe('GET /api/contacts/:id', () => {
  beforeEach(async () => {
    await ContactTest.deleteAll()
    await UserTest.create()
    await ContactTest.create()
  })

  afterEach(async () => {
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it('should reject if contact id is not found', async () => {
    const contact = await ContactTest.get()

    const response = await app.request(`/api/contacts/${contact.id + 1}`, {
      method: 'GET',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(404)
    const body = await response.json()

    expect(body.errors).toBeDefined()
  })

  it('should get contact if contact is exist', async () => {
    const contact = await ContactTest.get()

    const response = await app.request(`/api/contacts/${contact.id}`, {
      method: 'GET',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(200)
    const body = await response.json()

    expect(body.data.id).toBe(contact.id)
    expect(body.data.first_name).toBe(contact.first_name)
    expect(body.data.last_name).toBe(contact.last_name)
    expect(body.data.email).toBe(contact.email)
    expect(body.data.phone).toBe(contact.phone)
  })
})

// contact update tests
describe('PUT /api/contacts/:id', () => {
  beforeEach(async () => {
    await ContactTest.deleteAll()
    await UserTest.create()
    await ContactTest.create()
  })

  afterEach(async () => {
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it('should rejected update if request invalid', async () => {
    const contact = await ContactTest.get()

    const response = await app.request(`/api/contacts/${contact.id}`, {
      method: 'PUT',
      headers: {
        Authorization: 'test',
      },
      body: JSON.stringify({
        first_name: ' ', // invalid first_name cannot be empty or whitespace
      }),
    })

    expect(response.status).toBe(400)
    const body = await response.json()

    expect(body.errors).toBeDefined()
  })

  it('should reject if contact id is not found', async () => {
    const contact = await ContactTest.get()

    const response = await app.request(`/api/contacts/${contact.id + 1}`, {
      method: 'PUT',
      headers: {
        Authorization: 'test',
      },
      body: JSON.stringify({
        first_name: 'yssc',
        last_name: 'tmr',
        email: 'yssctmr@gmail.com',
        phone: '081234567890',
      }),
    })

    expect(response.status).toBe(404)
    const body = await response.json()

    expect(body.errors).toBeDefined()
  })

  it('should success update contact if request valid', async () => {
    const contact = await ContactTest.get()

    const response = await app.request(`/api/contacts/${contact.id}`, {
      method: 'PUT',
      headers: {
        Authorization: 'test',
      },
      body: JSON.stringify({
        first_name: 'yssc',
        last_name: 'tmr',
        email: 'yssctmr@gmail.com',
        phone: '081234567890',
      }),
    })

    expect(response.status).toBe(200)
    const body = await response.json()

    expect(body.data.id).toBe(contact.id)
    expect(body.data.first_name).toBe('yssc')
    expect(body.data.last_name).toBe('tmr')
    expect(body.data.email).toBe('yssctmr@gmail.com')
    expect(body.data.phone).toBe('081234567890')
  })
})

// contact delete tests
describe('DELETE /api/contacts/:id', () => {
  beforeEach(async () => {
    await ContactTest.deleteAll()
    await UserTest.create()
    await ContactTest.create()
  })

  afterEach(async () => {
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it('should reject if contact id is not found', async () => {
    const contact = await ContactTest.get()

    const response = await app.request(`/api/contacts/${contact.id + 1}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(404)
    const body = await response.json()

    expect(body.errors).toBeDefined()
  })

  it('should delete contact if contact is exist', async () => {
    const contact = await ContactTest.get()

    const response = await app.request(`/api/contacts/${contact.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(200)
    const body = await response.json()

    expect(body.data).toBeDefined()
    expect(body.data).toBe(true)
  })
})

// contact search tests
describe('GET /api/contacts', () => {
  beforeEach(async () => {
    await UserTest.create()
    await ContactTest.createMany(25)
  })

  afterEach(async () => {
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it('should be able to search contacts', async () => {
    const response = await app.request(`/api/contacts`, {
      method: 'GET',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(200)
    const body = await response.json()

    expect(body.data).toBeDefined()
    expect(body.data.length).toBe(10)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.total_page).toBe(3)
    expect(body.paging.size).toBe(10)
  })
  it('should be able to search contact using name', async () => {
    const response = await app.request(`/api/contacts?name=eya`, {
      method: 'GET',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(200)
    const body = await response.json()

    expect(body.data).toBeDefined()
    expect(body.data.length).toBe(10)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.total_page).toBe(3)
    expect(body.paging.size).toBe(10)
  })

  it('should be able to search contact using email', async () => {
    const response = await app.request(`/api/contacts?email=gmail`, {
      method: 'GET',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(200)
    const body = await response.json()

    expect(body.data).toBeDefined()
    expect(body.data.length).toBe(10)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.total_page).toBe(3)
    expect(body.paging.size).toBe(10)
  })

  it('should be able to search contact using phone', async () => {
    const response = await app.request(`/api/contacts?phone=08`, {
      method: 'GET',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(200)
    const body = await response.json()

    expect(body.data).toBeDefined()
    expect(body.data.length).toBe(10)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.total_page).toBe(3)
    expect(body.paging.size).toBe(10)
  })

  it('should be able to search without results', async () => {
    // not found by name
    let response = await app.request(`/api/contacts?name=ysc`, {
      method: 'GET',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(200)
    let body = await response.json()

    expect(body.data).toBeDefined()
    expect(body.data.length).toBe(0)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.total_page).toBe(0)
    expect(body.paging.size).toBe(10)

    // not found by email
    response = await app.request(`/api/contacts?email=ysc`, {
      method: 'GET',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(200)
    body = await response.json()

    expect(body.data).toBeDefined()
    expect(body.data.length).toBe(0)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.total_page).toBe(0)
    expect(body.paging.size).toBe(10)

    // not found by number
    response = await app.request(`/api/contacts?phone=999`, {
      method: 'GET',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(200)
    body = await response.json()

    expect(body.data).toBeDefined()
    expect(body.data.length).toBe(0)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.total_page).toBe(0)
    expect(body.paging.size).toBe(10)
  })

  it('should be able to search with paging', async () => {
    // search with size 5
    let response = await app.request(`/api/contacts?size=5`, {
      method: 'GET',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(200)
    let body = await response.json()

    expect(body.data).toBeDefined()
    expect(body.data.length).toBe(5)
    expect(body.paging.current_page).toBe(1)
    expect(body.paging.total_page).toBe(5)
    expect(body.paging.size).toBe(5)

    // search with size 5 and page 2
    response = await app.request(`/api/contacts?size=5&page=2`, {
      method: 'GET',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(200)
    body = await response.json()

    expect(body.data).toBeDefined()
    expect(body.data.length).toBe(5)
    expect(body.paging.current_page).toBe(2)
    expect(body.paging.total_page).toBe(5)
    expect(body.paging.size).toBe(5)

    // search size 5 and page 100 (should return empty data)
    response = await app.request(`/api/contacts?size=5&page=100`, {
      method: 'GET',
      headers: {
        Authorization: 'test',
      },
    })

    expect(response.status).toBe(200)
    body = await response.json()

    expect(body.data).toBeDefined()
    expect(body.data.length).toBe(0)
    expect(body.paging.current_page).toBe(100)
    expect(body.paging.total_page).toBe(5)
    expect(body.paging.size).toBe(5)
  })
})
