// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.32
// 

using Colyseus.Schema;

public partial class ShapesState : Schema {
	[Type(0, "map", typeof(MapSchema<Shape>))]
	public MapSchema<Shape> shapes = new MapSchema<Shape>();

	[Type(1, "map", typeof(MapSchema<Player>))]
	public MapSchema<Player> players = new MapSchema<Player>();
}

