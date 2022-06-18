import { uWebSocketsTransport } from '@colyseus/uwebsockets-transport'
import type { TemplatedApp } from 'uWebSockets.js'
import type { Express } from 'express'
import type { Server } from 'http'

import type { ITransportOptions } from './types'
import {
	transportOptions as defaultTransportOptions,
	appOptions as defaultAppOptions,
	pearMonitorPort as defaultPearMonitorPort,
} from '../config/transport.config'
import { logger } from './utils'
import createRoutes from './routes'
import createMonitorDashboard from './monitor'

/** Create HTTP/WS server instance
 * Used as the transport layer for state syncing - This is imported by `server/pear/index.ts`
 * Additionally, handles general HTTP and WS requests defined in `server/transport/routes.ts`
 */
export class Transport {
	instance!: uWebSocketsTransport
	app!: TemplatedApp
	#pearMonitor: ReturnType<typeof createMonitorDashboard>
	pearMonitorPort = defaultPearMonitorPort
	pearMonitorServer?: Server
	logger = logger

	constructor({
		transportOpts = defaultTransportOptions,
		appOpts = defaultAppOptions,
		pearMonitorPort = defaultPearMonitorPort,
	}: ITransportOptions) {
		// Create new uWebSocketsTransport instance
		this.instance = new uWebSocketsTransport(transportOpts, appOpts)
		this.app = this.instance.app
		this.pearMonitorPort = pearMonitorPort

		// Create routes from transport instance
		createRoutes(this.app)
		logger.info(`Created (HTTP/WS) routes for transport`)
	}

	async startMonitorDashboard(newPearMonitorPort?: number): Promise<Express> {
		return new Promise((resolve, reject) => {
			this.pearMonitorPort = newPearMonitorPort || this.pearMonitorPort
			this.#pearMonitor = createMonitorDashboard()
			this.pearMonitorServer = this.#pearMonitor
				.listen(this.pearMonitorPort, () => {
					logger.info(`Pear monitor dashboard running on port ${this.pearMonitorPort}...`)
					resolve(this.#pearMonitor)
				})
				.on('error', reject)
		})
	}

	async stopMonitorDashboard() {
		return new Promise((resolve, reject) => {
			if (this.pearMonitorServer) {
				this.pearMonitorServer.close(err => {
					if (err) reject(err)
					const successMsg = `Pear monitor dashboard closed (port: ${this.pearMonitorPort})`
					logger.info(successMsg)
					resolve(successMsg)
				})
			}
		})
	}

	async stopAll() {
		if (this.instance) {
			await this.stopMonitorDashboard()
			this.instance.shutdown()
			this.logger.info('Transport server has been stopped.')
		}
	}
}

export default new Transport({})
