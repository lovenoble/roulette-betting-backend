import ChatModel from '../models/Chat'
// import { ChatRoomState } from '../../pears/state/ChatRoomState'

abstract class ChatService {
	public static model = ChatModel

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
