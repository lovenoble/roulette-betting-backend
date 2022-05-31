import pearServer from './pear'
import redisStore from './store'
import rpcServer from './rpc'
import { pearServerPort } from './config'

async function init() {
	// If running multiple processes, ensures only one RPC server and RedisStore instance is created
	if (pearServerPort === 3100) {
		await redisStore.initialize()
		await redisStore.initQueue()
		await redisStore.initSmartContractListeners()
		await rpcServer.start()
	}

	await pearServer.listen()

	// @NOTE: Need to add more exit eventListeners conditions
	process.once('SIGUSR2', () => {
		redisStore.disconnectAll()
		pearServer.stopAll()
		rpcServer.stop()
	})
}

init().catch(err => {
	console.error(err)
	process.exit(1)
})
