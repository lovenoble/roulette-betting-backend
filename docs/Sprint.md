# Sprint

## Frontend

- Add win/lose animation (UG)
- Fix wave ratio with different screen sizes
- Rework the loading scene (Pending UG)
  - Ball should slowly rotate around the F logo
- Rework the animation on entry to the wheel scene
- [X] Write the simulation model inside of JS -> Solidity
- Setup GitMask (all 4 repos) -> Or we can create a mono repo
- [X] Research Polygon(MATIC) and the technical with implementing it
- [X] Start token and smart contract development
- Start NFT development
- Implement wallet connect on frontend
  - FUTURE - we need to implement a wallet connect inside of the Metaverse
- [ ] Sync the wheel spinning animation with pear-connect (auto join wheel animation based on multiplier)
- Performance optimization for both the frontend and metaverse
- Documentation / code commenting for frontend and metaverse codebase
- FUTURE - Proximity chat in metaverse
- FUTURE - text chat in metaverse
- FUTURE - friends list inside of the metaverse
- FUTURE - availability to switch worlds (join a friends world)

## Pear Connects

### Basic Authentication

- Two options
  - Unsaved session - A user can enter in a playerName can access the platform with limited functionality and no ability to save their session state
  - Saved session (Authenticated) - A user signs a transaction and sends an http to the Authoritative Nodes to gain access to their session state.
    - For the time being, we are just implementing a basic hashed password to authenticate users

### Tasks

- [ ] Rework docker-compose.yaml file to wait for mongodb to be initialize before continuing
- [ ] Replace all existing environments and add them to .env
- [ ] Implement schema migrations in state store
- [ ] Implement world joining inside of metaverse (max limit of 30-50 players)
- [ ] Implement pear-connect to sync player movement, rotation and animations
- [ ] Create C#/Unity bindings to pear-connect for realtime communication
- [ ] Implement libp2p js to pass states between nodes
- [ ] Implement wallet connect
- [ ] In the token validate function, ensure that the token has no expired. If it has return a invalid token response and clear out the authToken on the frontend.
- [ ] Work through different conditions and make sure the frontend accounts for them
  - [ ] User doesn't have metamask installed
  - [ ] User is on mobile
  - [ ] User is connected to a different network
  - [X] User didn't sign nonce
  - [X] User has an invalid token
  - [X] User token has expired
- [ ] Define constants for wallet states
  - Metamask not installed
  - ***Below implies installed***
  - On correct network and is connected
  - On correct network but not connected
  - Not on correct network and not connected
  - On correct network and connected but connect account isn't selected
- [ ] User switches wallet address
- [ ] User switches network (ethereum, testnet, polygon, avalanche, etc)
- [ ] User disconnects metamask via extension
- [ ] Create a universal function that handles the `disconnect` event when a user disables metamask or disconnects their wallet with site
- [ ] Create a `CombineProvider` function that allows us to just pass one reference to the provider
- [ ] Implement hardhat and open zeplin into a separate directory `contracts`
- [ ] Create a script that compiles and moves the abi files into the frontend project
- [ ] the `.sh` script should request a filename for the target proto that need to be compiled
- [ ] Modify `generate-proto.sh` script so that it compiles and passes the target proto file into the server. Right now we have two proto files that I'm copying anytime I change one.
- [ ] Create a way to share the typescript types between the server and client. Right now I'm copying them between each other.
- [ ] Need to add isValidatingToken variable that won't allow you to join pear rooms until it's validated

### Finished Tasks

- [X] Create a docker-compose file that will handle all the backend process (envoy, mongodb store, pear-connect server)
- [X] Implement dotenv for environment variables
- [X] Implement pear-connect chat (auto join chat room)
- [X] Create a persistent storage for pear-connect GameServer (mongodb, supabase, redis)
- [X] Implement authentication and connecting with Metamask
- [X] Save publicAddress, nonce and token for user
- [X] Update nonce for user if user already exists
- [X] Add checksum addresses for users
- [X] Implement native window.ethereum request for signing and getting eth address
- [X] Created `useReactiveStorage` hook that creates a reactive localStorage variable
- [X] Add eventlistener if someone removes their authToken completely disconnect them
  - [X] Store authToken inside of this token
