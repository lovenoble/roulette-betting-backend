import { PlayerClient } from './protos/generated/PlayerServiceClientPb'
import playerMessages from './protos/generated/player_pb'
import constants from '../../config/constants'

const { NODE_ENV } = process.env

class RPCClient {
    public playerClient: PlayerClient
    public playerMessage = playerMessages

    constructor(host: string, port: string, protocol: string) {
        let rpcUri = `${protocol}://${host}:${port}`

        if (NODE_ENV === 'production') {
            rpcUri = `${protocol}://${host}/rpc`
        }

        this.playerClient = new PlayerClient(
            rpcUri,
            null,
            null
        )
    }
}

export default new RPCClient(constants.rpc.host, constants.rpc.port, constants.rpc.protocol)
