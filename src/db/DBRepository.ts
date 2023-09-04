import { User } from '@prisma/client'

interface CreateUserProps {
  name: string
  username: string
  passwordHashed: string
}

export interface DBRepository {
  createUser: (props: CreateUserProps) => Promise<void>
  getAllUsers: () => Promise<User[] | string>
}
