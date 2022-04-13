import { Client, Room } from 'colyseus.js'
import { AnyAction } from '@reduxjs/toolkit'
import autoBind from 'auto-bind'

import constants from '../../../config/constants'
import * as types from '../../../contexts/reducers/types/metaverse'
import { createLog } from '../utils'
import { MetaverseActions } from '../../../contexts/reducers/metaverseReducer'

const LOG_PATH = '[pears/services/MetaverseService]:'

const [logInfo, logError] = createLog(LOG_PATH)

class MetaverseService {
    public readonly types = types
    public roomName = 'pear-metaverse'
    private client: Client
    private room?: Room<types.IPearMetaverseState>
    private lobby!: Room
    private lobbySessionId?: string | null
    private dispatch!: React.Dispatch<AnyAction>
    private actions!: MetaverseActions

    public sessionId!: string

    constructor() {
        this.client = new Client(constants.ws)
        autoBind(this)
    }

    public defineDispatchActions(
        dispatch: React.Dispatch<AnyAction>,
        actions: MetaverseActions
    ) {
        this.dispatch = dispatch
        this.actions = actions
    }

    async joinOrCreateMetaverse(username: string): Promise<string | void> {
        // @NOTE: need to allow for dynamic ChatRoomTypes to be passed through
        try {
            console.log('JOINING METAVERSE!!!!!')
            this.room = await this.client.joinOrCreate('pear-metaverse', {
                username,
            })

            this.sessionId = this.room.sessionId

            await this.initMetaverse()
        } catch (err: any) {
            throw new Error(err.toString())
        }
    }

    async leaveChatRoom() {
        if (!this.room) return

        await this.room.leave()
    }

    // Set up all realtime listeners here
    async initMetaverse() {
        if (!this.room)
            return logInfo('Room need to be created before initializing')

        // Connecting to another room so we leave matchmaking lobby
        // await this.leaveLobbyRoom()

        this.sessionId = this.room.sessionId // @NOTE: Need to set sessionId here in RealtimeProvider
        console.log('Metaverse initialized...')
        // Ran anytime a new player is added
        // @ts-ignore
        this.room.state.metaversePlayers.onAdd = (
            metaversePlayer: types.IMetaversePlayer,
            key: string
        ) => {
            console.log(metaversePlayer)
            this.dispatch(
                this.actions.setMetaversePlayer({
                    sessionId: key,
                    username: metaversePlayer.username,
                    moveX: metaversePlayer.moveX,
                    moveY: metaversePlayer.moveY,
                    moveZ: metaversePlayer.moveZ,
                    rotateX: metaversePlayer.rotateX,
                    rotateY: metaversePlayer.rotateY,
                    rotateZ: metaversePlayer.rotateZ,
                })
            )

            // @ts-ignore
            metaversePlayer.onChange = (changes) => {
                const changePlayer: { [key: string]: any } = {}
                changes.forEach(({ field, value }: any) => {
                    changePlayer[field] = value
                })
                this.dispatch(this.actions.updateMetaversePlayer({
                    sessionId: key,
                    ...changePlayer
                }))
            }
        }

        // @ts-ignore
        this.room.state.metaversePlayers.onRemove = (
            metaversePlayer: types.IMetaversePlayer,
            key: string
        ) => {
            this.dispatch(this.actions.removeMetaversePlayer(key))
        }
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
        console.log('hit')
        // @NOTE: Make sure all possible room connections are disconnected here

        if (this.lobby) {
            console.log('hitttt')
            await this.lobby.leave()
        }

        if (this.room) {
            console.log('HITTT')
            await this.room.leave()
        }
    }
}

export default MetaverseService
