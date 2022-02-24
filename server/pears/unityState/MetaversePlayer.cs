// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.32
// 

using Colyseus.Schema;

public partial class MetaversePlayer : Schema {
	[Type(0, "string")]
	public string username = default(string);

	[Type(1, "number")]
	public float moveX = default(float);

	[Type(2, "number")]
	public float moveY = default(float);

	[Type(3, "number")]
	public float moveZ = default(float);

	[Type(4, "number")]
	public float rotateX = default(float);

	[Type(5, "number")]
	public float rotateY = default(float);

	[Type(6, "number")]
	public float rotateZ = default(float);
}

