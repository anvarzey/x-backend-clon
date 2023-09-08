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

export interface TweetProps {
  authorId: string
  commentId?: string
  tweetContent: string
}

export interface TokenUser {
  id: number
  name: string
  username: string
}

export interface Tweet {
  id: number
  content: string
  commentId: number | null
  authorId: number
}

export interface VerifyRTInDbRes {
  success: boolean
  error?: string
  ownerId?: string
}

export interface OwnerRefreshToken {
  ownerId: string
}

export interface DBRepository {
  registerUser: (props: RegisterUserProps) => Promise<string | Error>
  getAllUsers: () => Promise<User[] | string>
  getUser: (id: string) => Promise<void>
  checkEmail: (email: string) => Promise<string | Error>
  login: (props: LoginProps) => Promise<string | User>
  createTweet: (props: TweetProps) => Promise<string | Error>
  getTweets: () => Promise<Tweet[] | Error>
  verifyRefreshTokenInDb: (refreshToken: string, userId: string) => Promise<VerifyRTInDbRes>
  clearRefreshTokens: (userId: string) => Promise<string | Error>
  addRefreshToken: (refreshToken: string, userId: string) => Promise<string | Error>
}
