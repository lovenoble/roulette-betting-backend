import type { ChatMessage } from '../schema/types'

import ServiceBase from './ServiceBase'
import { IGameMessage } from '../../pear/entities'
import { MAX_CHAT_MSGS } from '../../pear/constants'

export default class ChatMessageService extends ServiceBase<ChatMessage> {
  async getRecentChatMessages(count = MAX_CHAT_MSGS) {
    const chatMessages = await this.repo.search().sortAsc('timestamp').returnPage(0, count)
    const list: IGameMessage[] = []
    for (const msg of chatMessages) {
      const jsonMsg = msg.toJSON() as IGameMessage
      jsonMsg.timestamp = Math.floor(new Date(jsonMsg.timestamp).getTime() / 1000)
      list.push(jsonMsg)
    }
    return list
  }

  async updateUsername(publicAddress: string, username: string) {
    const msgEntities = await this.repo
      .search()
      .where('createdBy')
      .equals(publicAddress)
      .returnAll()
    for (const msg of msgEntities) {
      msg.username = username
      await this.repo.save(msg)
    }
  }

  async addChatMessage(message: IGameMessage) {
    return this.repo.createAndSave(message as any)
  }
}
