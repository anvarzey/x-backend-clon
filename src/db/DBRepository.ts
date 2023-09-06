import { User } from '@prisma/client'

export interface RegisterUserProps {
  avatar?: string
  name: string
  username: string
  email: string
  passwordHashed: string
}

export interface LoginProps {
  username?: string
  email?: string
  password: string
}

interface IUser {
  id: number
  name: string
  username: string
  email: string
  passwordHashed: string
  avatar: string
  createdAt: Date
}

export interface DBRepository {
  registerUser: (props: RegisterUserProps) => Promise<string | Error>
  getAllUsers: () => Promise<User[] | string>
  getUser: (id: string) => Promise<void>
  checkEmail: (email: string) => Promise<string | Error>
  login: (props: LoginProps) => Promise<string | IUser>
}
