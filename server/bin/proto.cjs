const path = require('path')
const shell = require('shelljs')
const rimraf = require('rimraf')
const chalk = require('chalk')
const fs = require('fs')

const log = str => console.log(chalk.hex('#C0EDA6').bold(`[ts-proto]: ${str}`))
const logError = str => console.error(chalk.hex('#FD5D5D').bold(`[ts-proto]: ${str}`))

process.env.PATH += path.delimiter + path.join(process.cwd(), 'node_modules', '.bin')

const PROTO_DIR = path.join(__dirname, '../rpc/protos')
const MODEL_DIR = path.join(__dirname, '../rpc/models')
const PROTOC_PATH = path.join(__dirname, '../node_modules/grpc-tools/bin/protoc')
const PLUGIN_PATH = path.join(__dirname, '../node_modules/.bin/protoc-gen-ts_proto')

function getTSFilePaths() {
  return new Promise((resolve, reject) => {
    fs.readdir(MODEL_DIR, (err, files) => {
      if (err) {
        logError(`Error generating proto *.ts files`)
        logError(err)
        return reject(err)
      }
      const tsFilePaths = files
        .filter(file => file.includes('.ts'))
        .map(file => `${MODEL_DIR}/${file}`)
      resolve(tsFilePaths)
    })
  })
}

async function patchFixProtoMinimalImport() {
  const tsFilePaths = await getTSFilePaths()

  const promiseList = tsFilePaths.map(path => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { encoding: 'utf8' }, function(err, data) {
        if (err) {
          logError(`Error generating proto *.ts files`)
          logError(err)
          return reject(err)
        }
        const formatted = data.replace(
          "import * as _m0 from 'protobufjs/minimal'",
          "import _m0 from 'protobufjs/minimal'"
        )
        fs.writeFile(path, formatted, 'utf8', function(err) {
          if (err) {
            logError(`Error generating proto *.ts files`)
            logError(err)
            return reject(err)
          }

          resolve()
        })
      })
    })
  })

  return Promise.all(promiseList)
}

// https://github.com/stephenh/ts-proto/blob/main/README.markdown
const protoConfig = [
  `--plugin=${PLUGIN_PATH}`,
  '--ts_proto_opt=outputServices=grpc-js,env=node,useOptionals=messages,exportCommonSymbols=false,esModuleInterop=true',
  `--ts_proto_out=${MODEL_DIR}`,
  `--proto_path ${PROTO_DIR} ${PROTO_DIR}/*.proto`,
]

rimraf.sync(`${MODEL_DIR}/*`, {
  glob: { ignore: `${MODEL_DIR}/tsconfig.json` },
})

function main() {
  return new Promise((resolve, reject) => {
    // https://github.com/stephenh/ts-proto#usage
    shell.exec(`${PROTOC_PATH} ${protoConfig.join(' ')}`, async (code, stdout, stderr) => {
      if (code !== 0) {
        logError(`Error generating proto *.ts files`)
        if (stderr) logError('Error Log:', stderr)
        return reject(stderr)
      }
      // This is needed because ts-proto doesn't handle ESM projects fully
      await patchFixProtoMinimalImport()

      log(`Generated Proto .ts files -> ${MODEL_DIR}/*.ts`, stdout)
      resolve(stdout)
    })
  })
}

main().catch(err => {
  logError(err)
  process.exit(0)
})
