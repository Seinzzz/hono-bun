import { Hono } from 'hono'
import { userController } from './controller/user.controller'
import { HTTPException } from 'hono/http-exception'
import { ZodError } from 'zod'
import { contactController } from './controller/contact.controller'
import { logger } from './application/logging'
import { $ZodError } from 'zod/v4/core'

const app = new Hono()

app.get('/', (c) => {
  return c.text('ok!')
})

app.route('/', userController)
app.route('/', contactController)

app.onError(async (err, c) => {
  if (err instanceof HTTPException) {
    c.status(err.status)
    return c.json({
      errors: err.message,
    })
  } else if (err instanceof $ZodError) {
    c.status(400)
    return c.json({
      errors: err.issues[0].message,
    })
  } else {
    c.status(500)
    return c.json({
      errors: err.message,
    })
  }
})

export default app
