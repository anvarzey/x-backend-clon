import { Request, Response } from 'express'
import { DBRepository } from '../../db/DBRepository'
import { Controller } from '../Controller'
import CONSTANTS from '../../utils/constants'

export class PostCheckEmailController implements Controller {
  private readonly db: DBRepository

  constructor (db: DBRepository) {
    this.db = db
  }

  async run (req: Request, res: Response): Promise<void> {
    const { email } = req.body
    try {
      const result = await this.db.checkEmail(email)

      if (result === CONSTANTS.FOUND) {
        res.status(200).end()
      } else if (result === CONSTANTS.NOT_FOUND) {
        res.status(403).end()
      } else {
        throw new Error('Error')
      }
    } catch (error) {
      res.json({ error: 'Error when checking email' })
    }
  }
}
