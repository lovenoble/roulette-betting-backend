// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.32
// 

using Colyseus.Schema;

public partial class Entry : Schema {
	[Type(0, "string")]
	public string publicAddress = default(string);

	[Type(1, "string")]
	public string roundId = default(string);

	[Type(2, "string")]
	public string amount = default(string);

	[Type(3, "string")]
	public string pickedColor = default(string);

	[Type(4, "boolean")]
	public bool isSettled = default(bool);

	[Type(5, "string")]
	public string result = default(string);

	[Type(6, "string")]
	public string winAmount = default(string);
}

