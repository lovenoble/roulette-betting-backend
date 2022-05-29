import type { WorkerOptions, QueueOptions, ConnectionOptions } from 'bullmq'

const { REDIS_HOST, REDIS_PORT } = process.env

export const connection: ConnectionOptions = {
	host: REDIS_HOST || 'localhost',
	port: Number(REDIS_PORT) || 6379,
}

export const workerDefaultOpts: WorkerOptions = {
	connection,
	concurrency: 50,
	autorun: false, // Disable autorun so we can control when the workers are started
}

export const queueDefaultOpts: QueueOptions = {
	connection,
	// @NOTE: Look into different queueOpt configurations
}

export const redisUri = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
