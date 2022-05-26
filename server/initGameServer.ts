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

// @NOTE: Configure these options in WebSocketTransport
// pingInterval?: number;
// pingMaxRetries?: number;
// host?: string | undefined;
// port?: number | undefined;
// backlog?: number | undefined;
// server?: HTTPServer | HTTPSServer | undefined;
// verifyClient?: VerifyClientCallbackAsync | VerifyClientCallbackSync | undefined;
// handleProtocols?: any;
// path?: string | undefined;
// noServer?: boolean | undefined;
// clientTracking?: boolean | undefined;
// perMessageDeflate?: boolean | PerMessageDeflateOptions | undefined;
// maxPayload?: number | undefined;
const gameServer = new Server({
	transport: new WebSocketTransport({
		server,
		// @NOTE: Configure client validation (domain whitelist in production)
		// verifyClient: (info, next) => {
		// 	console.log('Handshake successful!', info)
		// 	next(true)
		// },
		// pingInterval: 3000, // Default
		// pingMaxRetries: 2, // Default
	}),
	presence: new RedisPresence({
		url: `${process.env.REDIS_URL}/10`,
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
