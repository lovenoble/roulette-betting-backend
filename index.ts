import pearServer from './pear'
import redisStore from './store'
// import rpcServer from './rpc'
import transport from './transport'
import slackBotServer from './notifications/slack'
import logger from './utils/logger'
import { pearServerPort, isDev } from './config'
// import cryptoAdmin from './crypto/admin'

// Handle stopping processes on exit, error, or shutdown
function stopAllProcesses() {
  logger.info('Stopping all processes...')
  redisStore.disconnectAll()
  pearServer.stopAll()
  transport.stopAll()
}

async function init() {
  try {
    // Initialize slack bot and dependency inject logger
    if (process.env.NODE_ENV === 'production') {
      try {
        slackBotServer.setLogger(logger)
        await slackBotServer.initServer()
      } catch (err) {
        logger.error(err)
      }
    }

    // If running multiple processes, ensures only one RPC server and RedisStore instance is created
    if (pearServerPort === 3100) {
      // @NOTE: Setup clustering for Redis
      await redisStore.initialize()
      await redisStore.initQueue()
      await redisStore.initSmartContractListeners()
    }

    // Initializes HTTP/WebSocket server (default port: 3100)
    // Configured to run multiple processes and round robin requests
    await pearServer.listen()

    // Pear monitor dashboard (default port: 4200)
    if (isDev || process.env.FARE_STATE_MONITOR_PASSWORD) {
      await transport.startMonitorDashboard()
    }

    // @NOTE: Need to add more exit eventListeners conditions
    process.once('SIGUSR2', stopAllProcesses)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

init()
