import { Address } from '@prisma/client'

export type CreateAddressRequest = {
  contact_id: number
  street?: string
  city?: string
  province?: string
  country: string
  postal_code: string
}

export type AddressResponse = {
  id: number
  street?: string | null
  city?: string | null
  province?: string | null
  country: string
  postal_code: string
}

export type GetAddressRequest = {
  contact_id: number
  id: number
}

export type UpdateAddressRequest = {
  id: number
  contact_id: number
  street?: string
  city?: string
  province?: string
  country: string
  postal_code: string
}

export function toAddressResponse(addreess: Address): AddressResponse {
  return {
    id: addreess.id,
    street: addreess.street,
    city: addreess.city,
    province: addreess.province,
    country: addreess.country,
    postal_code: addreess.postal_code,
  }
}
