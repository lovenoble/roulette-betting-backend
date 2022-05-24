import { tokenAPI, spinAPI } from '../crypto/contracts'
import { EventNames } from './utils'

import { fareTransferEvent } from './fareToken'
import {
	ensureGameMode,
	gameModeUpdatedEvent,
	entrySubmittedEvent,
	entrySettledEvent,
	roundConcludedEvent,
} from './spinGame'

// @NOTE: Users model - (Redis cache set-x[TIME] and save user data to postgres)

async function initEnsure() {
	await ensureGameMode()
}

async function defineEvents() {
	await initEnsure()

	tokenAPI.contract.on(EventNames.Transfer, fareTransferEvent)
	spinAPI.contract.on(EventNames.EntrySubmitted, entrySubmittedEvent)
	spinAPI.contract.on(EventNames.EntrySettled, entrySettledEvent)
	spinAPI.contract.on(EventNames.GameModeUpdated, gameModeUpdatedEvent)
	spinAPI.contract.on(EventNames.RoundConcluded, roundConcludedEvent)

	// spinAPI.contract.on(EventNames.RandomNumberRequested, (...args) => console.log(args))
}

export default defineEvents
