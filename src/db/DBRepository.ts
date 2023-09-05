import { User } from '@prisma/client'

interface RegisterUserProps {
  avatar?: string
  name: string
  username: string
  email: string
  passwordHashed: string
}

export interface DBRepository {
  registerUser: (props: RegisterUserProps) => Promise<string | Error>
  getAllUsers: () => Promise<User[] | string>
  getUser: (id: string) => Promise<void>
  checkEmail: (email: string) => Promise<string | Error>
}
