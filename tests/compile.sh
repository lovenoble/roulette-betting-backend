#!/usr/bin/env bash

PROJECT_DIR="D:\backup\development\reactproject\pear-connects-crypto\fareplay-frontend-metaverse"
SERVICE_DIR="D:\backup\development\nodejs\pear-connects-crypto\tests"

PROTO_DIR="${SERVICE_DIR}\lib\rpc\protos"
PROTOC_GEN_TS_PATH="${PROJECT_DIR}/node_modules/.bin/protoc-gen-ts.cmd"
GRPC_TOOLS_NODE_PROTOC_PLUGIN="${PROJECT_DIR}/node_modules/.bin/protoc-gen-ts.cmd"
GRPC_TOOLS_NODE_PROTOC="${PROJECT_DIR}/node_modules/.bin/grpc_tools_node_protoc.cmd"

# Generate JS and corresponding TS d.ts codes for each .proto file using the grpc-tools for Node.

echo "$GRPC_TOOLS_NODE_PROTOC \
    --plugin=protoc-gen-grpc="$GRPC_TOOLS_NODE_PROTOC_PLUGIN" \
    --js_out=import_style=commonjs,mode=grpcwebtext:"$OUT_DIR" \
    -I "$PROTO_DIR" \
    "$PROTO_DIR"/*.proto"

$GRPC_TOOLS_NODE_PROTOC \
    --plugin=protoc-gen-grpc="$GRPC_TOOLS_NODE_PROTOC_PLUGIN" \
    --plugin=protoc-gen-ts="$PROTOC_GEN_TS_PATH" \
    --js_out="import_style=commonjs,binary:$PROTO_DIR/generated" \
    --grpc-web_out="import_style=commonjs,mode=grpcwebtext:$PROTO_DIR/generated" \
    -I "$PROTO_DIR" \
    "$PROTO_DIR"/*.proto