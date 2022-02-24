import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from '@colyseus/core'
import { MongooseDriver, RedisPresence } from 'colyseus'
import { WebSocketTransport } from '@colyseus/ws-transport'

// Libraries
import { storeUri } from './store/config'
import Sockets from './pears/Sockets'

// Initialize express HTTP server
const app = express()
const server = createServer(app)

// Middleware
app.use(express.json())
app.use(cors())

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
        url: 'redis://127.0.0.1:6379/0',
    }),
    driver: new MongooseDriver(storeUri + '?authSource=admin'),
})

// Sockets config
const sockets = new Sockets(gameServer)
sockets.initRooms()

// Initialize server
export async function initializeGameServer(gameServerPort) {
    try {
        await gameServer.listen(gameServerPort)
        console.log(`Pear game server running on ws://localhost:${gameServerPort}`)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}