const { REDIS_HOST, REDIS_PORT } = process.env

export const connection = {
	host: REDIS_HOST || 'localhost',
	port: Number(REDIS_PORT) || 6379,
}

export const redisUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
