import { Hono } from 'hono'
import { User } from '@prisma/client'
import { ApplicationVariables } from '../model/app.model'
import { authMiddleware } from '../middleware/auth.middleware'
import { CreateContactRequest } from '../model/contact.model'
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
