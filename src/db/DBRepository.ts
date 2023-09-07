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

export interface ITokenUser {
  id: number
  name: string
  username: string
}

export interface ITweet {
  id: number
  content: string
  commentId: number | null
  authorId: number
}

export interface IUser {
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
  createTweet: (props: TweetProps) => Promise<string | Error>
  getTweets: () => Promise<ITweet[] | Error>
  verifyRefreshToken: (refreshToken: string) => Promise<ITokenUser | Error>
}
