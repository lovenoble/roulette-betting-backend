import PearServer from './pear'
import redisStore from './store'
// import initRpcServer from './rpc'

async function init() {
	// @NOTE: Need to add more exit eventListeners
	process.once('SIGUSR2', () => {
		// Handles cleaning up on exit, error, or close
		// removeAllContractListener()
		// @NOTE: Stop bullmq workers here
	})

	// @NOTE: Combine these into one command
	await redisStore.initialize()
	await redisStore.initQueue()
	await redisStore.initSmartContractListeners()

	const pearServer = new PearServer()
	await pearServer.listen()

	// If running multiple processes, ensures only one RPC server instance is created
	// if (pearServerPort === 3100) {
	// 	await initRpcServer()
	// }
}

init().catch(err => {
	console.error(err)
	process.exit(1)
})
