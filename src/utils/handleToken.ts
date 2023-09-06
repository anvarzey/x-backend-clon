import jwt from 'jsonwebtoken'

interface Payload {
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

  const accessToken = await jwt.sign(payload, ACCESS_TOKEN_SECRET as string, { expiresIn: 60 })

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
