import { Address, Contact } from '@prisma/client'
import { prismaClient } from '../application/database'

export class UserTest {
  static async create() {
    await prismaClient.user.createMany({
      data: {
        username: 'test',
        password: await Bun.password.hash('test', {
          algorithm: 'bcrypt',
          cost: 10,
        }),
        name: 'test',
        token: 'test',
      },
    })
  }

  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        username: 'test',
      },
    })
  }
}

export class ContactTest {
  static async deleteAll() {
    await prismaClient.contact.deleteMany({
      where: {
        username: 'test',
      },
    })
  }

  static async create() {
    await prismaClient.contact.create({
      data: {
        first_name: 'freya',
        last_name: 'jayawardana',
        email: 'fre1437@gmail.com',
        phone: '081234567890',
        username: 'test',
      },
    })
  }

  static async createMany(n: number) {
    for (let i = 0; i < n; i++) {
      await this.create()
    }
  }

  static async get(): Promise<Contact> {
    return await prismaClient.contact.findFirstOrThrow({
      where: {
        username: 'test',
      },
    })
  }
}

export class AddressTest {
  static async get(): Promise<Address> {
    return await prismaClient.address.findFirstOrThrow({
      where: {
        contact: {
          username: 'test',
        },
      },
    })
  }

  static async deleteAll() {
    await prismaClient.address.deleteMany({
      where: {
        contact: {
          username: 'test',
        },
      },
    })
  }

  static async create() {
    const contact = await ContactTest.get()

    await prismaClient.address.create({
      data: {
        contact_id: contact.id,
        street: 'test street',
        city: 'test city',
        province: 'test province',
        country: 'test country',
        postal_code: '1437',
      },
    })
  }
}
