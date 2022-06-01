import type { WorkerOptions, QueueOptions, ConnectionOptions, QueueEventsOptions } from 'bullmq'
import type { RedisOptions } from 'ioredis'

export const { REDIS_HOST, REDIS_PORT } = process.env

export enum RedisDBIndex {
	Store = 0,
	PubSub = 1,
	StateSync = 2,
	BullQueue = 3,
	Proxy = 4,
}

// General config
export const redisHost = REDIS_HOST || 'localhost'
export const redisPort = Number(REDIS_PORT) || 6379
export const redisUri = `redis://${REDIS_HOST}:${REDIS_PORT}`

// RedisStore config
export const redisStoreUri = `${redisUri}/${RedisDBIndex.Store}`

// IORedis pub/sub config
export const ioRedisOptions: RedisOptions = {
	host: redisHost,
	port: redisPort,
	db: RedisDBIndex.PubSub,
}

// Pear-Connect state sync config
export const pearRedisUri = `${redisUri}/${RedisDBIndex.StateSync}`

// Bullmq config
export const bullConnectionOpts: ConnectionOptions = {
	host: redisHost,
	port: redisPort,
	db: RedisDBIndex.BullQueue,
}

export const workerDefaultOpts: WorkerOptions = {
	connection: bullConnectionOpts,
	concurrency: 50,
	autorun: false, // Disable autorun so we can control when the workers are started
}

export const queueDefaultOpts: QueueOptions = {
	connection: bullConnectionOpts,
	// @NOTE: Look into different queueOpt configurations
}

export const queueEventDefaultOpts: QueueEventsOptions = {
	connection: bullConnectionOpts,
	// @NOTE: Look into different queueEventsOpts configurations
}
