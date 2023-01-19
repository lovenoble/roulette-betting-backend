import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { Server, ServerCredentials } from '@grpc/grpc-js'
import { addReflection } from 'grpc-server-reflection'

import { rpcUri, RPC_PORT } from '../config'
import { logger } from './utils'
import {
  User,
  UserService,
  Admin,
  AdminService,
  Analytics,
  AnalyticsService,
  Health,
  HealthService,
  healthStatus,
} from './services'
import { HealthCheckResponse_ServingStatus } from './models/health'
import { ServicePathNames } from './types'

const __filename = fileURLToPath(import.meta.url)

export class RPCServer {
  server!: Server
  #credentials!: ServerCredentials
  #isStarted = false
  #descriptorPath = path.join(dirname(__filename), 'descriptor/proto_descriptor.bin')
  #rpcPort = RPC_PORT
  #rpcUri = rpcUri

  public get rpcPort() {
    return this.#rpcPort
  }

  public get rpcUri() {
    return this.#rpcUri
  }

  public get isStarted() {
    return this.#isStarted
  }

  constructor() {
    // @NOTE: Perhaps add options to pass in a key/cert manually.
    // @NOTE: For now, the Nginx proxy is handling SSL
    this.#credentials = ServerCredentials.createInsecure()

    // @NOTE: Need to properly configure server -> https://github.com/grpc/grpc-node/tree/master/packages/grpc-js
    this.server = new Server({
      'grpc.max_receive_message_length': -1,
      'grpc.max_send_message_length': -1,
    })

    // Add descriptor_bin so clients can use reflections to see the supported API schema
    addReflection(this.server, this.#descriptorPath)
  }

  initServices() {
    this.server.addService(HealthService, new Health())
    this.server.addService(AnalyticsService, new Analytics())
    this.server.addService(UserService, new User())
    this.server.addService(AdminService, new Admin())
  }

  /*
        Changes the health status for a given service.
    */
  changeHealthServingStatus(
    servicePathName: ServicePathNames,
    servingStatus: HealthCheckResponse_ServingStatus,
  ) {
    healthStatus.set(servicePathName, servingStatus)
    logger.info(`[${servicePathName}]: Health serving staus changed to ${servingStatus}`)
  }

  async start(): Promise<number> {
    if (this.#isStarted) this.initServices()

    this.initServices()

    return new Promise((resolve, reject) => {
      this.server.bindAsync(rpcUri, this.#credentials, (err, port) => {
        if (err) {
          logger.error(new Error(`RPC server failed to start: ${err.toString()}`))
          reject(err)
        }

        this.server.start()
        logger.info(`RPC server started on port ${this.rpcPort}...`)
        this.#isStarted = true
        resolve(port)
      })
    })
  }

  async stop() {
    if (!this.#isStarted) return null

    return this.server.forceShutdown()
  }
}

export default new RPCServer()
