type SocketPlayer = {
    id: any
    username: string
    publicAddress: string
}

type SocketChatMessage = {
    text: string
    player: SocketPlayer
}

type SocketChatState = {
    messages: SocketChatMessage[]
    players: SocketPlayer[]
}

type ChatMessage = {
    id?: any
    text: string
    username: string
    timestamp?: string
}

type SocketPlayerMap = {
    [sessionId: string]: SocketPlayer
}

type SocketChatMessageMap = {
    [messageId: string]: ChatMessage
}
