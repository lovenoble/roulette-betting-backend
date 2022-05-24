import ChatModel from '../models/Chat'
import { ChatRoomState } from '../../pears/state/ChatRoomState'

abstract class ChatService {
	public static model = ChatModel

	public static async saveState(state: ChatRoomState) {
		try {
			// Right now we are passing in the raw player store ids to get a reference
			// In the future we need to determine the player store id from the hashed session token
			const newMessages = []

			const playerMap = await this.getPlayerMapFromMessages(state.messages)
			console.log(playerMap)

			state.messages.forEach(message => {
				try {
					if (!message.isInStore) {
						// const newMessage = {
						//     text: message.text,
						//     player: new Types.ObjectId(
						//         playerMap[message.createdBy]
						//     ),
						// }
						// newMessages.push(newMessage)
					}
				} catch (err) {
					console.error(err)
					throw new Error(err.toString())
				}
			})

			if (newMessages.length > 0) {
				const response = await this.model.insertMany(newMessages)
				console.log(response)
				console.log('Implement saveState() in your service.')
			}
		} catch (err) {
			// @NOTE: Need better error handling here. If this fails the state doesn't get saved
			throw new Error(err.toString())
		}
	}

	private static async getPlayerMapFromMessages(msgs: any) {
		const playerMap = {}
		msgs.forEach(msg => {
			playerMap[msg.createdBy] = 'found'
		})

		const promiseList = Object.keys(playerMap).map(addr => {
			return new Promise((resolve, reject) => {
				this.model
					.findOne(
						{
							publicAddress: addr,
						},
						'_id'
					)
					.then(resolve)
					.catch(reject)
			})
		})

		return Promise.all(promiseList)
	}

	// @NOTE: Add a param where you pass a specific chatRoomType to only
	// Fetch specific messages from a chatRoom
	// Make it into an ENUM
	public static async getChatRoomMessages(chatRoomType?: string) {
		if (chatRoomType) {
			// @NOTE: Implement specific chatRoom logic here
		}

		return this.model.find({}).populate('player', { _id: 1, username: 1, publicAddress: 1 })
	}
}

export default ChatService
