import { Request, Response } from 'express'
import { Controller } from '../Controller'
import { getTokens, verifyRefreshToken } from '../../utils/handleToken'
import { DBRepository } from '../../db/DBRepository'
import CONSTANTS from '../../utils/constants'

export class GetRefreshTokenController implements Controller {
  private readonly db: DBRepository

  constructor (db: DBRepository) {
    this.db = db
  }

  async run (req: Request, res: Response): Promise<void> {
    const cookies = req.cookies

    if (!cookies?.jwt) {
      res.status(401).end()
      return
    }

    const refreshToken = cookies.jwt

    res.clearCookie('jwt', { httpOnly: true, secure: true })

    try {
      const payload = await verifyRefreshToken(refreshToken)

      if (payload instanceof Error) throw new Error(payload.message)

      const refreshTokenInDb = await this.db.verifyRefreshTokenInDb(refreshToken, payload.id)

      // IF REFRESH TOKEN IS NOT STORED IN DB, IT MEANS THAT IT IS REUSED
      if (!refreshTokenInDb.success) {
        // IF REFRESH TOKEN IS FROM ANOTHER USER, HIS REFRESH TOKENS ARE ALSO REMOVED
        if (refreshTokenInDb.error === CONSTANTS.WRONG_OWNER && refreshTokenInDb.ownerId) {
          const clearRefTokenOtherOwner = await this.db.clearRefreshTokens(refreshTokenInDb.ownerId)

          if (clearRefTokenOtherOwner instanceof Error) console.error(clearRefTokenOtherOwner)
        }
        const clearRefToken = await this.db.clearRefreshTokens(payload.id)

        if (clearRefToken instanceof Error) console.error(clearRefToken)

        res.status(403).end()
        return
      }
      const tokens = await getTokens(payload)

      const result = await this.db.addRefreshToken(tokens.refreshToken, payload.id)

      if (result instanceof Error) throw new Error(result.message)

      res.cookie('jwt', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        // sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7
      })

      res.json({ data: { accessToken: tokens.accessToken } })
    } catch (e) {
      console.error(e)

      res.status(500).end()
    }
  }
}
