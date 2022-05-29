// import initRpcServer from './rpc'
import PearServer from './pear'
import redisStore from './store'

// import { runWorkers } from './redis/worker'
// import { removeAllContractListener } from './pear/crypto/utils'

// import defineEvents from '../../redis/event'

// defineEvents()

async function init() {
	// @NOTE: Need to add more exit eventListeners
	process.once('SIGUSR2', () => {
		// Handles cleaning up on exit, error, or close
		// removeAllContractListener()
		// @NOTE: Stop bullmq workers here
	})

	await redisStore.initialize()
	await redisStore.initQueue()
	await redisStore.startSmartContractListeners()

	const pearServer = new PearServer()
	await pearServer.listen()

	// Runs bullmq workers
	// await runWorkers()

	// If running multiple processes, ensures only one RPC server instance is created
	// if (pearServerPort === 3100) {
	// 	await initRpcServer()
	// }

	// await initGameServer(pearServerPort)
}

init().catch(err => {
	console.error(err)
	process.exit(1)
})
