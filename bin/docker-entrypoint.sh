#!/bin/bash

cd /usr/src/app

set -e

# sleep 15

node --experimental-specifier-resolution=node -r dotenv/config /usr/src/app/dist/index.js
