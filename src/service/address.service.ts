import { Address, User } from '@prisma/client'
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  toAddressResponse,
  UpdateAddressRequest,
} from '../model/address.model'
import { AddressValidation } from '../validation/address.validation'
import { prismaClient } from '../application/database'
import { ContactService } from './contact.service'
import { HTTPException } from 'hono/http-exception'

export class AddressService {
  /**
   * Create a new address for a specific contact
   * @param user User who is creating the address
   * @param request Address data to be created
   * @returns Created address response
   */
  static async create(
    user: User,
    request: CreateAddressRequest
  ): Promise<AddressResponse> {
    request = AddressValidation.CREATE.parse(request) as CreateAddressRequest

    await ContactService.contactMustExist(user, request.contact_id)

    const address = await prismaClient.address.create({
      data: request,
    })

    return toAddressResponse(address)
  }

  /**
   * Get an address by ID for a specific contact
   * @param user User who is requesting the address
   * @param request Request containing contact_id and address id
   * @returns Address response
   */
  static async get(
    user: User,
    request: GetAddressRequest
  ): Promise<AddressResponse> {
    request = AddressValidation.GET.parse(request) as GetAddressRequest
    await ContactService.contactMustExist(user, request.contact_id)

    const address = await this.addressMustExist(request.contact_id, request.id)

    return toAddressResponse(address)
  }

  static async addressMustExist(
    contactId: number,
    addressId: number
  ): Promise<Address> {
    const address = await prismaClient.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId,
      },
    })

    if (!address) {
      throw new HTTPException(404, {
        message: 'Address not found',
      })
    }

    return address
  }

  /**
   * Update an existing address for a specific contact
   * @param user User who is updating the address
   * @param request Address data to be updated
   * @returns Updated address response
   */
  static async update(
    user: User,
    request: UpdateAddressRequest
  ): Promise<AddressResponse> {
    request = AddressValidation.UPDATE.parse(request) as UpdateAddressRequest

    await ContactService.contactMustExist(user, request.contact_id)
    await this.addressMustExist(request.contact_id, request.id)

    const address = await prismaClient.address.update({
      where: {
        id: request.id,
        contact_id: request.contact_id,
      },
      data: request,
    })

    return toAddressResponse(address)
  }

  /**
   * Delete an address for a specific contact
   * @param user User who is deleting the address
   * @param request Request containing contact_id and address id
   * @returns True if deletion was successful
   */
  static async delete(
    user: User,
    request: RemoveAddressRequest
  ): Promise<boolean> {
    request = AddressValidation.DELETE.parse(request) as RemoveAddressRequest
    await ContactService.contactMustExist(user, request.contact_id)
    await this.addressMustExist(request.contact_id, request.id)

    await prismaClient.address.delete({
      where: {
        id: request.id,
        contact_id: request.contact_id,
      },
    })

    return true
  }
}
