import { Room, ServerError } from '@colyseus/core'
import { Dispatcher } from '@colyseus/command'

// Libraries
import { MetaversePlayer, PearMetaverseState } from '../schemas/PearMetaverseState'
import { MetaverseMessage } from '../types/IPearMetaverseState'
import { IChatRoomData } from '../types/Rooms'
import createLog from '../utils'

const LOG_PATH = '[pears/defs/PearMetaverse]:'

const [logInfo, logError] = createLog(LOG_PATH)

class PearMetaverse extends Room<PearMetaverseState> {
	maxClients = 100
	private name: string
	private desc: string
	private password: string | null = null
	private dispatcher = new Dispatcher(this)

	async onCreate(options: IChatRoomData) {
		try {
			console.log('CREATED METAVERSE')
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

			this.setState(new PearMetaverseState())

			this.onMessage(MetaverseMessage.MOVE, (client, message) => {
				const { moveX, moveY, moveZ } = message
				console.log(message, client.sessionId)
				const metaversePlayer = this.state.metaversePlayers.get(client.sessionId)
				metaversePlayer.moveX = moveX
				metaversePlayer.moveY = moveY
				metaversePlayer.moveZ = moveZ
			})

			this.onMessage(MetaverseMessage.ROTATE, (client, message) => {
				const { x, y, z } = message

				const metaversePlayer = this.state.metaversePlayers.get(client.sessionId)
				metaversePlayer.rotateX = x
				metaversePlayer.rotateY = y
				metaversePlayer.rotateZ = z
			})
		} catch (err) {
			// @NOTE: Need better error handling here. If this fails the state doesn't get set
			logError(err)
		}
	}

	async onAuth(client: any, options) {
		// Validate token and get publicAddress for hashmap reference
		const { username } = options
		console.log(username)
		if (!username) {
			throw new ServerError(400, 'Username is required.')
		}

		const metaversePlayer = new MetaversePlayer({
			username,
			moveX: 0,
			moveY: 0,
			moveZ: 0,
			rotateX: 0,
			rotateY: 0,
			rotateZ: 0,
		})

		this.state.metaversePlayers.set(client.sessionId, metaversePlayer)
		return username
	}

	// async onJoin(client: any, options, auth) {
	//     try {
	//     } catch (err) {
	//         // @NOTE: Need better error handling here. If this fails the state doesn't get set
	//         logError(err)
	//     }
	// }

	onLeave(client: any) {
		// Remove player from state
		if (this.state.metaversePlayers.has(client.sessionId)) {
			this.state.metaversePlayers.delete(client.sessionId)
		}
	}

	onDispose() {
		// @NOTE: Need to clear garbage here
		this.dispatcher.stop()
	}
}

export default PearMetaverse
