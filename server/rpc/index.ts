import * as grpc from '@grpc/grpc-js'

import PlayerRpcService from './services/PlayerRpcService'

const { RPC_PORT = 9090 } = process.env

export default async function initRpcServer() {
	try {
		const RPC_URI = `0.0.0.0:${RPC_PORT}`
		let serverCredentials = grpc.ServerCredentials.createInsecure()

		const rpcServer = new grpc.Server()

		rpcServer.addService(PlayerRpcService.proto, PlayerRpcService.methods)
		rpcServer.bindAsync(RPC_URI, serverCredentials, () => {
			rpcServer.start()
			console.log(`RPC server started on ${RPC_URI}`)
		})
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}
