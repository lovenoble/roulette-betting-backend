import StoreConnection, { ConnectionStatus } from './store/StoreConnection'

import initRpcServer from './rpc'
import initGameServer from './initGameServer'
import { runWorkers } from './redis/worker'
import { removeAllContractListener } from './pears/crypto/utils'

const { GAME_SERVER_PORT, NODE_APP_INSTANCE } = process.env

// This approach binds each instance of the server on a different port
const gameServerPort = Number(GAME_SERVER_PORT || 3100) + Number(NODE_APP_INSTANCE || 0)

async function init() {
	try {
		process.once('SIGUSR2', () => {
			removeAllContractListener()
		})

		// Handle status changes in the store connection here
		StoreConnection.statusObserver((status: string) => {
			if (status === ConnectionStatus.Connected) {
				console.log('Connected to store successfully.')
			} else if (status === ConnectionStatus.Failed) {
				console.log('Failed to connect to store.')
			} else {
				console.log('Store status:', status)
			}
		})

		await StoreConnection.connect()

		await runWorkers()

		if (gameServerPort === 3100) {
			await initRpcServer()
		}

		await initGameServer(gameServerPort)
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

init()
