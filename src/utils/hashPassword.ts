import bcrypt from 'bcrypt'

const hashPassword = async (password: string): Promise<string | Error> => {
  const { SALT_ROUNDS } = process.env

  if (SALT_ROUNDS === undefined) {
    return new Error('Internal error')
  }

  const saltRounds = Number(SALT_ROUNDS)

  const passwordHashed = await bcrypt.hash(password, saltRounds)

  return passwordHashed
}

export default hashPassword