- [X] Create `NetworkEventListener` component that is the main entry point for handling Pear-connect events/state changes
  - [X] Auto verify a user pear-connect token anytime they attempt to connect a Pear GameServer
- [X] If token is present, validate and return the publicAddress to the frontend.
- [X] On the frontend, we check if the user's metamask address matches the token address
- [X] If it does we redirect the user to the main app (user is correctly authenticated)
- [X] If it doesn't then we clear out the session token and redirect the user to the connect-wallet page
- [X] On frontend mount check if the user has a token. If so validate it and redirect them.
- [X] Store the token inside of `localStorage` and create a hook that returns it
- [X] Add an expiration timestamp for the user
- [X] Pass the authToken anytime you do a request to pear connects
- [X] Handle authentication every time you connect to a room on pear connects
- [X] Move state in `Chat.tsx` to a context
- [X] Move web3 utility functions into a library file
- [X] Implement a wallet balance of ETH and RCAD token
- [X] Create a lib directory called `pears` that handles any function related to pear-connects
  - [X] Client implementation
  - [X] Server implementation
- [X] Modify the `generate-proto.sh` script to look at the server/protos file to generate the typescript/javascript for the frontend

### Research

- [ ] Look into Waku V2
- [ ] Look into The Graph and how we can implement with current project


### Pear-Connect Demos

#### Text Chat

> There are two options for text chat with different access levels.

##### Terms

- Pear-Connect (PC)
- Web Real-Time Peer to Peer Communication (WebRTC)
- Authoritative Pear (AP)

##### Features

- A player can create either create a Pear-Connect GameServer chat or a Pear-Connect WebRTC chat.
  - Pear-Connect GameServer chat (semi-decentralized) - This method will allow for an AP to manage the state persistence, permissions, max limit, and peer discovery process. This method is best if you want control over the chat and the ability to save chat data for future viewing. Once all the connected pears disconnect from the GameServer the AP handles an autoDispose process that caches the chat state. Once a new pear connects while there are no pears in the chat the AP will pass the cached state to the pear.
  - Pear-Connect WebRTC chat (fully-decentralized) - With this approach, Pear-Connect acts as a discovery/relay server and the pears connected to any given PC WebRTC chat are responsible for handling any permissions and storing of the persistent state cache.
- Either of these approaches can be configured with different options
  - Metadata - This would include things like the chat name, description, display color, max players, logo, etc.
  - Password protected - An optional password required for the pears to connect
  - Visibility
    - Public - The chat is publicly listed in the game chat lobby
    - Private - The chat is not listed but can be found by entering a custom chat token
  - Permissions/Access control - For the time being, this will be very basic.
    - Admin/AP - Has the ability to change another pears permissions and can change metadata about the game chat
    - Read - Can only read data but cannot write
    - Write - Can read/send data
    - Banned - These pears will be added to a hash map that the connect/authenticated pears have locally. If a banned pear tries to join the pears in the network agree on refusing the banned pears connection.
- FUTURE FEATURE - File storage
  - IPFS (decentralized) - PC handles uploading, displaying, and serving the files to IPFS.
  - Pear-Persist (decentralized) - This option opens a data stream with all the pears to store the file in a caching/webworker. If requested the pears stream the file to the requester.
  - Pear-Filestore - While uploading, pears will stream the file to the AP and the AP is responsible for storing and serving the file.

- [X] Implement RedisPresence to handle running multiple nodes and sharing state/room information
- [ ] Implement ability to create a custom room
- [ ] Display public rooms inside of MatchMaking component
- [ ] Ensure that each connection is established to the correct room
- [ ] Rename `chats` to `chatmessages`
- [ ] Create `chats` collection in the store that contains metadata about a chatroom
- [ ] Implement separate ChatMessages attribute that saves messages separately

