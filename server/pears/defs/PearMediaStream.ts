import { Room, Client, ServerError } from 'colyseus'
import { Dispatcher } from '@colyseus/command'

import {
	PearMediaStreamState,
	PearMediaUser,
	PearScreenShare,
} from '../schemas/PearMediaStreamState'
import PearMessages from '../types/PearMessages'

const { NEW_SCREEN_SHARE, STOP_SCREEN_SHARE, TOGGLE_SCREEN_SHARE } = PearMessages

export default class PearMediaStream extends Room<PearMediaStreamState> {
	maxClients = 100
	private name: string
	private desc: string
	private password: string | null = null
	private dispatcher = new Dispatcher(this)

	onCreate(options: any) {
		console.log('CREATED MEDIA STREAM')

		this.setState(new PearMediaStreamState())
		const { name, desc, password } = options
		this.name = name
		this.desc = desc
		this.password = password
		this.autoDispose = false

		this.onMessage(NEW_SCREEN_SHARE, (client, peerId: string) => {
			if (!this.state.pearScreenShares.has(client.sessionId)) {
				const newScreenShare = new PearScreenShare(peerId, 'need_public_address')
				this.state.pearScreenShares.set(client.sessionId, newScreenShare)
			}
		})

		this.onMessage(TOGGLE_SCREEN_SHARE, (client, isOn: boolean) => {
			if (this.state.pearScreenShares.has(client.sessionId)) {
				this.state.pearScreenShares.get(client.sessionId).isScreenSharing = isOn
			}
		})

		this.onMessage(STOP_SCREEN_SHARE, client => {
			if (!this.state.pearScreenShares.has(client.sessionId)) {
				this.state.pearScreenShares.delete(client.sessionId)
			}
		})
	}

	static async onAuth(client: any, options) {
		// Validate token and get publicAddress for hashmap reference
		// const { publicAddress } = await PearHash.decodeJwt(options.authToken)
		// if (!publicAddress) {
		//     throw new ServerError(400, 'Invalid access token.')
		// }

		// const playerStore = await PlayerService.model.findOne(
		//     {
		//         publicAddress,
		//     },
		//     '_id username publicAddress'
		// ) // @NOTE: Need to assign and return session token here

		// if (!playerStore) {
		//     throw new ServerError(400, 'Invalid access token.')
		// }

		// return playerStore.publicAddress
		if (!options.authToken) {
			throw new ServerError(400, 'Invalid access token.')
		}
		return options.authToken
	}

	onJoin(client: Client, options: any) {
		this.state.connectedUsers.set(
			client.sessionId,
			new PearMediaUser({
				publicAddress: options.authToken,
				nickName: 'Something',
				callId: options.callId,
			})
		)
	}

	onLeave(client: Client) {
		if (this.state.connectedUsers.has(client.sessionId)) {
			this.state.connectedUsers.delete(client.sessionId)
		}
		if (this.state.pearScreenShares.has(client.sessionId)) {
			this.state.pearScreenShares.delete(client.sessionId)
		}
	}

	// onDispose() {
	// }
}
