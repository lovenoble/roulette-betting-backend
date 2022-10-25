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
pnpm run start
pnpm run start:keeper # Creates test accounts, seeds with ETH/FARE, and begins spin round timer
```

- View real-time state dashboard
  - URL: http://localhost:4200/fare-state/
  - Test Username: admin
  - Test Password: pearPlay123
  

