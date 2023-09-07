import jwt from 'jsonwebtoken'
import CONSTANTS from './constants'

interface Payload {
  id: string
  avatar: string
  name: string
  username: string
}

interface Tokens {
  accessToken: string
  refreshToken: string
}

export const getTokens = async (payload: Payload): Promise<Tokens> => {
  const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env

  const accessToken = await jwt.sign(payload, ACCESS_TOKEN_SECRET as string, { expiresIn: 15 })

  const refreshToken = await jwt.sign(payload, REFRESH_TOKEN_SECRET as string, { expiresIn: '1y' })

  return {
    accessToken,
    refreshToken
  }
}

export const refreshTokenFn = async (refreshToken: string): Promise<Payload | Error> => {
  const { REFRESH_TOKEN_SECRET } = process.env

  if (REFRESH_TOKEN_SECRET === undefined) return new Error('Forbidden')

  const userInfo: any = await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err !== null && err !== undefined) return new Error('Anauthorized')

    const { avatar, name, username } = payload as Payload

    return { avatar, name, username }
  })

  return userInfo
}

export const verifyAccessToken = async (accessToken: string): Promise<string | Error> => {
  const { ACCESS_TOKEN_SECRET } = process.env

  if (ACCESS_TOKEN_SECRET === undefined) {
    return new Error(CONSTANTS.INTERNAL_ERROR)
  }
  try {
    const result: any = await jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        return new Error(err.message)
      }

      return payload
    })

    if (result instanceof Error) {
      throw new Error(result.message)
    }

    return CONSTANTS.OK
  } catch (e) {
    if (e instanceof Error) {
      return new Error(e.message)
    }
    return new Error(CONSTANTS.GENERIC_ERROR)
  }
}

// export const verifyRefreshToken = async (refreshToken: string): Promise<string | Error> => {
//   const { REFRESH_TOKEN_SECRET } = process.env

//   if (REFRESH_TOKEN_SECRET === undefined) {
//     return new Error(CONSTANTS.INTERNAL_ERROR)
//   }

//   try {
//     return ''
//   } catch (e) {
//     if (e instanceof Error) {
//       return new Error(e.message)
//     }
//     return new Error(CONSTANTS.GENERIC_ERROR)
//   }
// }
