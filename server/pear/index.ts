import { Server } from '@colyseus/core'
import { RedisPresence } from '@colyseus/redis-presence'
import { MongooseDriver } from '@colyseus/mongoose-driver'

import type { RedisClientOptions } from 'redis'

import { logger } from './utils'
import { MONGO_ROOT_USERNAME, mongoUri, pearServerPort, pearRedisUri } from '../config'
import Rooms from './rooms'
import transport from '../transport'

export interface IPearOptions {
	presenceOpts?: RedisClientOptions
	pearServerPort?: number
	mongoBaseUri?: string
	mongoAuthSource?: string
	redisUri?: string
}

const defaultPresenceOpts: RedisClientOptions = {
	url: pearRedisUri,
}

const defaultPearOptions: IPearOptions = {
	pearServerPort,
	presenceOpts: defaultPresenceOpts,
	mongoBaseUri: mongoUri,
	mongoAuthSource: MONGO_ROOT_USERNAME,
	redisUri: pearRedisUri,
}

export class PearServer {
	server!: Server
	rooms!: Rooms
	#isStarted = false
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

	public get isStarted() {
		return this.#isStarted
	}

	constructor(options = defaultPearOptions) {
		const { presenceOpts, mongoBaseUri, redisUri, mongoAuthSource } = Object.assign(
			defaultPearOptions,
			options
		)
		console.log(presenceOpts)
		this.#redisUri = redisUri

		this.#mongoUri = mongoBaseUri
		if (mongoAuthSource) {
			this.#mongoUri += `?authSource=${mongoAuthSource}`
		}

		try {
			this.server = new Server({
				transport: transport.instance,
				presence: new RedisPresence(presenceOpts),
				driver: new MongooseDriver(this.#mongoUri),
			})
		} catch (error) {
			console.error(error)
			// prettier-ignore
			throw(error)
		}
		logger.info(`Created Server instance!`)
		logger.info(`Created WebSocketTransport instance!`)
		logger.info(`Created RedisPresence instance!`)
		logger.info(`Created MongooseDriver instance!`)

		this.rooms = new Rooms(this.server)
		this.rooms.createAll()
		logger.info(`Added Room defintions!`)
	}

	async listen(port = this.#port) {
		if (this.#isStarted) return

		await this.server.listen(port)
		this.#isStarted = false
		logger.info(`HTTP/WebSocket server started on port ${port}...`)
	}

	async stopAll() {
		if (!this.#isStarted) return null

		// @NOTE: Include other servers that need to be stopped here
		return this.server.gracefullyShutdown()
	}

	// @NOTE: Add match making, room handles, event handlers here
}

export default new PearServer()
