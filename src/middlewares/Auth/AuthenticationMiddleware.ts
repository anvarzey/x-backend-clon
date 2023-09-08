import { NextFunction, Request, Response } from 'express'
import { Middleware } from '../Middleware'
import { verifyAccessToken } from '../../utils/handleToken'

export class AuthenticationMiddleware implements Middleware {
  async run (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { authorization } = req.headers

    if (authorization === undefined || !authorization.toLowerCase().startsWith('bearer ')) {
      res.status(401).end()
      return
    }

    const token = authorization.substring(7)
    try {
      const result = await verifyAccessToken(token)

      if (result instanceof Error) {
        res.status(401).end()
      }
      next()
    } catch (e) {
      console.error(e)
      res.status(401).end()
    }
  }
}
