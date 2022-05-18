import { tokenAPI, spinAPI } from '../crypto/contracts'
import { EventNames } from './utils'

import { fareTransferEvent } from './fareToken'
import { entrySubmittedEvent, entrySettledEvent } from './spinGame'

function defineEvents() {
	tokenAPI.contract.on(EventNames.Transfer, fareTransferEvent)
	spinAPI.contract.on(EventNames.EntrySubmitted, entrySubmittedEvent)
	spinAPI.contract.on(EventNames.EntrySettled, entrySettledEvent)
	spinAPI.contract.on(EventNames.RandomNumberRequested, (...args) => console.log(args))
	spinAPI.contract.on(EventNames.RoundConcluded, (...args) => console.log(args))
}

export default defineEvents
