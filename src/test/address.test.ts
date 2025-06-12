import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { AddressTest, ContactTest, UserTest } from './test.utils'
import app from '..'

// address create test
describe('POST /api/contacts/:id/addresses', () => {
  beforeEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.create()
    await ContactTest.create()
  })

  afterEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it('should rejected if request is invalid', async () => {
    const contact = await ContactTest.get()
    const response = await app.request(
      `/api/contacts/${contact.id}/addresses`,
      {
        method: 'POST',
        headers: {
          Authorization: 'test',
        },
        body: JSON.stringify({
          country: '',
          postal_code: '',
        }),
      }
    )

    expect(response.status).toBe(400)

    const body = await response.json()
    expect(body.errors).toBeDefined()
  })

  it('should rejected if contact not found', async () => {
    const contact = await ContactTest.get()
    const response = await app.request(
      `/api/contacts/${contact.id + 1}/addresses`,
      {
        method: 'POST',
        headers: {
          Authorization: 'test',
        },
        body: JSON.stringify({
          street: 'test street',
          city: 'test city',
          province: 'test province',
          country: 'test country',
          postal_code: '12345',
        }),
      }
    )

    expect(response.status).toBe(404)

    const body = await response.json()
    expect(body.errors).toBeDefined()
  })

  it('should create address successfully', async () => {
    const contact = await ContactTest.get()
    const response = await app.request(
      `/api/contacts/${contact.id}/addresses`,
      {
        method: 'POST',
        headers: {
          Authorization: 'test',
        },
        body: JSON.stringify({
          street: 'test street',
          city: 'test city',
          province: 'test province',
          country: 'test country',
          postal_code: '1437',
        }),
      }
    )

    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body.data.id).toBeDefined()
    expect(body.data.street).toBe('test street')
    expect(body.data.city).toBe('test city')
    expect(body.data.province).toBe('test province')
    expect(body.data.country).toBe('test country')
    expect(body.data.postal_code).toBe('1437')
  })
})

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()

    await UserTest.create()
    await ContactTest.create()
    await AddressTest.create()
  })

  afterEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it('should reject if address is not found', async () => {
    const contact = await ContactTest.get()
    const address = await AddressTest.get()

    const response = await app.request(
      `/api/contacts/${contact.id}/addresses/${address.id + 1}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'test',
        },
      }
    )

    expect(response.status).toBe(404)

    const body = await response.json()

    expect(body.errors).toBeDefined()
  })

  it('should success if address is exists', async () => {
    const contact = await ContactTest.get()
    const address = await AddressTest.get()

    const response = await app.request(
      `/api/contacts/${contact.id}/addresses/${address.id}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'test',
        },
      }
    )

    expect(response.status).toBe(200)

    const body = await response.json()

    expect(body.data).toBeDefined()
    expect(body.data.id).toBe(address.id)
    expect(body.data.street).toBe(address.street)
    expect(body.data.city).toBe(address.city)
    expect(body.data.province).toBe(address.province)
    expect(body.data.country).toBe(address.country)
    expect(body.data.postal_code).toBe(address.postal_code)
  })
})

describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()

    await UserTest.create()
    await ContactTest.create()
    await AddressTest.create()
  })

  afterEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it('should rejected if request is invalid', async () => {
    const contact = await ContactTest.get()
    const address = await AddressTest.get()

    const response = await app.request(
      `/api/contacts/${contact.id}/addresses/${address.id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: 'test',
        },
        body: JSON.stringify({
          country: '',
          postal_code: '',
        }),
      }
    )

    expect(response.status).toBe(400)

    const body = await response.json()

    expect(body.errors).toBeDefined()
  })
  it('should rejected if address not found', async () => {
    const contact = await ContactTest.get()
    const address = await AddressTest.get()

    const response = await app.request(
      `/api/contacts/${contact.id}/addresses/${address.id + 1}`,
      {
        method: 'PUT',
        headers: {
          Authorization: 'test',
        },
        body: JSON.stringify({
          country: 'test country',
          postal_code: '54321',
        }),
      }
    )

    expect(response.status).toBe(404)

    const body = await response.json()

    expect(body.errors).toBeDefined()
  })
  it('should success if request is valid', async () => {
    const contact = await ContactTest.get()
    const address = await AddressTest.get()

    const response = await app.request(
      `/api/contacts/${contact.id}/addresses/${address.id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: 'test',
        },
        body: JSON.stringify({
          street: '123 Main St',
          city: 'Solo',
          province: 'Central Java',
          country: 'Indonesia',
          postal_code: '12345',
        }),
      }
    )

    expect(response.status).toBe(200)

    const body = await response.json()

    expect(body.data).toBeDefined()
    expect(body.data.id).toBe(address.id)
    expect(body.data.street).toBe('123 Main St')
    expect(body.data.city).toBe('Solo')
    expect(body.data.province).toBe('Central Java')
    expect(body.data.country).toBe('Indonesia')
    expect(body.data.postal_code).toBe('12345')
  })
})