- Added a `name` property to RoomAvailable interface in colyseus.js. I'll need to extend this interface instead of doing this.
- Issue with logging in when you have two browsers opened. The localStorage will update for one browser and the other one will not be doing those changes. This needs to be fixed.

---

#### Other Demos (To be detailed later)

- Limit connections to the game server to one optionally and display a prompt in the frontend informing the user that another device is already connected and if they want to disconnect it
- List all the available rooms inside of the lobby component
- Create a small Phaser demo showing the Pear Connect server handling user state syncing
- Do the same chat demo with a peer to peer WebRTC stream using the pear connect real-time discovery process (save a list of discoverable peers inside of a store object)
- Do a small demo of the Phaser demo with Pear Connect WebRTC
- Configure and install the Decentraland SDK and connect to a scene using the Pear connect GameServer
- Do a Decentraland SDK demo with Pear Connect WebRTC
- Create an Arcadia metaverse scene using Pear connect game server
- Create an Arcadia metaverse scene using Pear connect WebRTC
- Implement an ERC20 smart contract called RCAD. Add a feature in the front-end to click on a user and send RCAD. Do this in the chat demo as well as in the Arcadia Metaverse.
- Create a smart contract to handle player wagers and after an allotted time run a VRF function that determines a winner. Display the timer that is set in the smart contract and sync the timer state for all connected peers.
- Do a Pear Connect WebRTC demo demonstrating Video/Audio streaming amongst a group of peers. Allow for an optional password to be passed.
- Create a feature for password protected chat rooms.
- Allow users to create their own world instances that are either public or private (not listed in the game lobby and password protect optionally)
- Implement IPFS file storage and demo a shared file store with Pear Connect WebRTC.

#### OVH Dedicated Gaming-2-LE Server

> Domain - pear-connect.io

##### Hardware

- (CPU) -> AMD Ryzen 7 3800X - 8c/16t - 3.9 GHz/4.5 GHz
- (RAM) -> 64 GB ECC 2666 MHz
- (Data disks) -> 2×960 GB SSD NVMe
- (Expansion Cards) -> Soft RAID

##### Implemented Functionality

- Containers
  - pear-connect-store -> MongoDB caching level for persistent state
  - pear-connect-store-dashboard -> GUI for viewing/interacting with the pear-connect-store
  - pear-connect-rpc-proxy -> Envoy load balancing proxy that redirects traffic randomly to connected/discovered pears. Encodes the RPC payload as a HTTP2 request.
  - pear-connect-redis -> Key/value store that helps pear/room routing. This enables us to have smart load balancing and rate limiting as the pear network scales up.
  - pear-connect-network -> This layer brings all the pieces together and manages the pears.
  - pear-realtime-state (Websocket/RPC open-connection/WebRTC)-> Broadcasts any changes to the state to all the pears on the network.

- Genesis Pear -> First pear on the network.
- Pear-Connect Frontend -> React app that implements the pear.js library to interact with APs
- DNS Server -> Allows for SSL and domain routing within the OVH server
- Nginx Server -> Handles requests to the RPC proxy and frontend app

##### Request Pipeline

> This explains the different paths a request follows whenever interacting with the server

