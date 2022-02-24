import { Schema, MapSchema, type } from '@colyseus/schema'
import { Player } from './ChatRoomState'
import shortId from 'shortid'

export class Shape extends Schema {
    @type('number')
    x = 0
    @type('number')
    y = 0
}

export class ShapesState extends Schema {
    @type({ map: Shape })
    shapes = new MapSchema<Shape>()
    @type({ map: Player })
    players = new MapSchema<Player>()
}
