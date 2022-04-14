import { Room, ServerError } from '@colyseus/core'
import { Dispatcher } from '@colyseus/command'

// Libraries
import PearHash from '../utils/PearHash'
import PlayerService from '../../store/services/Player'
import { OnGuestPlayerJoined, OnWalletUpdate, OnNewEntry } from '../commands/PlayerCommands'
import { OnFetchFareSupply, OnFetchRoundAndEntries } from '../commands/CryptoCommands'
import { SpinGameState } from '../schemas/SpinGameState'
import createLog from '../utils'
import PearCrypto from '../crypto'

const LOG_PATH = '[pears/defs/SpinGame]:'

const [logInfo, logError] = createLog(LOG_PATH)

export const pear = new PearCrypto()

class SpinGame extends Room<SpinGameState> {
	maxClients = 100
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
				logInfo('Password was set', password)
				hasPassword = true
			}

			this.setMetadata({
				name,
				desc,
				hasPassword,
			})

			// Get the game and token contract
			await this.pear.init()

			this.setState(new SpinGameState())

			this.dispatcher.dispatch(new OnFetchFareSupply(), { pear: this.pear })

			this.dispatcher.dispatch(new OnFetchRoundAndEntries(), {
				pear: this.pear,
				dispatcher: this.dispatcher,
				OnNewEntry,
				OnWalletUpdate,
			})

			this.onMessage('round-started', (client, message) => {
				console.log(message)
				this.state.roundStarted = message
				setTimeout(() => {}, 15000)
			})

			this.onMessage('vrfNum', (client, message) => {
				this.state.vrfNum = message
			})
		} catch (err) {
			// @NOTE: Need better error handling here. If this fails the state doesn't get set
			logError(err)
		}
	}

	async onAuth(client: any, options) { // eslint-disable-line
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

	async onJoin(client: any, options, auth) {
		try {
			const [authToken, guestUsername] = auth.split(':')
			console.log(authToken, guestUsername)
			// Fetch balances
			if (guestUsername) {
				this.dispatcher.dispatch(new OnGuestPlayerJoined(), {
					guestUsername: options.guestUsername,
					sessionId: client.sessionId,
				})
			} else if (authToken) {
				this.dispatcher.dispatch(new OnWalletUpdate(), {
					pear: this.pear,
					playerAddress: auth,
				})
			} else {
				throw new ServerError(400, 'Auth token does not exist.')
			}
		} catch (err) {
			// @NOTE: Need better error handling here. If this fails the state doesn't get set
			logError(err)
		}
	}

	onLeave(client: any) {
		// Remove player from state
		if (this.state.gamePlayers.has(client.auth)) {
			this.state.gamePlayers.delete(client.auth)
		} else if (this.state.guestPlayers.has(client.sessionId)) {
			this.state.guestPlayers.delete(client.sessionId)
		}
	}

	onDispose() {
		// @NOTE: Need to clear garbage here
		if (this.pear.pearTokenContract && this.pear.pearGameContract) {
			this.pear.pearTokenContract.removeAllListeners()
			this.pear.pearGameContract.removeAllListeners()
		}
		this.dispatcher.stop()
		logInfo('Disposing of SpinGame room...')
	}
}

export default SpinGame
