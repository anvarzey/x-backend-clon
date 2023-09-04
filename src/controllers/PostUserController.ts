import { Request, Response } from 'express'
import { Controller } from './Controller'
import { DBRepository } from '../db/DBRepository'

export class PostUserController implements Controller {
  private readonly db: DBRepository

  constructor (db: DBRepository) {
    this.db = db
  }

  async run (req: Request, res: Response): Promise<void> {
    const { name, username, password } = req.body

    try {
      await this.db.createUser({ name, username, passwordHashed: password })
      res.json({ message: 'Ok' })
    } catch (error) {
      res.json({ error })
    }
  }
}
