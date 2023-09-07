import { Request, Response } from 'express'
import { DBRepository } from '../../db/DBRepository'
import { Controller } from '../Controller'

export class GetTweetsController implements Controller {
  private readonly db: DBRepository

  constructor (db: DBRepository) {
    this.db = db
  }

  async run (req: Request, res: Response): Promise<void> {
    try {
      const result = await this.db.getTweets()

      res.json({ data: result })
    } catch (e) {
      console.error(e)
      res.status(500).end()
    }
  }
}
