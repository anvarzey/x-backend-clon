import { NextFunction, Request, Response } from 'express'
import { Middleware } from '../Middleware'
import { verifyAccessToken } from '../../utils/handleToken'
import { DBRepository } from '../../db/DBRepository'

export class AuthenticationMiddleware implements Middleware {
  private readonly db: DBRepository

  constructor (db: DBRepository) {
    this.db = db
  }

  async run (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { authorization } = req.headers

    if (authorization === undefined || !authorization.toLowerCase().startsWith('bearer ')) {
      res.status(401).end()
      return
    }

    const token = authorization.substring(7)
    try {
      const result = await verifyAccessToken(token)

      if (!(result instanceof Error)) {
        next()
      }

      // this.db.verifyRefreshToken
    } catch (e) {
      console.error(e)
      res.status(401).end()
    }
  }
}
