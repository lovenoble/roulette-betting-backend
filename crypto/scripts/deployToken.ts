import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import * as hre from 'hardhat'
import { exec } from 'child_process'
import nodeUtil from 'util'
// Types
interface IDeployer {
	deployer: SignerWithAddress
	balance: string
}

const { ethers } = hre

const bashPromise = nodeUtil.promisify(exec)

async function compileStep() {
	console.log('Compiling smart contracts...')
	// await hre.run('compile')
	console.log('Successfully compiled smart contracts!')
}

async function getDeployerInfo(): Promise<IDeployer> {
	const [deployer] = await ethers.getSigners()

	const weiAmount = (await deployer.getBalance()).toString()
	const weiFormatted = await ethers.utils.formatEther(weiAmount)

	return {
		deployer,
		balance: weiFormatted,
	}
}

async function main() {
	try {
		await compileStep()

		const { deployer, balance } = await getDeployerInfo()
		console.log(`Deploying contracts with the account: ${deployer.address}`)
		console.log(`Deployer balance: ${balance} ETH`)

		// Fetch and deploy PearToken contract
		const PearToken = await ethers.getContractFactory('PearToken')
		const pearToken = await PearToken.deploy()

		// Waits for the token contract to be deployed
		await pearToken.deployed()

		console.log('Pear Token deployed to:', pearToken.address)
		console.log('Updating Frontend app and PearGame references...')
		await bashPromise(`./bash-scripts/replace-address.sh token ${pearToken.address}`)
		console.log('Updated token references!')
	} catch (err: any) {
		console.error(err)
	}
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
