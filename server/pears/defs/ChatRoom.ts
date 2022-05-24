import { Room, ServerError } from '@colyseus/core'
import { Dispatcher } from '@colyseus/command'
import shortId from 'shortid'

// Libraries
import ChatService from '../../store/services/Chat'
import PlayerService from '../../store/services/Player'
import PearHash from '../utils/PearHash'
import PearMessages from '../types/message.types'
import { ChatRoomState, ChatMessage, Player } from '../state/ChatRoomState'
import { IRoomOptions } from '../types/rooms.types'
import createLog from '../utils'

const LOG_PATH = '[pears/defs/ChatRoom]:'

const [logInfo, logError] = createLog(LOG_PATH)

class ChatRoom extends Room<ChatRoomState> {
	maxClients = 100
	private name: string
	private desc: string
	private password: string | null = null
	private dispatcher = new Dispatcher(this)

	async onCreate(options: IRoomOptions) {
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

			const messages = await ChatService.getChatRoomMessages()
			this.setState(new ChatRoomState())

			// Iterate over existing messages and add them to the ChatRoomState
			// Potentially created a new map here and pass it into state at once
			messages.forEach(message => {
				console.log(message.player)
				const existingMessage = new ChatMessage({
					id: message._id.toString(),
					text: message.text,
					createdBy: message.player.publicAddress,
					createdAt: new Date(message.createdAt).getTime(),
					isInStore: true,
				})
				this.state.messages.set(message._id.toString(), existingMessage)
			})

			this.onMessage(PearMessages.NEW_CHAT_MESSAGE, (client, message) => {
				const { token } = message
				console.log(client.auth)
				if (token) {
					logInfo('Players token should be here:', token)
				}

				const chatMessageId: string = shortId()

				const newMessage = new ChatMessage({
					id: chatMessageId,
					text: message.text,
					createdBy: client.auth,
					isInStore: false,
				})

				// @NOTE: Add a better way to handle creating the messageId
				this.state.messages.set(shortId(), newMessage)
			})
		} catch (err) {
			console.log('this got hit')
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

	// async onJoin(client: any, options, auth) {
	//     try {
	//     } catch (err) {
	//         // @NOTE: Need better error handling here. If this fails the state doesn't get set
	//         logError(err)
	//     }
	// }

	onLeave(client: any) {
		// Remove player from state
		if (this.state.players.has(client.sessionId)) {
			this.state.players.delete(client.sessionId)
		}
	}

	// onDispose() {
	//     // @NOTE: Need to clear garbage here
	//     logInfo('Saving ChatRoom state and disposing ChatRoom')
	//     // ChatService.saveState(this.state)
	// }
}

export default ChatRoom
