import { tokenAPI, spinAPI } from '../../pears/crypto/contracts'
import { EventNames } from './utils'
import { GameMode } from '../service'

import { fareTransferEvent } from './fareToken'
import {
	gameModeUpdatedEvent,
	entrySubmittedEvent,
	entrySettledEvent,
	roundConcludedEvent,
} from './spinGame'

// @NOTE: Users model - (Redis cache set-x[TIME] and save user data to postgres)

async function initEnsure() {
	await GameMode.ensureGameModes()
}

async function defineEvents() {
	await initEnsure()

	tokenAPI.contract.on(EventNames.Transfer, fareTransferEvent)
	spinAPI.contract.on(EventNames.EntrySubmitted, entrySubmittedEvent)
	spinAPI.contract.on(EventNames.EntrySettled, entrySettledEvent)
	spinAPI.contract.on(EventNames.GameModeUpdated, gameModeUpdatedEvent)
	spinAPI.contract.on(EventNames.RoundConcluded, roundConcludedEvent)

	// @NOTE: Perhaps this event won't be needed since we already get the random number from roundConcluded
	// spinAPI.contract.on(EventNames.RandomNumberRequested, (...args) => console.log(args))
}

export default defineEvents
