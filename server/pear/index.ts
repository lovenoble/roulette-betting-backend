import chalk from 'chalk'
import { Server } from '@colyseus/core'
import { RedisPresence } from '@colyseus/redis-presence'
import { MongooseDriver } from '@colyseus/mongoose-driver'
import { WebSocketTransport } from '@colyseus/ws-transport'

import type { RedisClientOptions } from 'redis'
import type { TransportOptions } from '@colyseus/ws-transport'

import { mongoUri, redisUri, pearServerPort } from '../config'
import Rooms from './rooms'
import httpServer from '../http'

export interface IPearOptions {
	transportOpts: TransportOptions
	presenceOpts: RedisClientOptions
}

const defaultTransportOpts: TransportOptions = {
	server: httpServer,
	// @NOTE: Configure client validation (domain whitelist in production)
	// verifyClient: (info, next) => {
	// 	console.log('Handshake successful!', info)
	// 	next(true)
	// },
	// pingInterval: 3000, // Default
	// pingMaxRetries: 2, // Default
}

const defaultPresenceOpts: RedisClientOptions = {
	url: `${redisUri}/10`,
}

const defaultPearOptions: IPearOptions = {
	transportOpts: defaultTransportOpts,
	presenceOpts: defaultPresenceOpts,
}

const logColor = chalk.hex('#1de9b6').bold
const log = (...args: any) => console.log(logColor('[PearServer]:', ...args))

export class PearServer {
	server!: Server
	rooms!: Rooms
	#port = pearServerPort
	#mongoUri = `${mongoUri}?authSource=admin`
	#redisUri = `${redisUri}/10`

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
		const { transportOpts, presenceOpts } = options

		this.server = new Server({
			transport: new WebSocketTransport(transportOpts),
			presence: new RedisPresence(presenceOpts),
			driver: new MongooseDriver(mongoUri),
		})
		log(`Created Server instance!`)
		log(`Created WebSocketTransport instance!`)
		log(`Created RedisPresence instance!`)
		log(`Created MongooseDriver instance!`)

		this.rooms = new Rooms(this.server)
		this.rooms.createAll()
		log(`Added Room defintions!`)
	}

	async listen(port = this.#port) {
		await this.server.listen(port)
		log(`Running on WebSocket port ${port}...`)
	}

	async stopAll() {
		// @NOTE: Include other servers that need to be stopped here
		return this.server.gracefullyShutdown()
	}

	// @NOTE: Add match making, room handles, event handlers here
}

export default new PearServer()
