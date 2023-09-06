import { Prisma, PrismaClient, User } from '@prisma/client'
import { DBRepository, LoginProps, RegisterUserProps } from './DBRepository'
import CONSTANTS from '../utils/constants'

interface IUser {
  id: number
  name: string
  username: string
  email: string
  passwordHashed: string
  avatar: string
  createdAt: Date
}

export class Postgres implements DBRepository {
  private readonly prisma

  constructor () {
    this.prisma = new PrismaClient()
  }

  public async registerUser ({ name, email, username, passwordHashed }: RegisterUserProps): Promise<string | Error> {
    try {
      await this.prisma.user.create({
        data: {
          name,
          email,
          username,
          passwordHashed
        }
      })

      return 'Ok'
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return new Error('Username is already taken')
        }
      }
      return new Error('An error has been occurred')
    }
  }

  public async getAllUsers (): Promise<User[] | string> {
    try {
      const data = await this.prisma.user.findMany()

      return data
    } catch (e) {
      if (e instanceof Error) {
        return e.message
      }
      return 'An error has been occurred'
    }
  }

  public async getUser (id: string): Promise<void> {
    console.log(id)
  }

  public async checkEmail (email: string): Promise<string | Error> {
    try {
      const result = await this.prisma.user.findUnique({
        where: {
          email
        }
      })

      if (result != null) {
        return CONSTANTS.FOUND
      } else {
        return CONSTANTS.NOT_FOUND
      }
    } catch (e) {
      return new Error('Internal error')
    }
  }

  public async login (props: LoginProps): Promise<string | IUser> {
    const { username } = props

    const user = await this.prisma.user.findUnique({
      where: {
        username
      }
    })

    if (user === null) return CONSTANTS.NOT_FOUND

    return user
  }
}
