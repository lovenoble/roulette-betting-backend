# Fare Backend

## Setup

- Node version: 16+
- pnpm: 17+
- Docker: 20+
- clone `fare-smart-contracts` repo
- redis-cli (optional)

```shell
pnpm i
pnpm run docker:up # Ensure docker is running
redis-cli FLUSHALL # Optionally clear server db
pnpm start
pnpm run start:keeper # Creates test accounts, seeds with ETH/FARE, and begins spin round timer
```

.env
```shell
NODE_ENV=development
GRPC_TRACE=NONE
GRPC_VERBOSITY=NONE
LOGTRACE=true
LOGLEVEL=INFO
LOGCOLORS=true
REDIS_HOST=localhost
REDIS_PORT=6379
FARE_SERVER_PORT=3100
SALT_ROUNDS=10
JWT_SECRET=0x2949d975e863c5510b4d9234f040e84756e8cc49ff0b7578e551062fb587334e
JWT_EXPIRATION=30d
MONGO_STORE_DBPATH=/tmp/mongo-fare-data/db
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE_NAME=fare-store
BLOCKCHAIN_ETH_URL=http://localhost:8545/
FARE_TOKEN_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
FARE_SPIN_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
FARE_ITEMS_ADDRESS=0x95401dc811bb5740090279Ba06cfA8fcF6113778
FARE_NFT_LOOTBOX_ADDRESS=0x998abeb3E57409262aE5b751f60747921B33613E
FARE_NFT_LOOTBOX_CONTROLLER_ADDRESS=0x70e0bA845a1A0F2DA3359C97E0285013525FFC49
REWARDS_ADDRESS=0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

- View real-time state dashboard
  - URL: http://localhost:4200/fare-state/
  - Test Username: admin
  - Test Password: pearPlay123
  

