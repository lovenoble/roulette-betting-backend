import { Client, Room } from 'colyseus.js'
import { AnyAction } from '@reduxjs/toolkit'
import autoBind from 'auto-bind'


import constants from '../../../config/constants'
import * as types from '../types/chatRoom' // @NOTE: need to make this a global export
import { createLog } from '../utils'
import { RealtimeActions } from '../../../contexts/reducers/realtimeReducer'

const LOG_PATH = '[pears/services/Realtime]:'

const [logInfo, logError] = createLog(LOG_PATH)

class Realtime {
    public readonly types = types
    private client: Client
    private room?: Room<types.IRTChatState>
    private lobby!: Room
    private lobbySessionId?: string | null
    private dispatch!: React.Dispatch<AnyAction>
    private actions!: RealtimeActions

    public sessionId!: string

    constructor() {
        this.client = new Client(constants.ws)
        autoBind(this)
    }

    public defineDispatchActions(
        dispatch: React.Dispatch<AnyAction>,
        actions: RealtimeActions
    ) {
        this.dispatch = dispatch
        this.actions = actions
    }

    async joinLobbyRoom() {
        if (this.lobby && this.lobbySessionId) {
            logInfo('Player has already joined LobbyRoom:', this.lobbySessionId)
            return
        }

        this.lobby = await this.client.joinOrCreate(types.ChatRoomType.LOBBY)
        this.lobbySessionId = this.lobby.sessionId
        logInfo('Player has joined the match making lobby')

        this.lobby.onMessage('rooms', (rooms) => {
            this.dispatch(this.actions.setAvailableRooms(rooms))
        })

        this.lobby.onMessage('+', ([roomId, room]) => {
            this.dispatch(
                this.actions.addAvailableRoom({
                    roomId,
                    room,
                })
            )
        })

        this.lobby.onMessage('-', (roomId) => {
            this.dispatch(this.actions.removeAvailableRoom(roomId))
        })
    }

    async joinOrCreateChatRoom(authToken: string): Promise<string | void> {
        // @NOTE: need to allow for dynamic ChatRoomTypes to be passed through
        try {
            this.room = await this.client.joinOrCreate(
                types.ChatRoomType.GAME,
                {
                    authToken,
                }
            )

            this.sessionId = this.room.sessionId

            await this.initChatRoom()
        } catch (err: any) {
            throw new Error(err.toString())
        }
    }

    async leaveChatRoom() {
        if (!this.room) return

        await this.room.leave()
    }

    // Set up all realtime listeners here
    async initChatRoom() {
        if (!this.room)
            return logInfo('Room need to be created before initializing')

        // Connecting to another room so we leave matchmaking lobby
        await this.leaveLobbyRoom()

        this.sessionId = this.room.sessionId // @NOTE: Need to set sessionId here in RealtimeProvider

        // Ran anytime a new player is added
        this.room.state.players.onAdd = (
            player: types.IRTPlayer,
            key: string
        ) => {
            this.dispatch(
                this.actions.addPlayer({
                    id: key,
                    publicAddress: player.publicAddress,
                    username: player.username || '',
                })
            )
            // @NOTE: Uncomment bottom guard statement to ensure current user client
            // Doesn't subscribe to local changes from the server
            // if (key === this.sessionId) return

            // Track changes on every player
            // player.onChange = (changes) => {
            //     changes.forEach((change) => {
            //         const { field, value } = change

            //         logInfo('Player value changed -', field, value)
            //     })
            // }
        }

        // Ran anytime a player is removed
        this.room.state.players.onRemove = (
            player: types.IRTPlayer,
            key: string
        ) => {
            // Handle logic for whenever a player leaves the room
            this.dispatch(this.actions.removePlayer(key))
        }

        this.room.state.messages.onAdd = (
            message: types.IRTChatMessage,
            idx
        ) => {
            this.dispatch(this.actions.addChatMessage(message))
        }
    }

    sendChatRoomMessage(text: string) {
        this.room?.send(types.PearMessages.NEW_CHAT_MESSAGE, {
            text,
        })
    }

    async leaveLobbyRoom(): Promise<string | number> {
        try {
            if (!this.lobby) return 0
            const leaveStatus = await this.lobby.leave()
            this.lobbySessionId = null

            return leaveStatus
        } catch (err: any) {
            logError(err.toString())
            throw new Error(err.toString())
        }
    }

    async leaveAllConnectedRooms() {
        // @NOTE: Make sure all possible room connections are disconnected here

        if (this.lobby) {
            await this.lobby.leave()
        }

        if (this.room) {
            await this.room.leave()
        }
    }

    // Add additional methods to handle room events
}

export default Realtime
