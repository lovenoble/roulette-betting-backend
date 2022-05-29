const { SALT_ROUNDS, JWT_SECRET, JWT_EXPIRATION } = process.env

export const saltRounds = Number(SALT_ROUNDS || 10)
export const jwtSecret = JWT_SECRET || 'pears-are-yumyum4life'
export const jwtExpiration = JWT_EXPIRATION || '30d'
