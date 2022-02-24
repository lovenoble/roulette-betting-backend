// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.32
// 

using Colyseus.Schema;

public partial class GamePlayer : Schema {
	[Type(0, "string")]
	public string publicAddress = default(string);

	[Type(1, "string")]
	public string ethBalance = default(string);

	[Type(2, "string")]
	public string pearBalance = default(string);

	[Type(3, "string")]
	public string depositBalance = default(string);

	[Type(4, "string")]
	public string queueBalance = default(string);

	[Type(5, "string")]
	public string prizeBalance = default(string);
}

