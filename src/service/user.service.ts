import { prismaClient } from '../application/database'
import {
  RegisterUserRequest,
  toUserResponse,
  UserResponse,
} from '../model/user.model'
import { UserValidation } from '../validation/user.validation'
import { HTTPException } from 'hono/http-exception'

export class UserService {
  static async register(request: RegisterUserRequest): Promise<UserResponse> {
    //validasi
    request = UserValidation.REGISTER.parse(request)
    // cek username sudah ada
    const userWithSameUsername = await prismaClient.user.count({
      where: {
        username: request.username,
      },
    })

    if (userWithSameUsername != 0) {
      throw new HTTPException(400, {
        message: 'Username already exists',
      })
    }

    request.password = await Bun.password.hash(request.password, {
      algorithm: 'bcrypt',
      cost: 10,
    })

    const user = await prismaClient.user.create({
      data: request,
    })

    return toUserResponse(user)
  }
}
