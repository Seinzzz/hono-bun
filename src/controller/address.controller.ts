import { Hono } from 'hono'
import { ApplicationVariables } from '../model/app.model'
import { authMiddleware } from '../middleware/auth.middleware'
import { User } from '@prisma/client'
import { AddressService } from '../service/address.service'
import {
  CreateAddressRequest,
  GetAddressRequest,
  UpdateAddressRequest,
} from '../model/address.model'

export const addressController = new Hono<{
  Variables: ApplicationVariables
}>()

// authMiddleware is applied to all routes in addressController
addressController.use(authMiddleware)

// Create address for a specific contact
addressController.post('/api/contacts/:contact_id/addresses', async (c) => {
  const user = c.get('user') as User
  const contactId = Number(c.req.param('contact_id'))
  const request = (await c.req.json()) as CreateAddressRequest

  request.contact_id = contactId

  const response = await AddressService.create(user, request)

  return c.json({
    data: response,
  })
})

// Get details address
addressController.get(
  '/api/contacts/:contact_id/addresses/:address_id',
  async (c) => {
    const user = c.get('user') as User

    const request: GetAddressRequest = {
      contact_id: Number(c.req.param('contact_id')),
      id: Number(c.req.param('address_id')),
    }

    const response = await AddressService.get(user, request)

    return c.json({
      data: response,
    })
  }
)

// Update address for a specific contact
addressController.put(
  '/api/contacts/:contact_id/addresses/:address_id',
  async (c) => {
    const user = c.get('user') as User
    const contactId = Number(c.req.param('contact_id'))
    const addressId = Number(c.req.param('address_id'))
    const request = (await c.req.json()) as UpdateAddressRequest

    request.contact_id = contactId
    request.id = addressId

    const response = await AddressService.update(user, request)

    return c.json({
      data: response,
    })
  }
)
