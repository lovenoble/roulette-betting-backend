// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.32
// 

using Colyseus.Schema;

public partial class ColorGameState : Schema {
	[Type(0, "map", typeof(MapSchema<GamePlayer>))]
	public MapSchema<GamePlayer> gamePlayers = new MapSchema<GamePlayer>();

	[Type(1, "map", typeof(MapSchema<EntryList>))]
	public MapSchema<EntryList> entries = new MapSchema<EntryList>();

	[Type(2, "string")]
	public string currentRoundId = default(string);

	[Type(3, "string")]
	public string pearSupply = default(string);

	[Type(4, "boolean")]
	public bool roundStarted = default(bool);

	[Type(5, "string")]
	public string vrfNum = default(string);
}

