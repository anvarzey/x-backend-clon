import { PrismaClient, User } from '@prisma/client'
import { DBRepository } from './DBRepository'

export class Postgres implements DBRepository {
  private readonly prisma

  constructor () {
    this.prisma = new PrismaClient()
  }

  public async createUser ({ name, username, passwordHashed }: { name: string, username: string, passwordHashed: string }): Promise<void> {
    try {
      const result = await this.prisma.user.create({
        data: {
          name,
          username,
          passwordHashed
        }
      })
      console.log(result)
    } catch (e) {
      console.error(e)
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
}
