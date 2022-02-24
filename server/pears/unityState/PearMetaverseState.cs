// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.32
// 

using Colyseus.Schema;

public partial class PearMetaverseState : Schema {
	[Type(0, "map", typeof(MapSchema<MetaversePlayer>))]
	public MapSchema<MetaversePlayer> metaversePlayers = new MapSchema<MetaversePlayer>();
}

