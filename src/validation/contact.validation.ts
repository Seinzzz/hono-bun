import { z, ZodType } from 'zod/v4'
import { CreateContactRequest } from '../model/contact.model'

export class ContactValidation {
  static readonly CREATE: ZodType = z.object({
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.email().min(1).max(100).optional(),
    phone: z.string().min(1).max(20).optional(),
  }) satisfies z.ZodType<CreateContactRequest>

  static readonly GET: ZodType = z.number().positive()

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    first_name: z
      .string()
      .min(1)
      .max(100)
      .refine((str) => str.trim().length > 0, {
        message: 'First name cannot be empty',
      }),
    last_name: z.string().min(1).max(100).optional(),
    email: z.email().min(1).max(100).optional(),
    phone: z.string().min(1).max(20).optional(),
  })

  static readonly DELETE: ZodType = z.number().positive()

  static readonly SEARCH: ZodType = z.object({
    name: z.string().min(1).optional(),
    email: z.string().min(1).optional(),
    phone: z.string().min(1).max(20).optional(),
    page: z.number().min(1).positive(),
    size: z.number().max(50).positive(),
  })
}
