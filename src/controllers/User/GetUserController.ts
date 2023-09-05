import { Request, Response } from 'express'
import { DBRepository } from '../../db/DBRepository'
import { Controller } from '../Controller'

export class GetUserController implements Controller {
  private readonly db: DBRepository

  constructor (db: DBRepository) {
    this.db = db
  }

  async run (req: Request, res: Response): Promise<void> {
    const { id } = req.params
    try {
      const user = await this.db.getUser(id)

      res.json({ data: user })
    } catch (e) {
      if (e instanceof Error) {
        res.json({ error: e.message })
      } else {
        res.json({ error: 'An error has been occurred' })
      }
    }
  }
}
