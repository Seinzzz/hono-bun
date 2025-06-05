import { User } from '@prisma/client'
import {
  ContactResponse,
  CreateContactRequest,
  toContactResponse,
} from '../model/contact.model'
import { ContactValidation } from '../validation/contact.validation'
import { prismaClient } from '../application/database'

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
    console.log(contact)
    return toContactResponse(contact)
  }
}
