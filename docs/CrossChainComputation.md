# Cross Chain Computation (C3 Transactions)
> An abstraction layer that sends ethereum transactions to the Polygon network to be computed and relayed back.
> This makes transaction fees a fraction of the cost compared to doing on Ethereum alone.

## Ethereum <-> Polygon

### Contracts

- PearToken
- PearGame
- PearNFTs

#### Steps

- User makes a deposit to Pear Escrow 
    - Requires a two transactions (approve and transfer)
- User makes an entry 
    - Requires one transaction (submitEntry)
    - amount, playerAddress, pickedNumber, gameMode, isSettled, result(0 or 1), winAmount, blockNum
- Contract owner initializes VRF
    - Requires a LINK fee
- VRF Orchestrator calls fufillRandomness function on PearGame contract
    - Orchestrator returns randomNumber via fufillRandomness
    - settleEntries function is ran
    - Each entry is looped through and determined if it has lost or won
    - After loop, batchUpdatePlayerEntries is called to PearToken Escrow.
    - The values passed are deltaAmount, isMint, rakeAmount, and settlements(entries that has been settled)
    - RoundConclued event is emitted
    - The currentRoundId is incremented

#### Ethereum

-> Deposit is made -> Token is sent to Ethereum Escrow (locked up inside of escrow)
-> C3 from Etherem to Polyon Escrow -> Player balances is updated to reflect deposit amount
-> Submit Entry
-> C3 from Ethereum to Polygon
-> Entry is submitted
-> VRF is ran
-> Entries are settled
-> Entry is settled
-> C3 from Polygon to Ethereum Escrow with the net mint/burn amount
-> User submits a withdrawal
-> C3 from Ethereum to Polygon
-> Deposit balance is validated and balance is updated
-> C3 is sent from Polygon to Ethereum with success
-> Ethereum escrow contract sends deposited tokens to playerAddress

#### L1 <-> L2 Communication

- Requirement
    - is IFxMessageProcessor;
    - address public fxChild;
    - address public fxRootTunnel;
    - setFxRootTunnel(address _fxRootTunnel) external virtual
    - Need to add to Polygon escrow (isEth: true) flag to indicate if a balance is from Ethereum

- Root (Ethereum)
    - _processMessageFromChild(uint256 stateId, address rootMessageSender, bytes calldata metadata)
    - _sendMessageToChild(bytes memory metadata)
- Child (Polygon)
    - _processMessageFromRoot(uint256 stateId, address rootMessageSender, bytes calldata metadata)
    - _sendMessageToRoot(bytes memory metadata)

###### Possible Structure
---
The byte32 varible could be treated as a string literal with different separators

submitEntry (Ethereum to Polygon)

```
byte32 options = {
    "methodName": "submitEntry",
    "playerAddress": "0x000",
    "amount": 1000,
    "gameMode": 0,
    "pickedNumber": 1
}

_sendMessageToChild(options)
```


```
struct SubmitEntryMetadata {
    "playerAddress": "0x000",
    "amount": 1000,
    "gameMode": 0,
    "pickedNumber": 1
}

function _proccessMessageFromRoot(byte32 metadata) {
    // JSON.parse(metadata) -> SubmitEntryMetadata

    submitEntry(playerAddress, amount, gameMode, pickedNumber);
}
```

```
function ethSubmitEntry(uint256 amount, uint pickedNumber, GameMode gameMode) external nonReentrant {
    // Validation
    require(amount >= minPearAmount && amount <= maxPearAmount, "Entry amount not within range");
    require(pickedNumber >= 0 && pickedNumber<= 99, "Picked Number not in range");

    // Transfer PearToken to Escrow/PearToken contract
    EthPearToken(pearTokenAddress).addEntryQueueBalance(msg.sender, amount);

    // JSON byte32 string
    _sendMessageToChild(options);

    // Processed and added the entry to polygon
    
    emit EntrySubmitted(currentRoundId, msg.sender, amount, pickedNumber, gameMode, entryMap[currentRoundId].length);
}
```
