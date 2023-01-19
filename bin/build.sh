#!/bin/sh
pnpm run lint:fix
rimraf dist
tsc -b
