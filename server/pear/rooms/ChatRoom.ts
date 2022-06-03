import { Room, ServerError, Client } from '@colyseus/core'
import { Dispatcher } from '@colyseus/command'

// Libraries
import type { IDefaultRoomOptions, IRoomOptions } from '../types'
import store from '../../store'
import { HttpStatusCode, ChatMessage } from '../constants'
import ChatState from '../state/ChatState'
import { logger } from '../utils'
import {
	OnChatUserJoined,
	OnUserLeave,
	OnNewMessage,
	OnGuestChatUserJoined,
} from '../commands/ChatCommands'

// @NOTE: Need to create store service that handles updating analytics

class ChatRoom extends Room<ChatState> {
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
				logger.info('Password was set', password)
				hasPassword = true
			}
			this.setMetadata({
				name,
				desc,
				hasPassword,
			})

			this.setState(new ChatState())

			this.onMessage(ChatMessage.NewChatMessage, (client: Client, text: string) => {
				this.dispatcher.dispatch(new OnNewMessage(), {
					publicAddress: client.auth,
					text,
				})
			})
		} catch (err) {
			logger.error(err)
			throw new ServerError(HttpStatusCode.INTERNAL_SERVER_ERROR, err.toString())
		}
	}

	async onAuth(_client: Client, options: IDefaultRoomOptions = {}) {
		try {
			const { authToken, guestId } = options

			if (authToken) {
				const user = await store.service.user.getUserFromToken(authToken)

				if (!user) {
					logger.error('Invalid user authToken.')
					throw new ServerError(HttpStatusCode.UNAUTHORIZED, 'Invalid user authToken.')
				}

				return user.publicAddress
			}
			if (guestId) {
				logger.info('User logging in as guest with username:', guestId)
				return `guest:${guestId}`
			}

			throw new ServerError(
				HttpStatusCode.UNAUTHORIZED,
				'A valid token is required to connect to room.'
			)
		} catch (err: any) {
			logger.error(err)
			throw new ServerError(HttpStatusCode.INTERNAL_SERVER_ERROR, err.toString())
		}
	}

	async onJoin(client: Client, _options: IDefaultRoomOptions = {}, auth?: string) {
		try {
			/* @ts-ignore */
			const { sessionId } = client
			const [publicAddress, guestId] = auth.split(':')
			logger.info(publicAddress, guestId)

			if (guestId) {
				this.dispatcher.dispatch(new OnGuestChatUserJoined(), { sessionId, guestId })
			} else if (publicAddress) {
				logger.info('Updated users sessionId:', publicAddress, sessionId)
				this.dispatcher.dispatch(new OnChatUserJoined(), {
					publicAddress,
					sessionId,
				})
			} else {
				throw new ServerError(
					HttpStatusCode.INTERNAL_SERVER_ERROR,
					'Auth token does not exist.'
				)
			}
		} catch (err) {
			logger.error(err)
			throw new ServerError(HttpStatusCode.INTERNAL_SERVER_ERROR, err.toString())
		}
	}

	onLeave(client: Client) {
		const { sessionId } = client

		this.dispatcher.dispatch(new OnUserLeave(), {
			sessionId,
		})
	}

	onDispose() {
		// @NOTE: Need to clear garbage here

		this.dispatcher.stop()
		logger.info('Disposing of SpinGame room...')
	}
}

export default ChatRoom
