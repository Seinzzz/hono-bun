import { Hono } from 'hono'
import { User } from '@prisma/client'
import { ApplicationVariables } from '../model/app.model'
import { authMiddleware } from '../middleware/auth.middleware'
import {
  CreateContactRequest,
  UpdateContactRequest,
} from '../model/contact.model'
import { ContactService } from '../service/contact.service'

export const contactController = new Hono<{ Variables: ApplicationVariables }>()

// authMiddleware is applied to all routes in contactController
contactController.use(authMiddleware)

//create contact
contactController.post('/api/contacts', async (c) => {
  const user = c.get('user') as User
  const request = (await c.req.json()) as CreateContactRequest
  const response = await ContactService.create(user, request)

  return c.json({
    data: response,
  })
})

// get contact by id
contactController.get('api/contacts/:id', async (c) => {
  const user = c.get('user') as User
  const contactId = Number(c.req.param('id'))

  const response = await ContactService.get(user, contactId)

  return c.json({
    data: response,
  })
})

// update contact
contactController.put('api/contacts/:id', async (c) => {
  const user = c.get('user') as User
  const contactId = Number(c.req.param('id'))

  const request = (await c.req.json()) as UpdateContactRequest

  request.id = contactId

  const response = await ContactService.update(user, request)
  return c.json({
    data: response,
  })
})

//delete contact
contactController.delete('api/contacts/:id', async (c) => {
  const user = c.get('user') as User
  const contactId = Number(c.req.param('id'))

  const response = await ContactService.delete(user, contactId)

  return c.json({
    data: response,
  })
})
