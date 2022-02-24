import * as dotenv from 'dotenv'

import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-web3'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import '@openzeppelin/hardhat-upgrades'

// @NOTES: Configure types
// import 'tsconfig-paths/register'

dotenv.config()

const {
	INFURA_ETH_KOVAN = 'https://kovan.infura.io/v3/31aadaed31984e0e865701e3c96cb93b',
	PRIVATE_KEY = '',
	PRIVATE_KEY_PEAR = '',
	REPORT_GAS = false,
	ETHERSCAN_API_KEY = 'JZTJPVEFSEBGXDFBEF24W49VBI6X124VFK',
	PEAR_TOKEN_CONTRACT = '0x5fbdb2315678afecb367f032d93f642f64180aa3',
	INFURA_POLY_TESTNET,
	// PEAR_GAME_CONTRACT = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
} = process.env

const pearDecimals = 18

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners()

	for (const account of accounts) {
		console.log(account.address)
	}
})

task('balance', "Prints an account's ETH balance")
	.addParam('account', 'The account address')
	.addOptionalParam('token', 'Options - [eth, pear]')
	.setAction(async (taskArgs, { web3, ethers }) => {
		const { account, token } = taskArgs
		const address = web3.utils.toChecksumAddress(account)

		// Fetch Pear balance for an account
		if (!token) {
			const safeTokenAddress = web3.utils.toChecksumAddress(PEAR_TOKEN_CONTRACT)
			const pearTokenContract = await ethers.getContractAt('PearToken', safeTokenAddress)
			const balance = await pearTokenContract.balanceOf(account)

			return console.log('PEAR balance:', ethers.utils.formatUnits(balance, pearDecimals))
		}

		// Fetch Eth balance for an account
		if (token === 'eth') {
			const balance = await web3.eth.getBalance(address)

			return console.log('ETH Balance:', web3.utils.fromWei(balance, 'ether'))
		}
	})

task('pear-escrow', 'Prints information about the Pear escrow')
	.addFlag('bal', 'Display Pear balance of the pear escrow')
	.addFlag('claims', 'Display current claims owed to each player')
	.setAction(async (taskArgs, { web3, ethers }) => {
		const { bal, claims } = taskArgs
		const safeTokenAddress = web3.utils.toChecksumAddress(PEAR_TOKEN_CONTRACT)
		const pearTokenContract = await ethers.getContractAt('PearToken', safeTokenAddress)

		if (bal) {
			const balance = await pearTokenContract.balanceOf(PEAR_TOKEN_CONTRACT)
			console.log('Pear Escrow Balance:', ethers.utils.formatUnits(balance, pearDecimals))
		}

		if (claims) {
			// const pearClaims = await pearTokenContract.claims()
		}
	})

const privateKeys = PRIVATE_KEY ? [PRIVATE_KEY, PRIVATE_KEY_PEAR] : []

const config: HardhatUserConfig = {
	defaultNetwork: 'localhost',
	solidity: {
		version: '0.8.9',
		settings: {
			optimizer: {
				enabled: true,
				runs: 1000,
			},
		},
	},
	networks: {
		hardhat: {
			// chainId: 31337, // Default chainId for Hardhat
			// Hardhat network configs
		},
		kovan: {
			url: INFURA_ETH_KOVAN || '',
			accounts: privateKeys,
		},
		matic: {
			url:
				'https://polygon-mumbai.infura.io/v3/31aadaed31984e0e865701e3c96cb93b' ||
				INFURA_POLY_TESTNET ||
				'',
			accounts: privateKeys,
			chainId: 80001,
		},
		fuji: {
			url: 'https://api.avax-test.network/ext/bc/C/rpc',
			accounts: privateKeys,
			chainId: 43113,
			// gasPrice: 6000000000000,
		},
	},
	gasReporter: {
		enabled: REPORT_GAS !== undefined,
		currency: 'USD',
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,
	},
	// paths: {
	// 	sources: './contracts',
	// 	tests: './test',
	// 	cache: './cache',
	// 	artifacts: './artifacts',
	// },
	mocha: {
		timeout: 20000,
	},
}

export default config
