import { Request, Response } from 'express'
import { DBRepository } from '../../db/DBRepository'
import { Controller } from '../Controller'
import { verifyPassword } from '../../utils/handlePassword'
import CONSTANTS from '../../utils/constants'
import { getTokens } from '../../utils/handleToken'

interface IUser {
  id: number
  name: string
  username: string
  email: string
  passwordHashed: string
  avatar: string
  createdAt: Date
}

export class PostLogInController implements Controller {
  private readonly db: DBRepository

  constructor (db: DBRepository) {
    this.db = db
  }

  async run (req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body
    // const { username, avatar, name } = req.body
    let user: IUser | string
    try {
      if (username !== undefined) {
        user = await this.db.login({ username, password })
      } else {
        user = await this.db.login({ email, password })
      }

      if (user === CONSTANTS.NOT_FOUND || typeof user === 'string') {
        res.status(400).json({ error: 'Username or password is incorrect' })
        return
      }

      const isPassword = await verifyPassword(password, user.passwordHashed)

      if (!isPassword) {
        res.status(400).json({ error: 'Username or password is incorrect' })
        return
      }

      const tokens = await getTokens({ avatar: user.avatar, name: user.name, username: user.username })

      /*
        ADD REDIS TO STORE REFRESH TOKENS
      */

      // const tokens = await getTokens({ avatar, name, username })

      res.status(200).json({ data: tokens })
    } catch (e) {
      res.status(500)
    }
  }
}
