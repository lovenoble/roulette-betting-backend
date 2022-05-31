import { Server } from '@colyseus/core'
import { RedisPresence } from '@colyseus/redis-presence'
import { MongooseDriver } from '@colyseus/mongoose-driver'

import type { RedisClientOptions } from 'redis'

import { logger } from './utils'
import { MONGO_ROOT_USERNAME, mongoUri, redisUri, pearServerPort } from '../config'
import Rooms from './rooms'
import transport from '../transport'

export interface IPearOptions {
	presenceOpts?: RedisClientOptions
	pearServerPort?: number
	mongoBaseUri?: string
	mongoAuthSource?: string
	redisBaseUri?: string
	redisDbIdx?: number
}

const defaultPresenceOpts: RedisClientOptions = {
	url: redisUri,
}

const defaultPearOptions: IPearOptions = {
	pearServerPort,
	presenceOpts: defaultPresenceOpts,
	mongoBaseUri: mongoUri,
	mongoAuthSource: MONGO_ROOT_USERNAME,
	redisBaseUri: redisUri,
	redisDbIdx: 10,
}

export class PearServer {
	server!: Server
	rooms!: Rooms
	#port = pearServerPort
	#mongoUri: string
	#redisUri: string

	public get port() {
		return this.#port
	}

	public get mongoUri() {
		return this.#mongoUri
	}

	public get redisUri() {
		return this.#redisUri
	}

	constructor(options = defaultPearOptions) {
		const { presenceOpts, mongoBaseUri, redisBaseUri, redisDbIdx, mongoAuthSource } =
			Object.assign(defaultPearOptions, options)

		this.#redisUri = `${redisBaseUri}/${redisDbIdx}`
		this.#mongoUri = mongoBaseUri
		if (mongoAuthSource) {
			this.#mongoUri += `?authSource=${mongoAuthSource}`
		}

		this.server = new Server({
			transport,
			presence: new RedisPresence(presenceOpts),
			driver: new MongooseDriver(this.#mongoUri),
		})
		logger.info(`Created Server instance!`)
		logger.info(`Created WebSocketTransport instance!`)
		logger.info(`Created RedisPresence instance!`)
		logger.info(`Created MongooseDriver instance!`)

		this.rooms = new Rooms(this.server)
		this.rooms.createAll()
		logger.info(`Added Room defintions!`)
	}

	async listen(port = this.#port) {
		await this.server.listen(port)
		logger.info(`HTTP/WebSocket server started on port ${port}...`)
	}

	async stopAll() {
		// @NOTE: Include other servers that need to be stopped here
		return this.server.gracefullyShutdown()
	}

	// @NOTE: Add match making, room handles, event handlers here
}

export default new PearServer()
