# Proto Descriptor

Using the reflection on your server allows your clients to get information regarding available RPCs and their format without actually having the schema definition.

With reflection you can use tools like grpcurl or wombat to call and test the API without linking the schema files, but just by accessing the live server.
