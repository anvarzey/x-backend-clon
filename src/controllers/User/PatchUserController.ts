import { Request, Response } from 'express'
import { DBRepository } from '../../db/DBRepository'
import { Controller } from '../Controller'

export class PatchUserController implements Controller {
  private readonly db: DBRepository

  constructor (db: DBRepository) {
    this.db = db
  }

  async run (req: Request, res: Response): Promise<void> {
    const { name, username, passwordHashed, avatar } = req.body
    const { id } = req.params

    console.log({ id, name, username, passwordHashed, avatar })

    res.json({ message: 'Ok' })
  }
}
