#!/bin/sh
npm run build:protos
rimraf dist
tsc -b
npm run copy-protos
