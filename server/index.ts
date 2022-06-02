import pearServer from './pear'
import redisStore from './store'
import rpcServer from './rpc'
import { pearServerPort } from './config'
import logger from './utils/logger'
import PubSub from './pubsub'

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

		// setInterval(() => {
		// 	PubSub.pub<'round-concluded'>('spin-state', 'round-concluded', {
		// 		roundId: 1,
		// 		randomNum: 123,
		// 		randomEliminator: '123123123',
		// 		vrfRequestId: 'asdlmkqldw',
		// 		isEliminator: false,
		// 	})
		// }, 5000)

		// PubSub.sub('spin-state', 'round-concluded').listen<'round-concluded'>(round => {
		// 	console.log(round)
		// })

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
