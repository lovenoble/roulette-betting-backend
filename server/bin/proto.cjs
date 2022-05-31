const path = require('path')
const shell = require('shelljs')
const rimraf = require('rimraf')
const chalk = require('chalk')

const log = str => console.log(chalk.hex('#C0EDA6').bold(`[ts-proto]: ${str}`))
const logError = str => console.log(chalk.hex('#FD5D5D').bold(`[ts-proto]: ${str}`))

process.env.PATH += path.delimiter + path.join(process.cwd(), 'node_modules', '.bin')

const PROTO_DIR = path.join(__dirname, '../rpc/protos')
const MODEL_DIR = path.join(__dirname, '../rpc/models')
const PROTOC_PATH = path.join(__dirname, '../node_modules/grpc-tools/bin/protoc')
const PLUGIN_PATH = path.join(__dirname, '../node_modules/.bin/protoc-gen-ts_proto')

rimraf.sync(`${MODEL_DIR}/*`, {
  glob: { ignore: `${MODEL_DIR}/tsconfig.json` },
})

const protoConfig = [
  `--plugin=${PLUGIN_PATH}`,

  // https://github.com/stephenh/ts-proto/blob/main/README.markdown
  '--ts_proto_opt=outputServices=grpc-js,env=node,useOptionals=messages,exportCommonSymbols=false,esModuleInterop=true',

  `--ts_proto_out=${MODEL_DIR}`,
  `--proto_path ${PROTO_DIR} ${PROTO_DIR}/*.proto`,
]
// https://github.com/stephenh/ts-proto#usage
shell.exec(`${PROTOC_PATH} ${protoConfig.join(' ')}`, (code, stdout, stderr) => {
  if (code !== 0) {
    logError(`Error generating proto *.ts files`)
    if (stderr) logError('Error Log:', stderr)
    return
  }

  log(`Generated Proto .ts files -> ${MODEL_DIR}/*.ts`, stdout)
})
