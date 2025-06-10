import { Contact, User } from '@prisma/client'
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  toContactResponse,
  UpdateContactRequest,
} from '../model/contact.model'
import { ContactValidation } from '../validation/contact.validation'
import { prismaClient } from '../application/database'
import { HTTPException } from 'hono/http-exception'
import { Pageable } from '../model/page.model'
import { logger } from '../application/logging'

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
    request = ContactValidation.CREATE.parse(request) as CreateContactRequest

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
    contactId = ContactValidation.GET.parse(contactId) as number

    const contact = await this.contactMustExist(user, contactId)

    return toContactResponse(contact)
  }

  /**
   * Ensure that a contact exists for the user
   * @param user User who owns the contact
   * @param contactId ID of the contact to check
   * @returns Contact if found
   */
  static async contactMustExist(
    user: User,
    contactId: number
  ): Promise<Contact> {
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

    return contact
  }

  /**
   * Update an existing contact for the user
   * @param user User who is updating the contact
   * @param request Contact data to be updated
   * @returns Updated contact response
   */
  static async update(
    user: User,
    request: UpdateContactRequest
  ): Promise<ContactResponse> {
    request = ContactValidation.UPDATE.parse(request) as UpdateContactRequest

    await this.contactMustExist(user, request.id)

    const contact = await prismaClient.contact.update({
      where: {
        id: request.id,
        username: user.username,
      },
      data: request,
    })

    return toContactResponse(contact)
  }

  /**
   * Delete a contact for the user
   * @param user User who is deleting the contact
   * @param contactId ID of the contact to delete
   * @returns True if deletion was successful
   */
  static async delete(user: User, contactId: number): Promise<boolean> {
    contactId = ContactValidation.DELETE.parse(contactId) as number
    await this.contactMustExist(user, contactId)

    await prismaClient.contact.delete({
      where: {
        username: user.username,
        id: contactId,
      },
    })

    return true
  }

  /**
   * Search contacts for the user based on various criteria
   * @param user User who is searching for contacts
   * @param request Search criteria
   * @returns List of contacts matching the search criteria
   */
  static async search(
    user: User,
    request: SearchContactRequest
  ): Promise<Pageable<ContactResponse>> {
    request = ContactValidation.SEARCH.parse(request) as SearchContactRequest

    let filters = []
    if (request.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: request.name,
            },
          },
          {
            last_name: {
              contains: request.name,
            },
          },
        ],
      })
    }

    if (request.email) {
      filters.push({
        email: {
          contains: request.email,
        },
      })
    }

    if (request.phone) {
      filters.push({
        phone: {
          contains: request.phone,
        },
      })
    }

    const skip = (request.page - 1) * request.size

    const contacts = await prismaClient.contact.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: request.size,
      skip: skip,
    })

    const total = await prismaClient.contact.count({
      where: {
        username: user.username,
        AND: filters,
      },
    })

    return {
      data: contacts.map((contact) => toContactResponse(contact)),
      paging: {
        current_page: request.page,
        total_page: Math.ceil(total / request.size),
        size: request.size,
      },
    }
  }
}
