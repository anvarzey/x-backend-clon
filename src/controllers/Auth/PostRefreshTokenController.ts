import { Request, Response } from 'express'
import { Controller } from '../Controller'
import { getTokens, refreshTokenFn } from '../../utils/handleToken'

export class PostRefreshTokenController implements Controller {
  async run (req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body
    try {
      const payload = await refreshTokenFn(refreshToken)

      if (payload instanceof Error) throw new Error('Unauthorized')

      const tokens = await getTokens(payload)

      res.json(tokens)
    } catch (error) {
      res.status(401).end()
    }
  }
}
