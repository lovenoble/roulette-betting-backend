DESCRIPTOR_PATH=rpc/descriptor/proto_descriptor.bin
PROTO_GLOB=rpc/**/*.proto

./node_modules/.bin/grpc_tools_node_protoc \
  --descriptor_set_out=$DESCRIPTOR_PATH \
  --include_imports \
  $PROTO_GLOB
  

IGreen='\033[0;92m'
BIGreen='\033[1;92m'
NC='\033[0m' # No Color

echo "${IGreen}[grpc_tools_node_protoc]: ${BIGreen}Proto descriptor generated -> ${DESCRIPTOR_PATH}${NC}"
