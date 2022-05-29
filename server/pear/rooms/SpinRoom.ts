import { Room, ServerError } from '@colyseus/core'
import type { Client } from '@colyseus/core'
import { Dispatcher } from '@colyseus/command'

// Libraries
import { EventNames } from '../../store/constants'
import { SpinEvent, FareEvent } from '../../store/event'
import { OnBatchEntry, OnBatchEntrySettled } from '../commands/SpinCommands'
import { SpinState } from '../state/SpinState'

// @NOTE: Determine user balancing for room capacity - [spin-room-1: 1800, spin-room-2: 600]
// @NOTE: VIP room rentals for FARE token (smart contract)

const fareEvent = FareEvent()
const spinEvent = SpinEvent()

// spinEvent.on('completed', ({ jobId, returnvalue, prev }, id) => {
// spinEvent.on('completed', ({ returnvalue }) => {
//     try {
//         if (!returnvalue) return

//         const { eventName, data }: IEventReturnData = JSON.parse(returnvalue)

//         console.log(eventName, data)

//         switch (eventName) {
//             case EventNames.GameModeUpdated:
//                 console.log(eventName)
//                 break
//             case EventNames.EntrySubmitted:
//                 console.log(eventName)
//                 break
//             case EventNames.RoundConcluded:
//                 console.log(eventName)
//                 break
//             case EventNames.EntrySettled:
//                 console.log(eventName)
//                 break
//             default:
//                 throw new Error(`[QueueEvent:Spin] Invalid event name ${eventName}`)
//         }
//     } catch (err) {
//         // @NOTE: Need error catching here, most likely error is a JSON parsing issue
//         console.error(err)
//     }
// })

class SpinGame extends Room<SpinState> {
	public maxClients = 2500 // @NOTE: Need to determine the number of clients where performance begins to fall off
	private name: string
	private desc: string
	private password: string | null = null
	private dispatcher = new Dispatcher(this)

	defineEvents() {
		spinEvent.on('completed', ({ returnvalue }) => {
			try {
				if (!returnvalue) return

				const { eventName, data } = JSON.parse(returnvalue)

				console.log(eventName, data)

				switch (eventName) {
					case EventNames.GameModeUpdated:
						console.log(eventName)
						break
					case EventNames.EntrySubmitted:
						this.dispatcher.dispatch(new OnBatchEntry(), data)
						console.log(eventName)
						break
					case EventNames.RoundConcluded:
						console.log(eventName)
						break
					case EventNames.EntrySettled:
						this.dispatcher.dispatch(new OnBatchEntrySettled(), data)
						console.log(eventName)
						break
					default:
						throw new Error(`[QueueEvent:Spin] Invalid event name ${eventName}`)
				}
			} catch (err) {
				// @NOTE: Need error catching here, most likely error is a JSON parsing issue
				console.error(err)
			}
		})
	}

	async onCreate(options: any) {
		try {
			console.log('CREATED!')
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

			this.setState(new SpinState())

			// @NOTE: Define WebSocket message handling here
			// Define Redis pubsub events
			this.defineEvents()
		} catch (err) {
			// @NOTE: Need better error handling here. If this fails the state doesn't get set
			console.error(err)
		}
	}

	// async onAuth(_client: Client, options: any) {
	// // @NOTE: Need to rework how we identify guestUsers
	// // Validate token and get publicAddress for hashmap reference
	// if (options.authToken) {
	// 	const { publicAddress } = await PearHash.decodeJwt(options.authToken)
	// 	if (!publicAddress) {
	// 		throw new ServerError(400, 'Invalid access token.')
	// 	}
	// 	const playerStore = await PlayerService.model.findOne(
	// 		{
	// 			publicAddress,
	// 		},
	// 		'_id username publicAddress'
	// 	) // @NOTE: Need to assign and return session token here
	// 	if (!playerStore) {
	// 		throw new ServerError(400, 'Invalid access token.')
	// 	}
	// 	return playerStore.publicAddress
	// }
	// if (options.guestUsername) {
	// 	console.log('User logging in as guest with username:', options.guestUsername)
	// 	return `guest:${options.guestUsername}`
	// }
	// throw new ServerError(400, 'An identity is required to login.')
	// }

	async onJoin(client: Client, _options: any, auth: any) {
		console.log('USER CONNECTED!')
		// try {
		// 	const [authToken, guestUsername] = auth.split(':')
		// 	console.log(authToken, guestUsername)
		// 	// Fetch balances
		// 	if (guestUsername) {
		// 		// this.dispatcher.dispatch(new OnGuestPlayerJoined(), {
		// 		// 	guestUsername: options.guestUsername,
		// 		// 	sessionId: client.sessionId,
		// 		// })
		// 	} else if (authToken) {
		// 		// this.dispatcher.dispatch(new OnWalletUpdate(), {
		// 		// 	pear: this.pear,
		// 		// 	playerAddress: auth,
		// 		// })
		// 	} else {
		// 		throw new ServerError(400, 'Auth token does not exist.')
		// 	}
		// } catch (err) {
		// 	// @NOTE: Need better error handling here. If this fails the state doesn't get set
		// 	console.error(err)
		// }
	}

	onLeave(client: Client) {
		// // Remove player from state
		// if (this.state.players.has(client.sessionId)) {
		// 	// Clear sessionId on user model for Redis
		// 	this.state.players.delete(client.sessionId)
		// }
	}

	onDispose() {
		console.log('DISPOSED!!!')
		// @NOTE: Need to clear garbage here

		// if (this.pear.pearTokenContract && this.pear.pearGameContract) {
		// 	this.pear.pearTokenContract.removeAllListeners()
		// 	this.pear.pearGameContract.removeAllListeners()
		// }

		this.dispatcher.stop()
		console.log('Disposing of SpinGame room...')
	}
}

export default SpinGame
