import { User } from '@prisma/client'
import {
  ContactResponse,
  CreateContactRequest,
  toContactResponse,
} from '../model/contact.model'
import { ContactValidation } from '../validation/contact.validation'
import { prismaClient } from '../application/database'
import { HTTPException } from 'hono/http-exception'

export class ContactService {
  /**
   * Create a new contact for the user
   * @param user User who is creating the contact
   * @param request Contact data to be created
   * @returns Created contact response
   */
  static async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactResponse> {
    request = ContactValidation.CREATE.parse(request)

    const data = {
      ...request,
      ...{ username: user.username },
    }

    const contact = await prismaClient.contact.create({
      data: data,
    })

    return toContactResponse(contact)
  }

  /**
   * Get a contact by ID for the user
   * @param user User who is requesting the contact
   * @param contactId ID of the contact to retrieve
   * @returns
   */
  static async get(user: User, contactId: number): Promise<ContactResponse> {
    contactId = ContactValidation.GET.parse(contactId)

    const contact = await prismaClient.contact.findFirst({
      where: {
        id: contactId,
        username: user.username,
      },
    })

    if (!contact) {
      throw new HTTPException(404, {
        message: 'Contact not found',
      })
    }

    return toContactResponse(contact)
  }
}
