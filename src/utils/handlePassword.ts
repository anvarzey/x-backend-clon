import bcrypt from 'bcrypt'

export const hashPassword = async (password: string): Promise<string | Error> => {
  const { SALT_ROUNDS } = process.env

  if (SALT_ROUNDS === undefined) {
    return new Error('Internal error')
  }

  const saltRounds = Number(SALT_ROUNDS)

  const passwordHashed = await bcrypt.hash(password, saltRounds)

  return passwordHashed
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const result = await bcrypt.compare(password, hashedPassword)

  return result
}
