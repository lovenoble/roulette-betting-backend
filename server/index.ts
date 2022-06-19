import pearServer from './pear'
import redisStore from './store'
import rpcServer from './rpc'
import transport from './transport'
import logger from './utils/logger'
import { pearServerPort, isDev } from './config'
// import cryptoAdmin from './crypto/admin'

// Handle stopping processes on exit, error, or shutdown
function stopAllProcesses() {
	logger.info('Stopping all processes...')
	redisStore.disconnectAll()
	pearServer.stopAll()
	rpcServer.stop()
	transport.stopAll()
}

async function init() {
	try {
		// If running multiple processes, ensures only one RPC server and RedisStore instance is created
		if (pearServerPort === 3100) {
			// @NOTE: Setup clustering for Redis
			await redisStore.initialize()
			await redisStore.initQueue()
			await redisStore.initSmartContractListeners()

			// FOR TESTNET AND LOCAL DEV: Create seed test accounts and init admin methods
			// await cryptoAdmin.init()

			// Initializes gRPC server with reflection enabled (default port: 9090)
			await rpcServer.start()
		}

		// Initializes HTTP/WebSocket server (default port: 3100)
		// Configured to run multiple processes and round robin requests
		await pearServer.listen()

		// Pear monitor dashboard (default port: 4200)
		if (isDev) {
			await transport.startMonitorDashboard()
		}

		// @NOTE: Need to add more exit eventListeners conditions
		process.once('SIGUSR2', stopAllProcesses)
	} catch (err) {
		logger.error(err)
		process.exit(1)
	}
}

init()
