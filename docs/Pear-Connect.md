# Pear Connect

> Pear connect is a realtime framework that handles the discovery/connection process for peers to connect to one another. Once the discovery/connection process is established between the network of peers all media streams (audio, video, screenshare, files, and text messages) are isolated to that collection of peers. PC broadcasts the current state of the blockchain to all connected peers anytime a state change happens within a group of specificed smart contracts. Pear connect is treated as an authortize node that determines who is authorized to join and what actions they have the ability to do within the Metaverse. PC also has the ability to react to events from a smart contract and change the metaverse for everyone connected (the wheel spinning for instance).

## Project Overview

#### Key Terms
- Arcadia - The main world of the metaverse.
- Authoritative Node - Responsible for snapshotting and achieving consensus of the current state of Arcadia.
- Realm Authority Node - This is an authority that is responsible for managing their public or private realm.

>Pear connect is a realtime framework that allows peers to connect to one another without revealing connection information about themselves (IPs for example). The peers write to a shared state that is distributed amongst each other and updated in realtime.

The peers connect via a group of distributed `Authoritative Nodes` that validate that the peers have the proper permissions to perform actions with the group. The underlying transport layer comes with a CRDT that ensures that all the shared states are merged properly and don't run into any conflicts.

The current implementation uses a http request to the `Authoritative Nodes` for the initial handshake. Those nodes then check that the authentication transaction is valid and returns the current state. This would include player locational information, items owned (NFTs), items equipped, friends list, and world state.

Each Authoritative Node participates in producing a snapshot of the state at the given block and validating the state amongst each other.

Nodes can optionally host/govern their own world space that can either be public (accessible to anyone in Arcadia) or private. Each Authoritative Node is required to follow the rules implemented by the main group of Arcadia nodes in order to be accepted into the network and participate in the Arcadia Metaverse.

Each Authoritative Node is responsible for the sibling Nodes inside of their world and for producing/agreeing on their state snapshot to the Arcadia Parent Nodes.

When joining a realm inside of Arcadia (world), the realm nodes should send the current state of their realm, the requesting player state inside of the realm, and any assets that need to be downloaded (character models, mesh objects, textures, materials, particles, game logic, ect).
