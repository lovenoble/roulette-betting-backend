PROTOC_GEN_TS_PATH="./frontend/node_modules/.bin/protoc-gen-ts"

INPUT_DIR="./frontend/src/lib/rpc/protos"
OUT_DIR="./frontend/src/lib/rpc/protos/generated"

# protoc \
#     --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
#     --js_out="import_style=commonjs,binary:${OUT_DIR}" \
#     --ts_out="service=grpc-web:${OUT_DIR}" \
#     -I ${INPUT_DIR} \
#     ${INPUT_DIR}/player.proto

protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --proto_path=${INPUT_DIR} \
    --js_out=import_style=commonjs,binary:${OUT_DIR} \
    --grpc-web_out=import_style=typescript,mode=grpcwebtext:${OUT_DIR} \
    ${INPUT_DIR}/player.proto

