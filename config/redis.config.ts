import type { WorkerOptions, QueueOptions, ConnectionOptions, QueueEventsOptions } from 'bullmq'
import type { RedisOptions } from 'ioredis'

export const {
  REDIS_PEAR_HOST,
  REDIS_PEAR_PORT,
  REDIS_PEAR_USERNAME,
  REDIS_PEAR_PASSWORD,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USERNAME,
  REDIS_PASSWORD,
  NODE_ENV,
} = process.env

export enum RedisDBIndex {
  Default = 0,
  PubSub = 1,
  StateSync = 2,
  BullQueue = 3,
  Proxy = 4,
}

const isDev = NODE_ENV === 'development'

// General config
export const redisHost = REDIS_HOST || 'localhost'
export const redisPort = Number(REDIS_PORT) || 6379
export const redisUri = isDev
  ? `redis://${REDIS_HOST}:${REDIS_PORT}`
  : `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`

// RedisStore config
export const redisStoreUri = `${redisUri}/${RedisDBIndex.Default}`

// IORedis pub/sub config
export const ioRedisOptions: RedisOptions = {
  host: redisHost,
  port: redisPort,
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD,
  db: isDev ? RedisDBIndex.PubSub : RedisDBIndex.Default,
}

// Pear-Connect state sync config
export const defaultPresenceOpts: RedisOptions = {
  username: REDIS_PEAR_USERNAME || REDIS_USERNAME,
  password: REDIS_PEAR_PASSWORD || REDIS_PASSWORD,
  host: REDIS_PEAR_HOST || REDIS_HOST,
  port: Number(REDIS_PEAR_PORT || REDIS_PORT),
  db: isDev ? RedisDBIndex.StateSync : 0,
}

// Bullmq config
export const bullConnectionOpts: ConnectionOptions = {
  host: redisHost,
  port: redisPort,
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD,
  db: isDev ? RedisDBIndex.BullQueue : RedisDBIndex.Default,
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
