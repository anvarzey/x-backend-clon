import { Request, Response } from 'express'
import { DBRepository } from '../../db/DBRepository'
import { Controller } from '../Controller'
import { hashPassword } from '../../utils/handlePassword'

export class PostSignUpController implements Controller {
  private readonly db: DBRepository

  constructor (db: DBRepository) {
    this.db = db
  }

  async run (req: Request, res: Response): Promise<void> {
    const { name, username, email, password } = req.body

    if (name === undefined || username === undefined || email === undefined || password === undefined) {
      throw new Error('Data is missing')
    }

    try {
      const passwordHashed = await hashPassword(password).catch(e => e)

      if (passwordHashed instanceof Error) {
        throw new Error('Error')
      }

      const userToRegister = {
        name,
        username,
        email,
        passwordHashed
      }

      const result = await this.db.registerUser(userToRegister)

      if (result instanceof Error) {
        throw new Error(result.message)
      }

      res.status(201).end()
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).json({ error: e.message })
      } else {
        res.status(500).end()
      }
    }
  }
}
