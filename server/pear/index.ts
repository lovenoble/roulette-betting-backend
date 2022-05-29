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

const logColor = chalk.hex('green').bgHex('cyan')
const log = (...args: any) => console.log(logColor(...args))

export default class Pear {
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

	constructor({
		transportOpts = defaultTransportOpts,
		presenceOpts = defaultPresenceOpts,
	}: IPearOptions) {
		this.server = new Server({
			transport: new WebSocketTransport(transportOpts),
			presence: new RedisPresence(presenceOpts),
			driver: new MongooseDriver(mongoUri),
		})
		log(`[PearServer]: Created Server instance!`)
		log(`[PearServer] Created WebSocketTransport instance!`)
		log(`[PearServer]: Created RedisPresence instance!`)
		log(`[PearServer]: Created MongooseDriver instance!`)

		this.rooms = new Rooms(this.server)
		this.rooms.createAll()
		log(`[PearServer]: Added Room defintions!`)
	}

	async listen(port = this.#port) {
		log(`[PearServer]: Starting server instance...`)
		await this.server.listen(port)
		log(`[PearServer] Running on WebSocket port:${port}`)
	}

	async stopAll() {
		// @NOTE: Include other servers that need to be stopped here
		return this.server.gracefullyShutdown()
	}

	// @NOTE: Add match making, room handles, event handlers here
}
