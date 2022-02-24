import { Server, LobbyRoom } from '@colyseus/core'
import ChatRoom from './defs/ChatRoom'
import ColorGame from './defs/ColorGame'
import PearMetaverse from './defs/PearMetaverse'
import PearMediaStream from './defs/PearMediaStream'

// @NOTE: Implement the command pattern

class Sockets {
    gameServer: Server = null

    constructor(gameServer: Server) {
        this.gameServer = gameServer
    }

    initRooms() {
        this.gameServer.define('lobby', LobbyRoom)
        this.gameServer.define('color-game', ColorGame, {
            name: 'Game Color',
            desc: 'Game where you select a color and a smart contract tells you if you win or lose',
            password: null
        })
        this.gameServer.define('media-stream', PearMediaStream, {
            name: 'Pear Media Stream',
            desc: 'Pear Media Stream for audio, video, file-sharing, and screen-sharing',
            password: null,
        })
        this.gameServer.define('pear-metaverse', PearMetaverse, {
            name: 'Pear Connect Metaverse',
            desc: 'Welcome to Arcadia via Pear Connect!',
            password: null
        }).enableRealtimeListing()
        this.gameServer
            .define('chatRoom', ChatRoom, {
                name: 'Chat Room',
                desc: 'General chat room for players.',
                password: null,
            }).enableRealtimeListing()
    }
}

export default Sockets