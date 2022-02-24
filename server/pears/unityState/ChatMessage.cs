// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.32
// 

using Colyseus.Schema;

public partial class ChatMessage : Schema {
	[Type(0, "string")]
	public string id = default(string);

	[Type(1, "string")]
	public string text = default(string);

	[Type(2, "string")]
	public string createdBy = default(string);

	[Type(3, "number")]
	public float createdAt = default(float);

	[Type(4, "boolean")]
	public bool isInStore = default(bool);
}

