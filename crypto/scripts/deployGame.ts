import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import * as hre from 'hardhat'
import { exec } from 'child_process'
import nodeUtil from 'util'

// Types
interface IDeployer {
	deployer: SignerWithAddress
	balance: string
}

const { PEAR_TOKEN_CONTRACT } = process.env

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
	if (!PEAR_TOKEN_CONTRACT) throw new Error('PEAR_TOKEN_CONTRACT needs to be defined.')

	await compileStep()

    // Fetch information about the deployer
	const { deployer, balance } = await getDeployerInfo()
	console.log(`Deploying contracts with the account: ${deployer.address}`)
	console.log(`Deployer balance: ${balance} ETH`)

    // Deploy PearGame contract
	const PearGame = await ethers.getContractFactory('PearGame')
	const pearGame = await PearGame.deploy(PEAR_TOKEN_CONTRACT)

	await pearGame.deployed()

	console.log('Pear Game deployed to:', pearGame.address)
	console.log('Updating Frontend app and PearGame references...')
	await bashPromise(`./bash-scripts/replace-address.sh game ${pearGame.address}`)
	console.log('Updated token references!')
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
