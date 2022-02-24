export enum MetaverseMessage {
    MOVE = 'MOVE',
    ROTATE = 'ROTATE',
}

export interface IMetaversePlayer {
    username: string
    moveX: number
    moveY: number
    moveZ: number
    rotateX: number
    rotateY: number
    rotateZ: number
}

export interface IPearMetaverseState {
    metaversePlayers: Map<string, IMetaversePlayer>
}
