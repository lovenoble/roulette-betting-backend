// import cors from 'cors'
import type { AppOptions, WebSocketBehavior } from 'uWebSockets.js'
import type { TransportOptions } from '@colyseus/uwebsockets-transport'
import { DEDICATED_COMPRESSOR_3KB } from 'uWebSockets.js'
import { uWebSocketsTransport } from '@colyseus/uwebsockets-transport'

import { log, binaryEncoder, binaryDecoder } from './utils'

const webSocketOptions: WebSocketBehavior = {
	/* There are many common helper features */
	idleTimeout: 32,
	maxBackpressure: 1024,
	maxPayloadLength: 512,
	compression: DEDICATED_COMPRESSOR_3KB,
}

// @NOTE: Configure later (options at the bottom)
const appOptions: AppOptions = {}

// @NOTE: Configure later (options at the bottom)
const transportOptions: TransportOptions = {}

const transport = new uWebSocketsTransport(transportOptions, appOptions)

transport.app.get('/health', (res, req) => {
	log('HTTP', 'GET HealthCheck requested', req.getUrl())
	res.writeStatus('200 OK')
		.writeHeader('HealthCheck', 'Active')
		.end('[PearServer]: HealthCheck successful')
})

transport.app.ws('/health', {
	...webSocketOptions,
	/* You can do app.publish('sensors/home/temperature', '22C') kind of pub/sub as well */
	/* For brevity we skip the other events (upgrade, open, ping, pong, close) */
	message: (ws, message, isBinary) => {
		// Decode message and echo message back to sender
		const decodedMsg = binaryDecoder.decode(message)
		log('WebSocket', 'Received HealthCheck message', decodedMsg)
		const responseMsg = binaryEncoder.encode(`HealthCheck successful! Echo: "${decodedMsg}"`)
		ws.send(responseMsg, isBinary, true)
	},
})

export const server = transport.app

export default transport

// TransportOptions
// key_file_name?: RecognizedString;
// cert_file_name?: RecognizedString;
// passphrase?: RecognizedString;
// dh_params_file_name?: RecognizedString;
// /** This translates to SSL_MODE_RELEASE_BUFFERS */
// ssl_prefer_low_memory_usage?: boolean;

// AppOptions
// /** Maximum length of received message. If a client tries to send you a message larger than this, the connection is immediately closed. Defaults to 16 * 1024. */
// maxPayloadLength?: number;
// /** Maximum amount of seconds that may pass without sending or getting a message. Connection is closed if this timeout passes. Resolution (granularity) for timeouts are typically 4 seconds, rounded to closest.
//  * Disable by using 0. Defaults to 120.
//  */
// idleTimeout?: number;
// /** What permessage-deflate compression to use. uWS.DISABLED, uWS.SHARED_COMPRESSOR or any of the uWS.DEDICATED_COMPRESSOR_xxxKB. Defaults to uWS.DISABLED. */
// compression?: CompressOptions;
// /** Maximum length of allowed backpressure per socket when publishing or sending messages. Slow receivers with too high backpressure will be skipped until they catch up or timeout. Defaults to 1024 * 1024. */
// maxBackpressure?: number;
// /** Upgrade handler used to intercept HTTP upgrade requests and potentially upgrade to WebSocket.
//  * See UpgradeAsync and UpgradeSync example files.
//  */
// upgrade?: (res: HttpResponse, req: HttpRequest, context: us_socket_context_t) => void;
// /** Handler for new WebSocket connection. WebSocket is valid from open to close, no errors. */
// open?: (ws: WebSocket) => void;
// /** Handler for a WebSocket message. Messages are given as ArrayBuffer no matter if they are binary or not. Given ArrayBuffer is valid during the lifetime of this callback (until first await or return) and will be neutered. */
// message?: (ws: WebSocket, message: ArrayBuffer, isBinary: boolean) => void;
// /** Handler for when WebSocket backpressure drains. Check ws.getBufferedAmount(). Use this to guide / drive your backpressure throttling. */
// drain?: (ws: WebSocket) => void;
// /** Handler for close event, no matter if error, timeout or graceful close. You may not use WebSocket after this event. Do not send on this WebSocket from within here, it is closed. */
// close?: (ws: WebSocket, code: number, message: ArrayBuffer) => void;
// /** Handler for received ping control message. You do not need to handle this, pong messages are automatically sent as per the standard. */
// ping?: (ws: WebSocket, message: ArrayBuffer) => void;
// /** Handler for received pong control message. */
// pong?: (ws: WebSocket, message: ArrayBuffer) => void;

// Old Transport

// import express from 'express'
// import cors from 'cors'
// import { createServer } from 'http'

// import routes from './routes'

// // Initialize express HTTP server
// export const app = express()
// const server = createServer(app)

// // Middleware
// app.use(express.json())
// app.use(cors())

// // API
// app.use(routes)

// export default server
