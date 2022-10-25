import { Client, Room } from 'colyseus.js'
import { AnyAction } from '@reduxjs/toolkit'
import autoBind from 'auto-bind'

import constants from '../../../config/constants'
import * as types from '../../../contexts/reducers/types/pear' // @NOTE: need to make this a global export
import { createLog } from '../utils'
import { PearActions } from '../../../contexts/reducers/pearReducer'
import { entries } from 'lodash-es'

const LOG_PATH = '[pears/services/ColorGame]:'
const COLOR_GAME_ROOM = 'color-game'

const [logInfo, logError] = createLog(LOG_PATH)

class ColorGame {
    public readonly types = types
    private client: Client
    private room?: Room<types.IPearState>
    private lobby!: Room
    private lobbySessionId?: string | null
    private dispatch!: React.Dispatch<AnyAction>
    private actions!: PearActions
    public myAddr: string
    public guestUsername?: string

    public sessionId!: string

    constructor(myAddr: string, guestUsername?: string) {
        this.myAddr = myAddr
        this.guestUsername = guestUsername
        this.client = new Client(constants.ws)
        autoBind(this)
    }

    public defineDispatchActions(
        dispatch: React.Dispatch<AnyAction>,
        actions: PearActions
    ) {
        this.dispatch = dispatch
        this.actions = actions
    }

    async joinOrCreateColorGame(authToken: string, guestUsername: string): Promise<string | void> {
        // @NOTE: need to allow for dynamic ChatRoomTypes to be passed through
        try {
            const options: any = {}

            if (authToken) {
                options.authToken = authToken
            } else {
                options.guestUsername = guestUsername
            }

            this.room = await this.client.joinOrCreate(COLOR_GAME_ROOM, options)

            this.sessionId = this.room.sessionId

            await this.initColorGame()
        } catch (err: any) {
            throw new Error(err.toString())
        }
    }

    async leaveColorGame() {
        if (!this.room) return

        await this.room.leave()
    }

    // Set up all realtime listeners here
    async initColorGame() {
        if (!this.room)
            return logInfo('Room need to be created before initializing')

        this.sessionId = this.room.sessionId // @NOTE: Need to set sessionId here in RealtimeProvider

        console.log('Color game joined!')

        // @ts-ignore
        this.room.state.onChange = (newState: any) => {
            const currentRoundId: any = newState.filter((state: any) => state.field === 'currentRoundId')[0]
            const pearSupply: any = newState.filter((state: any) => state.field === 'pearSupply')[0]

            if (pearSupply) {
                if (pearSupply.value !== pearSupply.previousValue) {
                    this.dispatch(this.actions.setPearSupply(pearSupply.value))
                }
            }

            if (currentRoundId) {
                if (currentRoundId.value !== currentRoundId.previousValue) {
                    this.dispatch(
                        this.actions.setCurrentRoundId(currentRoundId.value)
                    )
                }
            }

        }


        // @ts-ignore
        this.room.state.entries.onChange = (round: types.IEntry[], key: string) => {
            const entryList: types.IEntry[] = []

            // @ts-ignore
            // This should really be rounds -> entries -> entry
            round.list.forEach((entry: types.IEntry) => {
                const ent: types.IEntry = {
                    roundId: key,
                    publicAddress: entry.publicAddress,
                    pickedColor: entry.pickedColor,
                    amount: entry.amount,
                    winAmount: entry.winAmount,
                    isSettled: entry.isSettled,
                    result: entry.result,
                }

                entryList.push(ent)

            })

            this.dispatch(this.actions.setRound({
                id: key,
                entryList,
            }))
        }

        // @ts-ignore
        this.room.state.entries.onAdd = (round: types.IEntry[], key: string) => {
            const entryList: types.IEntry[] = []
            // @ts-ignore
            // This should really be rounds -> entries -> entry
            round.list.forEach((entry: types.IEntry) => {
                const ent: types.IEntry = {
                    roundId: key,
                    publicAddress: entry.publicAddress,
                    pickedColor: entry.pickedColor,
                    amount: entry.amount,
                    winAmount: entry.winAmount,
                    isSettled: entry.isSettled,
                    result: entry.result,
                }
                entryList.push(ent)
            })

            // @ts-ignore
			round.list.onAdd = ((playerEntry: any, entryId: any) => {
                const ent: types.IEntry = {
                    roundId: key,
                    publicAddress: playerEntry.publicAddress,
                    pickedColor: playerEntry.pickedColor,
                    amount: playerEntry.amount,
                    winAmount: playerEntry.winAmount,
                    isSettled: playerEntry.isSettled,
                    result: playerEntry.result,
                }
                this.dispatch(this.actions.addEntry({
                    id: key, entryId, ...ent,
                }))
            })

            this.dispatch(this.actions.setRound({
                id: key,
                entryList,
            }))
        }

        // @ts-ignore
        this.room.state.guestPlayers.onAdd = (
            guestPlayer: types.IGuestPlayer,
            key: string,
        ) => {
            console.log('New Guest Player', key, guestPlayer)
        }

        // Ran anytime a new player is added
        // @ts-ignore
        this.room.state.gamePlayers.onAdd = (
            gamePlayer: types.IWallet,
            key: string
        ) => {
            if (!gamePlayer.publicAddress) return

            const walletInfo = {
                id: key,
                publicAddress: gamePlayer.publicAddress,
                ethBalance: gamePlayer.ethBalance,
                pearBalance: gamePlayer.pearBalance,
                queueBalance: gamePlayer.queueBalance,
                prizeBalance: gamePlayer.prizeBalance,
            }

            if (gamePlayer.publicAddress === this.myAddr) {
                this.dispatch(
                    this.actions.setMyWallet(walletInfo)
                )
            } else {
                this.dispatch(
                    this.actions.setPlayerWallet(walletInfo)
                )
            }

            // @ts-ignore
            gamePlayer.onChange = (changes) => {
                const newValues: any = {}
                changes.forEach((change: any) => {
                    const { field, value } = change
                    newValues[field] = value
                })
                const payload = {
                    id: key,
                    ...newValues,
                }
                this.dispatch(
                    key === this.myAddr || this.room?.sessionId
                        ? this.actions.setMyWallet(payload)
                        : this.actions.setPlayerWallet(payload)
                )
            }
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
        // @ts-ignore
        this.room.state.gamePlayers.onRemove = (
            gamePlayer: types.IWallet,
            key: string
        ) => {
            // Handle logic for whenever a player leaves the room
            this.dispatch(this.actions.removePlayer(key))
        }

    }
}

export default ColorGame
