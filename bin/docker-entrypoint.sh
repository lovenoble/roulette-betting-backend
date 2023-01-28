#!/bin/bash

cd /usr/src/app

set -e

node --experimental-specifier-resolution=node -r dotenv/config /usr/src/app/dist/index.js
