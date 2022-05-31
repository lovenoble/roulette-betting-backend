import * as grpc from '@grpc/grpc-js'
import type { Server, ServerCredentials } from '@grpc/grpc-js'

import { rpcUri } from '../config'
import { log } from './utils'
import PlayerRpcService from './services/PlayerRpcService'

export class RPCServer {
	credentials!: ServerCredentials
	rpcServer!: Server
	isStarted = false

	constructor() {
		// @NOTE: Perhaps add options to pass in a key/cert manually.
		// @NOTE: For now, the Nginx proxy is handling SSL
		this.credentials = grpc.ServerCredentials.createInsecure()
		this.rpcServer = new grpc.Server()
	}

	initServices() {
		// @NOTE: Include all created services inside of here
		this.rpcServer.addService(PlayerRpcService.proto, PlayerRpcService.methods)
	}

	async start(): Promise<number> {
		if (this.isStarted) this.initServices()

		return new Promise((resolve, reject) => {
			this.rpcServer.bindAsync(rpcUri, this.credentials, (err, port) => {
				if (err) reject(err)

				this.rpcServer.start()
				log(`RPC server started on ${rpcUri}`)
				this.isStarted = true
				resolve(port)
			})
		})
	}
}

export default new RPCServer()
