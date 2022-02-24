pragma solidity ^0.8.0;

import "./PearToken.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract PearGame is ReentrancyGuard, Ownable, VRFConsumerBase {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    // Pear Token specific variables
    address public pearTokenAddress;
    uint public constant PEAR_DECIMALS = 18;

    // Game variables / knobs
    uint public gameEdge = 100; // Game Edge -> 1%
    uint public minPearAmount = 1 ether; // Min Pear amount -> 1 PEAR
    uint public maxPearAmount = 1000000 ether; // Max Pear amount -> 1,000,000 PEAR
    uint public currentRoundId = 0;

    bytes32 internal keyHash;
    uint256 internal fee;

    // Possible selections
    enum Colors {
        RED,
        BLACK
    }

    // TWOX -> 00 = even, 01 = odd (2 options)
    // TENX -> 10, 20, 30, 40, 50, 60, 70, 80 ,90, 00 (10 options)
    // HUNX -> 00-99 (100 options)
    enum GameMode {
        TWOX,
        TENX,
        HUNX
    }

    struct PlayerEntry {
        // Amount of entry in Pear
        uint amount;
        // Block number of entry tx
        uint blockNum;
        // Address that submitted the entry
        address player;
        // Color the player picked
        uint pickedNumber;
        // Game mode the player selected
        GameMode gameMode;
        // Whether or not the entry is settled
        bool isSettled;
        // Result of the round for an entry
        uint result;
        // Amount of Pear won
        uint winAmount;
    }

    struct Wager {
        uint amount;
        GameMode gameMode;
        uint pickedNumber;
        uint winAmount;
        uint result;
    }

    struct BatchEntry {
        uint blockNum;
        address player;
        bool isSettled;
        uint totalEntryAmount;
        uint totalWinAmount;
        uint wagerId;
    }

    // Mapping roundId to list of PlayerEntries
    mapping(uint => PlayerEntry[]) public entryMap;
    // Need advanced wagering
    mapping(uint => BatchEntry[]) public batchMap;
    mapping(uint => Wager[]) public batchWagerMap;
    uint public wagerId = 0;

    // Mapping roundId to the randomNumber selected that round
    mapping(uint => uint) public randomMap;
    mapping(bytes32 => uint) public vrfMap;

    // Events
    event EntrySubmitted(uint indexed entryId, address indexed player, uint amount, uint pickedNumber, GameMode gameMode, uint idx);
    event EntrySettled(uint indexed entryId, address indexed player, uint amount, uint result, uint winAmount, uint idx);
    event EntryRefunded(uint indexed entryId, address indexed player, uint amount);
    event RoundConcluded(uint indexed roundId, uint amountMinted, uint amountBurned, uint pickedNumber);
    event RandomNumberFetched(uint indexed roundId, uint randomness, bytes32 requestId, uint randomNumStr);

    // New Events
    event EntryBatchSubmitted(uint indexed entryId, address indexed player, uint totalEntryAmount, uint wagerCount, uint idx);

    // Constructor -> Implement VFRConsumerBase here
    // constructor() VRFConsumerBase(VRF_COORDINATOR, LINK_TOKEN) public {}

    // Kovan Link and VRF contracts
    // 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9,
    // 0xa36085F69e2889c224210F603D836748e7dC0088
    constructor(address _pearTokenAddress) VRFConsumerBase(
        0x8C7382F9D8f56b33781fE506E897a4F1e2d17255,
        0x326C977E6efc84E512bB9C30f76E30c160eD06FB
    ) {
        pearTokenAddress = _pearTokenAddress;
        // keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4; // Kovan
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
    }

    function balance() external view returns(uint) {
        return IERC20(pearTokenAddress).balanceOf(address(this));
    }

    function setMinPearAmount(uint _minPearAmount) external onlyOwner {
        // @NOTE: Need to add validation here to ensure theres a range of possible min
        minPearAmount = _minPearAmount;
    }

    function setMaxPearAmount(uint _maxPearAmount) external onlyOwner {
        // @NOTE: Need to add validation here to ensure theres a range of possible max
        maxPearAmount = _maxPearAmount;
    }

    function setGameEdge(uint _gameEdge) external onlyOwner {
        gameEdge = _gameEdge;
    }

    function getRoundEntries(uint roundId) public view returns (PlayerEntry[] memory) {
        return entryMap[roundId];
    }

    function getBatchEntries(uint roundId) public view returns (BatchEntry[] memory) {
        return batchMap[roundId];
    }

    function getBatchWagerEntries(uint wagerId) public view returns (Wager[] memory) {
        return batchWagerMap[wagerId];
    }

    function placeBets(Wager[] memory wagers) external nonReentrant {
        uint wagerCount = wagers.length;
        uint totalEntryAmount = 0;

        for (uint idx = 0; idx < wagerCount; idx++) {
            totalEntryAmount = totalEntryAmount.add(wagers[idx].amount);

            batchWagerMap[wagerId].push(Wager({
                amount: wagers[idx].amount,
                pickedNumber: wagers[idx].pickedNumber,
                gameMode: wagers[idx].gameMode,
                winAmount: 0,
                result: 0
           }));
        }

        batchMap[currentRoundId].push(BatchEntry({
            blockNum: block.number,
            player: msg.sender,
            isSettled: false,
            totalEntryAmount: 0,
            totalWinAmount: 0,
            wagerId: wagerId
        }));

        PearToken(pearTokenAddress).addEntryQueueBalance(msg.sender, totalEntryAmount);

        emit EntryBatchSubmitted(currentRoundId, msg.sender, totalEntryAmount, wagerCount, batchMap[currentRoundId].length);

        wagerId += 1;
    }

    // Submit Entry
    // @NOTE: Add referrer address to allocate rewards to the address that referred this person
    function submitEntry(uint256 amount, uint pickedNumber, GameMode gameMode) external nonReentrant {
        // Validation
        require(amount >= minPearAmount && amount <= maxPearAmount, "Entry amount not within range");
        require(pickedNumber >= 0 && pickedNumber<= 99, "Picked Number not in range");

        // Transfer PearToken to Escrow/PearToken contract
        PearToken(pearTokenAddress).addEntryQueueBalance(msg.sender, amount);

        entryMap[currentRoundId].push(PlayerEntry({
            amount: amount,
            blockNum: block.number,
            player: msg.sender,
            pickedNumber: pickedNumber,
            gameMode: gameMode,
            isSettled: false,
            result: 0,
            winAmount: 0
        }));

        emit EntrySubmitted(currentRoundId, msg.sender, amount, pickedNumber, gameMode, entryMap[currentRoundId].length);
    }

    function settleBatchMap(uint randomNumber) internal nonReentrant {
        require(batchMap[currentRoundId].length > 0, "No entries to settle.");
        uint currentBatchMapSize = batchMap[currentRoundId].length;
        uint amountMinted = 0;
        uint amountBurned = 0;
        bool isRandomNumberEven = true;
        uint roundedRandomNumber = randomNumber.div(10); // 0,1,2,3,4,5,6,7,8,9
        PearToken.PlayerSettle[] memory settlements = new PearToken.PlayerSettle[](currentBatchMapSize);

        if (randomNumber % 2 != 0) {
            isRandomNumberEven = false;
        }

        for (uint idx = 0; idx < currentBatchMapSize; idx++) {
            BatchEntry storage entry = batchMap[currentRoundId][idx];
            Wager[] storage _wagers = batchWagerMap[entry.wagerId];
            uint totalEntryAmount = 0;
            uint totalWinAmount = 0;

            for (uint wagerIdx = 0; wagerIdx < _wagers.length; wagerIdx++) {
                Wager storage _wager = _wagers[wagerIdx];

                totalEntryAmount += _wager.amount;

                if (_wager.gameMode == GameMode.TWOX) {
                    bool isPlayerEven = _wager.pickedNumber % 2 != 0;

                    if (isRandomNumberEven == isPlayerEven) {
                        _wager.winAmount = _wager.amount * 2;
                        amountMinted += (_wager.winAmount - _wager.amount);
                        _wager.result = 1;
                    } else {
                        amountBurned += _wager.amount;
                    }
                } else if (_wager.gameMode == GameMode.TENX) {
                    uint playerRoundedNum = _wager.pickedNumber.div(10);
                    console.log(playerRoundedNum);
                    console.log(roundedRandomNumber);
                    if (roundedRandomNumber == playerRoundedNum) {
                        _wager.winAmount = _wager.amount * 10;
                        amountMinted += (_wager.winAmount - _wager.amount);
                        _wager.result = 1;
                    } else {
                        amountBurned += _wager.amount;
                    }
                } else if (_wager.gameMode == GameMode.HUNX) {
                    if (_wager.pickedNumber == randomNumber) {
                        _wager.winAmount = _wager.amount * 100;
                        amountMinted += (_wager.winAmount - _wager.amount);
                        _wager.result = 1;
                    } else {
                        amountBurned += _wager.amount;
                    }
                }

                totalWinAmount += _wager.winAmount;
            }

            entry.isSettled = true;

            settlements[idx] = PearToken.PlayerSettle({
                player: entry.player,
                winAmount: totalWinAmount,
                entryAmount: totalEntryAmount
            });
        }

        uint deltaAmount = 0;
        bool isMint = true;
        uint rakeAmount = amountBurned.div(50);
        amountBurned = amountBurned.sub(rakeAmount);

        if (amountMinted > amountBurned) {
            deltaAmount = amountMinted.sub(amountBurned);
            isMint = true;
        } else if(amountBurned > amountMinted) {
            deltaAmount = amountBurned.sub(amountMinted);
            isMint = false;
        }

        PearToken(pearTokenAddress).batchUpdatePlayerEntries(deltaAmount, isMint, rakeAmount, settlements);

        currentRoundId += 1;
    }

    function settleEntries(uint randomNumber) internal nonReentrant {
        require(entryMap[currentRoundId].length > 0, "No entries to settle.");
        // Get the number of current entries for the current round
        uint currentEntriesSize = entryMap[currentRoundId].length;
        uint amountMinted = 0;
        uint amountBurned = 0;
        bool isRandomNumberEven = true;
        uint roundedRandomNumber = randomNumber.div(10); // 0,1,2,3,4,5,6,7,8,9
        PearToken.PlayerSettle[] memory settlements = new PearToken.PlayerSettle[](currentEntriesSize);

        if (randomNumber % 2 != 0) {
            isRandomNumberEven = false;
        }

        // Iterate through each one of the round entries and handle minting, burning, and distribution of funds
        for (uint idx = 0; idx < currentEntriesSize; idx++) {
            PlayerEntry storage entry = entryMap[currentRoundId][idx];
            if (entry.gameMode == GameMode.TWOX) {
                // randomNumber 0-99
                // pickedNumber = 0, 1 == even, odd
                bool isPlayerEven = true;
                if (entry.pickedNumber % 2 != 0) {
                    isPlayerEven = false;
                }

                if (isPlayerEven == isRandomNumberEven) {
                    // Update entryMap
                    entry.winAmount = entry.amount * 2;
                    entry.result = 1;

                    amountMinted += (entry.winAmount - entry.amount);

                    settlements[idx] = PearToken.PlayerSettle({
                        player: entry.player,
                        winAmount: entry.winAmount,
                        entryAmount: entry.amount
                    });
                } else {
                    // Update entryMap
                    amountBurned += entry.amount;

                    settlements[idx] = PearToken.PlayerSettle({
                        player: entry.player,
                        winAmount: entry.winAmount,
                        entryAmount: entry.amount
                    });
                }

            } else if (entry.gameMode == GameMode.TENX) {
                // playerNumber = 25
                // randomNumber = 0-99
                uint playerRoundedNumber = entry.pickedNumber.div(10);

                if (roundedRandomNumber == playerRoundedNumber) {
                    // Update entryMap
                    entry.winAmount = entry.amount * 10;
                    entry.result = 1;

                    amountMinted += (entry.winAmount - entry.amount);

                    settlements[idx] = PearToken.PlayerSettle({
                        player: entry.player,
                        winAmount: entry.winAmount,
                        entryAmount: entry.amount
                    });
                } else {
                    // Update entryMap
                    amountBurned += entry.amount;

                    settlements[idx] = PearToken.PlayerSettle({
                        player: entry.player,
                        winAmount: entry.winAmount,
                        entryAmount: entry.amount
                    });
                }

            } else if (entry.gameMode == GameMode.HUNX) {
                if (entry.pickedNumber == randomNumber) {
                    entry.winAmount = entry.amount * 100;
                    entry.result = 1;

                    amountMinted += (entry.winAmount - entry.amount);

                    settlements[idx] = PearToken.PlayerSettle({
                        player: entry.player,
                        winAmount: entry.winAmount,
                        entryAmount: entry.amount
                    });
                } else {
                    // Update entryMap
                    amountBurned += entry.amount;

                    settlements[idx] = PearToken.PlayerSettle({
                        player: entry.player,
                        winAmount: entry.winAmount,
                        entryAmount: entry.amount
                    });
                }
            }

            // Entry has been settled
            entry.isSettled = true;

            // // Update the PearEscrow based off the updated entry
            // PearToken(pearTokenAddress).updateClaimsPrize(entry.player, entry.amount, entry.winAmount, entry.result);

            // Emit settled event
            emit EntrySettled(currentRoundId, entry.player, entry.amount, entry.result, entry.winAmount, idx);

            // Update the entryMap with the new settled entry
            entryMap[currentRoundId][idx] = entry;
        }

        uint deltaAmount = 0;
        bool isMint = true;
        uint rakeAmount = amountBurned.div(50);
        amountBurned = amountBurned.sub(rakeAmount);

        if (amountMinted > amountBurned) {
            deltaAmount = amountMinted.sub(amountBurned);
            isMint = true;
        } else if(amountBurned > amountMinted) {
            deltaAmount = amountBurned.sub(amountMinted);
            isMint = false;
        }

        PearToken(pearTokenAddress).batchUpdatePlayerEntries(deltaAmount, isMint, rakeAmount, settlements);

        // Update the PearEscrow based off the updated entry
        // PearToken(pearTokenAddress).updateClaimsPrize(entry.player, entry.amount, entry.winAmount, entry.result);

        emit RoundConcluded(currentRoundId, amountMinted, amountBurned, randomNumber);
        // @NOTE: We should handle the mint/burn process in bulk after determining the outcome of the round

        // Move on to the next round
        currentRoundId += 1;
    }

    function runRandomSettle() public onlyOwner {
        // Run random function to get the random number used to settle
        uint randomNumber = runRandom();

        // Set the random number that was selected for the current round
        randomMap[currentRoundId] = randomNumber;

        // Determine selected color based off of random number selected
        // Colors color = Colors.RED;
        // if (randomNumber >= 501) {
        //     color = Colors.BLACK;
        // }

        // Determines the winners/losers for a round based on the randomColor
        // Handles the minting, burning, and distribution of PearToken
        settleEntries(randomNumber);
    }

    function runRandomBatchSettle() public onlyOwner {
        // Run random function to get the random number used to settle
        uint randomNumber = runRandom();

        // Set the random number that was selected for the current round
        randomMap[currentRoundId] = randomNumber;

        // Determines the winners/losers for a round based on the randomColor
        // Handles the minting, burning, and distribution of PearToken
        settleBatchMap(randomNumber);
    }


    function runVrfRandomSettle(uint randomNumber) internal {
        // Run random function to get the random number used to settle
        // uint randomNumber = runRandom();

        // Set the random number that was selected for the current round
        // randomMap[currentRoundId] = randomNumber;a

        // Determine selected color based off of random number selected
        // Colors color = Colors.RED;
        // if (randomNumber >= 500) {
        //     color = Colors.BLACK;
        // }

        // Determines the winners/losers for a round based on the randomColor
        // Handles the minting, burning, and distribution of PearToken
        // settleEntries(randomNumber);
    }

    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        return requestRandomness(keyHash, fee);
    }

    function substring(string memory str, uint startIndex, uint endIndex) private returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex-startIndex);
        for(uint i = startIndex; i < endIndex; i++) {
            result[i-startIndex] = strBytes[i];
        }
        return string(result);
    }

    function strToUint(string memory _str) public pure returns(uint256 res) {

        for (uint256 i = 0; i < bytes(_str).length; i++) {
            if ((uint8(bytes(_str)[i]) - 48) < 0 || (uint8(bytes(_str)[i]) - 48) > 9) {
                return 0;
            }
            res += (uint8(bytes(_str)[i]) - 48) * 10**(bytes(_str).length - i - 1);
        }

        return res;
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        string memory randomNumStr = Strings.toString(randomness);
        string memory strippedNum = substring(randomNumStr, 0, 2);
        string memory strippedElim = substring(randomNumStr, 2, 17);
        uint randomNum = strToUint(strippedNum);
        // emit RandomNumberFetched(currentRoundId, randomness, requestId, 100);
        // runVrfRandomSettle(100);
        emit RandomNumberFetched(currentRoundId, randomness, requestId, randomNum);
        runVrfRandomSettle(randomNum);
    }

    function testRandom() public payable {
        bytes32 requestId = getRandomNumber();
        // vrfMap[requestId] = currentRoundId;
    }

    function runRandom() private view returns (uint256) {
        uint256 seed = uint256(keccak256(abi.encodePacked(
            block.timestamp + block.difficulty +
            ((uint256(keccak256(abi.encodePacked(block.coinbase)))) / (block.timestamp)) +
            block.gaslimit +
            ((uint256(keccak256(abi.encodePacked(msg.sender)))) / (block.timestamp)) +
            block.number
        )));
        // 0-99 Random number
        return (seed - ((seed / 100) * 100));
    }
}
