import type { ChatMessage } from '../schema/types'

import ServiceBase from './ServiceBase'
import { IGameMessage } from '../../pear/entities'

export default class ChatMessageService extends ServiceBase<ChatMessage> {
  async getChatMessage() {
    console.log('somethihng')
  }

  async addChatMessage(message: IGameMessage) {
    return this.repo.createAndSave(message as any)
  }
}
