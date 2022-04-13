import { exec } from 'child_process'
import nodeUtil from 'util'

const bashPromise = nodeUtil.promisify(exec)

async function main() {
	try {
    await bashPromise(`./bash-scripts/prep-fe.sh`)

	} catch (err: any) {
		console.error(err)
	}
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
});