import type { BigNumber, Event } from 'ethers'
import { BigNumber as BN, utils } from 'ethers'
import shortId from 'shortid'

import { tokenAPI, spinAPI } from '../crypto/contracts'

const zeroAddress = '0x0000000000000000000000000000000000000000'

const checkMintBurn = (from: string, to: string) => {
	let isMintBurn = ''
	if (from === zeroAddress) {
		isMintBurn = 'mint'
	} else if (to === zeroAddress) {
		isMintBurn = 'burn'
	}

	return isMintBurn
}

const eventTransferLog = []

// console.log(
// 	await tokenAPI.contract.provider.getLogs({
// 		fromBlock: 0,
// 		toBlock: 'latest',
// 		topics: [
// 			'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
// 			'0x0000000000000000000000000000000000000000000000000000000000000000',
// 			'0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
// 		],
// 	})
// )

type EventLog = {
	transactionHash: string
	logIndex: number
	event: string
	topics: string[]
	args: any
}

class EventTempCache {
	public cacheLength: number
	public logs: EventLog[] = []

	constructor(_cacheLength = 32) {
		this.cacheLength = _cacheLength
	}

	exists(transactionHash: string, logIndex: number) {
		return !!this.logs.filter(
			el => transactionHash === el.transactionHash && logIndex === el.logIndex
		)[0]
	}

	add(log: EventLog) {
		if (this.exists(log.transactionHash, log.logIndex)) throw new Error('Log already exists')

		if (this.cacheLength >= this.logs.length) {
			this.logs.shift()
		}

		this.logs.push(log)
		// Save to reddis/mongo
		eventTransferLog.push(log)
	}

	clear() {
		this.logs = []
	}
}

type FareTransfer = {
	eventLogId: string
	from: string
	to: string
	amount: string
	isMintBurn: string
}

const parseBNArray = (args: any) =>
	args.map((val: any) => (val instanceof BN ? utils.formatEther(val) : val))

const transferEventTempCache = new EventTempCache(4)

tokenAPI.contract.on('Transfer', (from: string, to: string, value: BigNumber, event: Event) => {
	if (transferEventTempCache.exists(event.transactionHash, event.logIndex)) return

	const isMintBurn = checkMintBurn(from, to)

	const transferEventLog: EventLog = {
		transactionHash: event.transactionHash,
		logIndex: event.logIndex,
		event: event.event,
		topics: event.topics,
		args: parseBNArray(event.args),
	}
	transferEventTempCache.add(transferEventLog)

	const fareTransfer: FareTransfer = {
		eventLogId: shortId(),
		from,
		to,
		amount: utils.formatEther(value),
		isMintBurn,
	}

	// console.log('FareTransfer', fareTransfer)
	// console.log('Event Log', transferEventLog)
	console.log('event temp cache', transferEventTempCache.logs)
	// console.log('event log store', eventTransferLog)
})

// event EntrySubmitted(
//     uint256 indexed roundId,
//     uint256 indexed batchId,
//     address indexed player,
//     uint256 entryId
// );
// event EntrySettled(
//     uint256 indexed roundId,
//     uint256 indexed batchId,
//     address indexed player,
//     uint256 entryId,
//     bool hasWon
// );
// event RoundConcluded(
//     uint256 indexed roundId,
//     bytes32 indexed vrfRequestId,
//     uint256 randomNum,
//     uint256 randomEliminator
// );
// event RandomNumberRequested(bytes32 indexed vrfRequestId);
// event NFTWon(
//     uint256 indexed roundId,
//     uint256 indexed batchId,
//     address indexed player
// );

// spinAPI.contract.on('', () => {

// })
