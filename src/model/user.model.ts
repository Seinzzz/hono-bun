import { User } from '@prisma/client'

export type RegisterUserRequest = {
  username: string
  password: string
  name: string
}

export type LoginUserRequest = {
  username: string
  password: string
}
export type UpdateUserRequest = {
  password?: string
  name?: string
}

export type UserResponse = {
  username: string
  name: string
  token?: string
}

// Function to convert a User object from the database to a UserResponse object
export function toUserResponse(user: User): UserResponse {
  return {
    username: user.username,
    name: user.name,
  }
}
