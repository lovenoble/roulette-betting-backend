import { Room, ServerError } from '@colyseus/core'
import type { Client } from '@colyseus/core'
import { Dispatcher } from '@colyseus/command'

// Libraries
import PearHash from '../utils/PearHash'
import PlayerService from '../../store/services/Player'
// import { OnGuestPlayerJoined, OnWalletUpdate, OnNewEntry } from '../commands/PlayerCommands'
// import { OnFetchFareSupply, OnFetchRoundAndEntries } from '../commands/CryptoCommands'
import { SpinState } from '../state/SpinState'
import PearCrypto from '../crypto'

export const pear = new PearCrypto()

class SpinGame extends Room<SpinState> {
	public maxClients = 2500 // @NOTE: Need to determine the number of clients where performance begins to fall off
	private name: string
	private desc: string
	private password: string | null = null
	private dispatcher = new Dispatcher(this)
	private pear = pear

	async onCreate(options: any) {
		try {
			const { name, desc, password } = options
			this.name = name
			this.desc = desc
			this.password = password

			let hasPassword = false
			if (password) {
				// @NOTE: Handle hashing password before setting the metadata
				console.log('Password was set', password)
				hasPassword = true
			}

			this.setMetadata({
				name,
				desc,
				hasPassword,
			})

			// Get the game and token contract
			// await this.pear.init()

			this.setState(new SpinState())

			// this.dispatcher.dispatch(new OnFetchFareSupply(), { pear: this.pear })

			// this.dispatcher.dispatch(new OnFetchRoundAndEntries(), {
			// 	pear: this.pear,
			// 	dispatcher: this.dispatcher,
			// 	OnNewEntry,
			// 	OnWalletUpdate,
			// })

			// this.onMessage('round-started', (client, message) => {
			// 	console.log(message)
			// 	this.state.roundStarted = message
			// 	setTimeout(() => {}, 15000)
			// })

			// this.onMessage('vrfNum', (client, message) => {
			// 	this.state.vrfNum = message
			// })
		} catch (err) {
			// @NOTE: Need better error handling here. If this fails the state doesn't get set
			console.error(err)
		}
	}

	async onAuth(_client: Client, options: any) {
		// eslint-disable-line
		// Validate token and get publicAddress for hashmap reference
		if (!options.authToken || !options.guestUsername)
			throw new ServerError(400, 'An identity is required to login.')

		if (options.guestUsername) {
			console.log('User logging in as guest with username:', options.guestUsername)
			return `guest:${options.guestUsername}`
		}

		if (options.authToken) {
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

			return playerStore.publicAddress
		}
	}

	async onAuthOld(_client: Client, options: any) {
		// eslint-disable-line
		// Validate token and get publicAddress for hashmap reference
		if (options.authToken) {
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

			return playerStore.publicAddress
		}
		if (options.guestUsername) {
			console.log('User logging in as guest with username:', options.guestUsername)
			return `guest:${options.guestUsername}`
		}
		throw new ServerError(400, 'An identity is required to login.')
	}

	async onJoin(client: Client, options: any, auth: any) {
		try {
			const [authToken, guestUsername] = auth.split(':')
			console.log(authToken, guestUsername)
			// Fetch balances

			if (guestUsername) {
				// this.dispatcher.dispatch(new OnGuestPlayerJoined(), {
				// 	guestUsername: options.guestUsername,
				// 	sessionId: client.sessionId,
				// })
			} else if (authToken) {
				// this.dispatcher.dispatch(new OnWalletUpdate(), {
				// 	pear: this.pear,
				// 	playerAddress: auth,
				// })
			} else {
				throw new ServerError(400, 'Auth token does not exist.')
			}
		} catch (err) {
			// @NOTE: Need better error handling here. If this fails the state doesn't get set
			console.error(err)
		}
	}

	onLeave(client: Client) {
		// Remove player from state
		if (this.state.players.has(client.sessionId)) {
			this.state.players.delete(client.sessionId)
		}
	}

	onDispose() {
		// @NOTE: Need to clear garbage here
		if (this.pear.pearTokenContract && this.pear.pearGameContract) {
			this.pear.pearTokenContract.removeAllListeners()
			this.pear.pearGameContract.removeAllListeners()
		}
		this.dispatcher.stop()
		console.log('Disposing of SpinGame room...')
	}
}

export default SpinGame

// Room text chat (your individual room)
// Room global text chat (chat shared between rooms for the game the user is playing)

// MediaStream (video, audio, screenshare, text)
// This only exists inside the room you are in

// Each metaverse room should have it's own instance of SpinGame
// Each metaverse room should have it's own instance of MediaStream
// Global text chat
// Metaverse room based text chat
