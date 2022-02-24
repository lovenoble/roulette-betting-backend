import * as grpc from '@grpc/grpc-js'
import fs from 'fs'
import path from 'path'

import PlayerRpcService from './services/PlayerRpcService'

const { DOMAIN, NODE_ENV, RPC_PORT = 9090, CERTS_DIR } = process.env

export async function initializeRpcServer() {
	try {
		const RPC_URI = `0.0.0.0:${RPC_PORT}`
		let serverCredentials = grpc.ServerCredentials.createInsecure()

		// if (NODE_ENV === 'production') {
		// 	serverCredentials = grpc.ServerCredentials.createSsl(
		// 		fs.readFileSync(path.join(CERTS_DIR, 'cert.pem')),
		// 		[
		// 			{
		// 				private_key: fs.readFileSync(path.join(CERTS_DIR, 'privkey.pem')),
		// 				cert_chain: fs.readFileSync(path.join(CERTS_DIR, 'fullchain.pem')),
		// 			}
		// 		],
        //         true,
		// 	)
		// }

		const rpcServer = new grpc.Server()
		rpcServer.addService(PlayerRpcService.proto.Player.service, PlayerRpcService.methods)
		rpcServer.bindAsync(RPC_URI, serverCredentials, () => {
			rpcServer.start()
			console.log(`RPC server started on ${RPC_URI}`)
		})
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}
