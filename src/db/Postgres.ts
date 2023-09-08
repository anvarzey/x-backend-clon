import { Prisma, PrismaClient, User } from '@prisma/client'
import { DBRepository, Tweet, LoginProps, RegisterUserProps, TweetProps, VerifyRTInDbRes } from './DBRepository'
import CONSTANTS from '../utils/constants'

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

      return CONSTANTS.OK
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

  public async login (props: LoginProps): Promise<string | User> {
    const { username } = props

    const user = await this.prisma.user.findUnique({
      where: {
        username
      }
    })

    if (user === null) return CONSTANTS.NOT_FOUND

    return user
  }

  public async createTweet (props: TweetProps): Promise<string | Error> {
    const { tweetContent, authorId, commentId } = props

    try {
      if (commentId === undefined || commentId === null) {
        await this.prisma.tweet.create({
          data: {
            content: tweetContent,
            authorId: Number(authorId)
          }
        })
      } else {
        await this.prisma.tweet.create({
          data: {
            content: tweetContent,
            authorId: Number(authorId),
            commentId: Number(commentId)
          }
        })
      }

      return CONSTANTS.OK
    } catch (e) {
      console.error(e)
      return new Error(CONSTANTS.GENERIC_ERROR)
    }
  }

  public async getTweets (): Promise<Error | Tweet[]> {
    try {
      const result = await this.prisma.tweet.findMany()

      return result
    } catch (e) {
      if (e instanceof Error) {
        return new Error(e.message)
      }
      return new Error(CONSTANTS.GENERIC_ERROR)
    }
  }

  public async verifyRefreshTokenInDb (refreshToken: string, userId: string): Promise<VerifyRTInDbRes> {
    try {
      const isInDb = await this.prisma.refreshToken.findUnique({
        where: {
          userId_value: {
            userId: Number(userId),
            value: refreshToken
          }
        }
      })

      if (!isInDb) {
        const fromOtherUser = await this.prisma.refreshToken.findFirst({
          where: {
            value: refreshToken
          }
        })
        if (fromOtherUser) {
          return {
            success: false,
            error: CONSTANTS.WRONG_OWNER,
            ownerId: fromOtherUser.userId.toString()
          }
        }

        return {
          success: false,
          error: CONSTANTS.NOT_FOUND
        }
      }

      return { success: true }
    } catch (e) {
      console.error(e)
      return {
        success: false,
        error: CONSTANTS.INTERNAL_ERROR
      }
    }
  }

  public async clearRefreshTokens (userId: string): Promise<string | Error> {
    try {
      const result = await this.prisma.refreshToken.deleteMany({
        where: {
          userId: Number(userId)
        }
      })

      if (result instanceof Error) throw new Error(result.message)

      return CONSTANTS.OK
    } catch (e) {
      console.error(e)
      if (e instanceof Error) {
        return new Error(e.message)
      }
      return new Error(CONSTANTS.INTERNAL_ERROR)
    }
  }

  public async addRefreshToken (userId: string, refreshToken: string): Promise<string | Error> {
    try {
      await this.prisma.refreshToken.create({
        data: {
          userId: Number(userId),
          value: refreshToken
        }
      })

      return CONSTANTS.OK
    } catch (e) {
      console.error(e)

      return new Error('Internal error')
    }
  }
}
