import { Hono } from 'hono'
import { ApplicationVariables } from '../model/app.model'
import { authMiddleware } from '../middleware/auth.middleware'
import { User } from '@prisma/client'
import { AddressService } from '../service/address.service'
import { CreateAddressRequest, GetAddressRequest } from '../model/address.model'

export const addressController = new Hono<{
  Variables: ApplicationVariables
}>()

// authMiddleware is applied to all routes in addressController
addressController.use(authMiddleware)

addressController.post('/api/contacts/:id/addresses', async (c) => {
  const user = c.get('user') as User
  const contactId = Number(c.req.param('id'))
  const request = (await c.req.json()) as CreateAddressRequest

  request.contact_id = contactId

  const response = await AddressService.create(user, request)

  return c.json({
    data: response,
  })
})

addressController.get('/api/contacts/:contactId/addresses/:id', async (c) => {
  const user = c.get('user') as User

  const request: GetAddressRequest = {
    contact_id: Number(c.req.param('contactId')),
    id: Number(c.req.param('id')),
  }

  const response = await AddressService.get(user, request)

  return c.json({
    data: response,
  })
})
