import { User } from '@prisma/client'
import { prismaClient } from '../application/database'
import {
  LoginUserRequest,
  RegisterUserRequest,
  toUserResponse,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model'
import { UserValidation } from '../validation/user.validation'
import { HTTPException } from 'hono/http-exception'

export class UserService {
  /**
   * Register user
   * @param request - get username and password from request body
   * @returns return UserResponse
   */
  static async register(request: RegisterUserRequest): Promise<UserResponse> {
    request = UserValidation.REGISTER.parse(request) as RegisterUserRequest

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

  /**
   * Login user
   * @param request - get username and password from request body
   * @returns return UserResponse with token
   */
  static async login(request: LoginUserRequest): Promise<UserResponse> {
    request = UserValidation.LOGIN.parse(request) as LoginUserRequest

    //cek username
    let user = await prismaClient.user.findUnique({
      where: {
        username: request.username,
      },
    })

    if (!user) {
      throw new HTTPException(401, {
        message: 'Username or password is incorect',
      })
    }

    const isPasswordValid = await Bun.password.verify(
      request.password,
      user.password,
      'bcrypt'
    )

    if (!isPasswordValid) {
      throw new HTTPException(401, {
        message: 'Username or password is incorect',
      })
    }

    user = await prismaClient.user.update({
      where: {
        username: request.username,
      },
      data: {
        token: crypto.randomUUID(),
      },
    })

    const response = toUserResponse(user)
    response.token = user.token!

    return response
  }

  /**
   * Get user by token
   * @param token - token from request header
   * @returns User
   */
  static async getUserByToken(token: string | undefined | null): Promise<User> {
    const result = UserValidation.TOKEN.safeParse(token)

    if (result.error) {
      throw new HTTPException(401, {
        message: 'Unauthorized',
      })
    }

    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
    })

    if (!user) {
      throw new HTTPException(401, {
        message: 'Unauthorized',
      })
    }

    return user
  }

  static async update(
    user: User,
    request: UpdateUserRequest
  ): Promise<UserResponse> {
    request = UserValidation.UPDATE.parse(request) as UpdateUserRequest

    if (request.name) {
      user.name = request.name
    } else if (request.password) {
      user.password = await Bun.password.hash(request.password, {
        algorithm: 'bcrypt',
        cost: 10,
      })
    }

    user = await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: {
        name: user.name,
        password: user.password,
      },
    })

    return toUserResponse(user)
  }

  static async logout(user: User): Promise<boolean> {
    await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    })

    return true
  }
}
