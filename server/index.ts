import pearServer from './pear'
import redisStore from './store'
import rpcServer from './rpc'
import { pearServerPort } from './config'
import { logger } from './utils'

async function init() {
	try {
		// If running multiple processes, ensures only one RPC server and RedisStore instance is created
		if (pearServerPort === 3100) {
			await redisStore.initialize()
			await redisStore.initQueue()
			await redisStore.initSmartContractListeners()
			await rpcServer.start()
		}

		// Initializes HTTP/WebSocket server
		// Configured to run multiple processes and round robin requests
		await pearServer.listen()

		// @NOTE: Need to add more exit eventListeners conditions
		process.once('SIGUSR2', () => {
			redisStore.disconnectAll()
			pearServer.stopAll()
			rpcServer.stop()
		})
	} catch (err) {
		logger.error(err)
		process.exit(1)
	}
}

await init()
