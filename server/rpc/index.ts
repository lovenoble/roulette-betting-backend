import { Server, ServerCredentials } from '@grpc/grpc-js'

import { rpcUri } from '../config'
import { logger } from '../utils'
import { User, UserService } from './services'

export class RPCServer {
    credentials!: ServerCredentials
    server!: Server
    isStarted = false

    constructor() {
        // @NOTE: Perhaps add options to pass in a key/cert manually.
        // @NOTE: For now, the Nginx proxy is handling SSL
        this.credentials = ServerCredentials.createInsecure()
        // @NOTE: Need to properly configure server -> https://github.com/grpc/grpc-node/tree/master/packages/grpc-js
        this.server = new Server({
            'grpc.max_receive_message_length': -1,
            'grpc.max_send_message_length': -1,
        })
    }

    initServices() {
        this.server.addService(UserService, new User())
    }

    async start(): Promise<number> {
        if (this.isStarted) this.initServices()

        return new Promise((resolve, reject) => {
            this.server.bindAsync(rpcUri, this.credentials, (err, port) => {
                if (err) {
                    logger.error('RPC server failed to start.', err)
                    reject(err)
                }

                this.server.start()
                logger.info(`RPC server started on ${rpcUri}`)
                this.isStarted = true
                resolve(port)
            })
        })
    }

    async stop() {
        return this.server.forceShutdown()
    }
}

export default new RPCServer()
