import type { WorkerOptions, QueueOptions, ConnectionOptions, QueueEventsOptions } from 'bullmq'
import type { RedisOptions } from 'ioredis'

export const {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_USERNAME,
    REDIS_PASSWORD,
    NODE_ENV,
} = process.env

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
export const redisUri = NODE_ENV === 'development' ?
    `redis://${REDIS_HOST}:${REDIS_PORT}` :
    `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
console.log({redisUri})

// RedisStore config
export const redisStoreUri = `${redisUri}/${RedisDBIndex.Store}`

// IORedis pub/sub config
export const ioRedisOptions: RedisOptions = {
    host: redisHost,
    port: redisPort,
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    db: RedisDBIndex.PubSub,
}

// Pear-Connect state sync config
export const pearRedisUri = `${redisUri}/${RedisDBIndex.StateSync}`

// Bullmq config
export const bullConnectionOpts: ConnectionOptions = {
    host: redisHost,
    port: redisPort,
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
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
