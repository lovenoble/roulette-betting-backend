import { Room, ServerError } from '@colyseus/core'
import { Dispatcher } from '@colyseus/command'
import shortId from 'shortid'

// Libraries
import PlayerService from '../../store/services/Player'
import { Player } from '../schemas/ChatRoomState'
import PearHash from '../utils/PearHash'
import { ShapesState, Shape } from '../schemas/ShapesSchema'
import { IChatRoomData } from '../types/Rooms'
import PearMessages from '../types/PearMessages'
import { createLog } from '../utils'

const LOG_PATH = '[pears/defs/Shapes]:'

const [logInfo, logError] = createLog(LOG_PATH)

class ChatRoom extends Room<ShapesState> {
    maxClients = 100
    private name: string
    private desc: string
    private password: string | null = null
    private dispatcher = new Dispatcher(this)

    async onCreate(options: IChatRoomData) {
        try {
            const { name, desc, password } = options
            this.name = name
            this.desc = desc
            this.password = password

            let hasPassword = false
            if (password) {
                // @NOTE: Handle hashing password before setting the metadata
                logInfo('Password was set', password)
                hasPassword = true
            }

            this.setMetadata({
                name,
                desc,
                hasPassword,
            })

            this.setState(new ShapesState())
            this.state.shapes.set(shortId, new Shape())

            // Iterate over existing messages and add them to theShapesState
            // Potentially created a new map here and pass it into state at once
            this.onMessage(PearMessages.SET_SHAPE_POSITION, (client, message) => {
                const { token } = message

                if (token) {
                    logInfo('Players token should be here:', token)
                }

                const newShape = new Shape()

                // @NOTE: Add a better way to handle creating the messageId
                this.state.shapes.set(shortId(), newShape)
            })
        } catch (err) {
            // @NOTE: Need better error handling here. If this fails the state doesn't get set
            logError(err)
        }
    }

    async onAuth(client: any, options) {
        // Validate token and get publicAddress for hashmap reference
        const { publicAddress } = await PearHash.decodeJwt(options.authToken)

        if (!publicAddress) {
            throw new ServerError(400, 'Invalid access token.')
        }
        const playerStore = await PlayerService.model.findOne(
            {
                publicAddress,
            },
            '_id username publicAddress'
        ) // @NOTE: Need to assign and return session token here

        if (!playerStore) {
            throw new ServerError(400, 'Invalid access token.')
        }

        const joinedPlayer = new Player({
            username: playerStore.username,
            publicAddress: playerStore.publicAddress,
        })
        this.state.players.set(client.sessionId, joinedPlayer)
        return playerStore.publicAddress
    }

    async onJoin(client: any, options, auth) {
        try {
        } catch (err) {
            // @NOTE: Need better error handling here. If this fails the state doesn't get set
            logError(err)
        }
    }

    onLeave(client: any, options: any) {
        // Remove player from state
        if (this.state.players.has(client.sessionId)) {
            this.state.players.delete(client.sessionId)
        }
    }

    onDispose() {
        // @NOTE: Need to clear garbage here
        logInfo('Disposing shape state')
    }
}

export default ChatRoom