- [GRPC status codes](https://grpc.github.io/grpc/core/md_doc_statuscodes.html)
- [GRPC using Envoy to transcode JSON requests to gRPC](https://www.aapelivuorinen.com/blog/2020/08/01/envoy-json-grpc-transcoding/)


##### Frontend UI/UX Sprint

- [ ] Create UI/UX for entries into game
- [ ] Implement existing chat component into entry screen
- [ ] Implement Moralis
- [ ] Ability to click on user avatar/address to display modal of blockchain/balance history
- [ ] Ability to send a user FP through the UI
- [ ] Create a profile page / modal with transaction history, wallet balances, prizes/deposit, entry history + result, ability to add optional password to account. Ability to change username and add other information.
- [ ] Create a navbar with balance modal and logout
- [ ] Modify the smart contract to allow for deposits
- [ ] Create UI/UX that handles deposits
- [ ] In the userflow, ensure the user deposits funds before placing an entry
- [ ] Display better error messages on the frontend (for example, enforcing the PEAR limit)
- [ ] Create a pear-connect state that stores the users balances and updates them in realtime for all the clients
- [ ] Create a homepage for pear-connect that has info about the project
- [ ] In pear-connect realtime, if a user has multiple tabs open push their sessionIds into an array and cap them at 4 active sessions. Anytime one of the same user sessions leave remove the sessionId from the list. If there are no more remaining sessionIds remove the user from the list
- [ ] Add feature to chat to disable auto scroll if a user scrolls up an X amount
- [ ] Add loading indicator to the chat.
- [ ] Implement lazy loading for messages
- [ ] Ability to create chats (requires public key authentication) and share a unique link to friends who can either connect wallet or continue with just a username (won't save session)
- [ ] Create an "Enter App" button on the homepage navbar.
- [ ] Create a line chart of supply change between each round
- [ ] Add disabled state to buttons and loading state
- [ ] Look into issue where if you have two tabs open and switch networks and try to relogin it always kicks you out after authentication
- [ ] Consider implementing the ability to have multiple tabs open
- [ ] https://www.sliderrevolution.com/resources/css-menu/
- [ ] Play as guest with play tokens new users and users without metamask enabled.
- [ ]

Example Dapps
- https://splinterlands.com/
  - When logging in App auto suggested importing in BSC and all I had to do was click a button.
  - Auto logs out whenever logging in and switching account and refreshing
- https://pancakeswap.finance/nfts/collections
  - Look into how Pancake swap handles users on the wrong network or submitting transactions as a different public key when already authenticated with one public key.
- https://play.alienworlds.io/
- https://play.farmersworld.io/
  - Look into how their mulitplier is setup. It looks like they have the ability to select which centralized server you want to connect to.
- https://on.wax.io/wax-io/
- https://app.olympusdao.finance/#/dashboard
- https://synapseprotocol.com/ - Bridge look into this
- https://beta.curve.fi/
- https://oasis.app/
  - When a user cancels a transaction or it fails they have a modal that displays the error message and gives the user the option to try again or cancel.
  - When connecting a new account while already logged in they pop up a modal to authenticate and switch to that new account optionally.
  - When switch back and forth between accounts you've already authenticate in metamask, Oasis will create a new auth token and update the UI for the selected public key you have in metamask.
  - When disconnecting one account but you have other accounts authenticated and connect Oasis switches to the next account. When all accounts are disconnect Oasis logs you out.
- https://wallet.polygon.technology/wallet

- [X] Implement dicebear/robots
- [X] Add Framer motion
- [X] Implement NotoSans font
- [ ] Connect Wallet -> Deposit funds -> View entries / balances -> Place entry -> Entry update in realtime -> Settle entries -> Entries settle in realtime -> Ensure there are entries before the settle function can be ran
- [ ] Design a modular wallet component that you can deposit or withdrawal from. Click on wallet to see the transaction history and breakdown of all your entries.
- [ ] Show a chat and display an online player list when on the `crypto/games` page.
- [ ] Implement small, medium, large bets that adjust your options accordingly
- [ ] Pear-connect should be responsible for updating each one of the entries in real-time
- [ ] Implement VRF
- [ ] Create dynamic round number component that auto selects a new round after it's settled
  [ ] - Optionally create a entry history modal that has all of the past settled rounds
- [ ] Frontend Validation
- [ ] Create custom UI elements (number input, select color, buttons, modal)
- [ ] Add navigation
- [X] On the player list only display the active player once (if they have multiple tabs open on the same page)
  [X] - This can be achieved by changing the map key to be the users address
- [ ] If a user changes their account on Metamask while logged in don't auto logout. Rather, if they try to do a transaction with another account open an alert that says to switch their account on Metamask.
- [ ] Implement peer.js to get screensharing and audio chats