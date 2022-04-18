import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from '@colyseus/core'
import { MongooseDriver, RedisPresence } from 'colyseus'
import { WebSocketTransport } from '@colyseus/ws-transport'

// Libraries
import storeUri from './store/config'
import Sockets from './pears/Sockets'
import router from './routes'

// Initialize express HTTP server
export const app = express()
const server = createServer(app)

// Middleware
app.use(express.json())
app.use(cors())

// API
app.use(router)

// Create colyseus server
const gameServer = new Server({
	transport: new WebSocketTransport({
		server,
		verifyClient: (info, next) => {
			// console.log('Handshake successful!', info)
			next(true)
		},
	}),
	presence: new RedisPresence({
		url: process.env.REDIS_URL,
	}),
	driver: new MongooseDriver(`${storeUri}?authSource=admin`),
})

// Sockets config
const sockets = new Sockets(gameServer)
sockets.initRooms()

// Initialize server
export default async function initGameServer(gameServerPort: number): Promise<Server> {
	await gameServer.listen(gameServerPort)
	console.log(`Pear game server running on WebSocket port :${gameServerPort}`)

	return gameServer
}
