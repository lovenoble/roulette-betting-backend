import express from 'express'
import basicAuth from 'express-basic-auth'
import { monitor } from '@colyseus/monitor'

import { pearMonitorPassword } from '../config/transport.config'

/** Colyseus monitor dashboard
 * This should not be used in production.
 * This is for development and debugging locally
 */
export default function createMonitorDashboard() {
	const pearMonitor = express()

	const basicAuthMiddleware = basicAuth({
		users: {
			// Schema - [username]: password
			admin: pearMonitorPassword,
			bradford: pearMonitorPassword,
		},
		challenge: true,
	})

	// Middleware
	pearMonitor.use('/pear-monitor', basicAuthMiddleware, monitor())

	return pearMonitor
}
