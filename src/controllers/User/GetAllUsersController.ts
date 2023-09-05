import { Request, Response } from 'express'
import { Controller } from '../Controller'
import { DBRepository } from '../../db/DBRepository'

export class GetAllUsersController implements Controller {
  private readonly db: DBRepository

  constructor (db: DBRepository) {
    this.db = db
  }

  async run (req: Request, res: Response): Promise<void> {
    try {
      const result = await this.db.getAllUsers()
      res.json({ data: result })
    } catch (e) {
      res.json({ error: e })
    }
  }
}
