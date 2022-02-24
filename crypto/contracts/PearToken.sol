pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// @NOTE: Create separate Escrow contract that handles the _claims process
contract PearToken is ERC20, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    // Enums
    enum WithdrawTo {
        PEARBALANCE,
        DEPOSITBALANCE
    }

    // Structs
    // @NOTE: This can include ERC721 rewards in the future
    struct Prize {
        uint256 queueAmount; // Waiting to settle / determine fate of entry
        uint256 prizeAmount; // Amount of PearToken a player is able to claim
        uint256 depositAmount; // Amount of PearToken deposited by user
        uint256 interestAmount;// Amount of interested generated from prize amount
        bool doesExist;
    }

    struct Claims {
        mapping (address => Prize) prizes; // List of every player with an entry and the amount their owed
        address[] players; // List of address for every player with an entry
    }

    struct PlayerSettle {
        address player;
        uint winAmount;
        uint entryAmount;
    }

    // Events
    event PearDeposited(address indexed playerAddress, uint amount);
    event PrizeClaimed(address indexed playerAddress, uint amount, WithdrawTo to);
    event PlayerWithdrawal(address indexed playerAddress, uint amount);

    // Variables
    uint public constant INITIAL_SUPPLY = (5 * (10**10)) * (10**18); // 50 Billion initial Supply
    Claims private _claims;
    uint public pearTake = 0;

    // Modifiers
    modifier playerExists {
        require(_claims.prizes[msg.sender].doesExist, "Player does not exist in escrow.");
        _;
    }

    constructor() ERC20("Pear", "PEAR") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    // @NOTE need to ensure that only users of the address or the contract owner can fetch _claims balances
    function getClaimsPrize(address player) public view returns (Prize memory) {
        return _claims.prizes[player];
    }

    function getAllClaimPlayers() public view returns (address[] memory) {
        return _claims.players;
    }

    function depositIntoEscrow(uint depositAmount) public {
        _transfer(msg.sender, address(this), depositAmount);

        // @NOTE: Need to put this into a function
        if (!_claims.prizes[msg.sender].doesExist) {
            _claims.players.push(msg.sender);
            _claims.prizes[msg.sender].doesExist = true;
        }

        // Add the entry amount to the
        _claims.prizes[msg.sender].depositAmount = _claims.prizes[msg.sender].depositAmount.add(depositAmount);
        emit PearDeposited(msg.sender, depositAmount);
    }

    // @NOTE Need to create a custom modifier for the PearGame contract
    function addEntryQueueBalance(address player, uint entryAmount) external {
        // @NOTE: Deposit balance = depositAmount + prizeAmount
        require(_claims.prizes[player].doesExist, "Player must deposit funds");
        require(entryAmount <= _claims.prizes[player].depositAmount.add(_claims.prizes[player].prizeAmount), "Exceeds deposit balance.");

        // If player hasn't made an try add them to the players array and set there existence
        // @NOTE: Need to put this into a function
        // @NOTE: This is no longer needed because in order to add an entry the user needs to have a deposited balance
        // if (!_claims.prizes[player].doesExist) {
        //     _claims.players.push(player);
        //     _claims.prizes[player].doesExist = true;
        // }
        if (entryAmount > _claims.prizes[player].depositAmount) {
            uint remainingEntryAmount = entryAmount.sub(_claims.prizes[player].depositAmount);
            _claims.prizes[player].depositAmount = 0;
            _claims.prizes[player].prizeAmount = _claims.prizes[player].prizeAmount.sub(remainingEntryAmount);
            _claims.prizes[player].queueAmount = _claims.prizes[player].queueAmount.add(entryAmount);
        } else {
            // Add the entry amount to the queue
            _claims.prizes[player].depositAmount = _claims.prizes[player].depositAmount.sub(entryAmount);
            _claims.prizes[player].queueAmount = _claims.prizes[player].queueAmount.add(entryAmount);
        }

    }

    function batchUpdatePlayerEntries(uint deltaAmount, bool isMint, uint rakeAmount, PlayerSettle[] memory settlements) external {
        require(settlements.length > 0, "No settlements were passed.");

        for (uint idx = 0; idx < settlements.length; idx++) {
            PlayerSettle memory entry = settlements[idx];

            _claims.prizes[entry.player].queueAmount = _claims.prizes[entry.player].queueAmount.sub(entry.entryAmount);

            if (entry.winAmount > 0) {
                _claims.prizes[entry.player].prizeAmount = _claims.prizes[entry.player].prizeAmount.add(entry.winAmount);
            }
        }

        if (isMint) {
            _mint(address(this), deltaAmount);
        } else {
            _burn(address(this), deltaAmount);
        }

        pearTake = pearTake.add(rakeAmount);

        //         _claims.prizes[player].queueAmount = _claims.prizes[player].queueAmount.sub(entryAmount);

        // if (isMint == 1) {
        //     // Since the entryAmount already exists inside of the escrow we mint the difference
        //     // between winAmount and entryAmount and update the _claims prize amount with the winAmount
        //     uint256 mintAmount = winAmount.sub(entryAmount);
        //     _mint(address(this), mintAmount);
        //     _claims.prizes[player].prizeAmount = _claims.prizes[player].prizeAmount.add(winAmount);
        // } else {
        //     // If player did not win, we burn the entryAmount inside the escrow.
        //     // There is no need to update the claim prizes amount since the queueAmount has already been subtracted
        //     uint256 _takeAmount = entryAmount.div(50);
        //     uint256 _burnAmount = entryAmount.sub(_takeAmount);
        //     pearTake = pearTake.add(_takeAmount);

        //     _burn(address(this), _burnAmount);
        // }
    }

    // @NOTE Need to create a custom modifier for the PearGame contract
    function updateClaimsPrize(address player, uint entryAmount, uint winAmount, uint isMint) external {
        require(_claims.prizes[player].doesExist, "Player does not exist");
        // @NOTE: Need to add validation and the checking if the burn amount produces a negative number

        /*
            Start of with remove the entryAmount from the queue
            With this approve it allows a player to enter into multiple games
            Each one of the games will adjust the queueAmount as the game is settled
            _claims.prizes[player].queueAmount = _claims.prizes[player].queueAmount.sub(entryAmount);
        */

        // @NOTE: If we want to allow users to enter into a game with their unclaimed prizes
        // There needs to be additional logic to handle that condition
        _claims.prizes[player].queueAmount = _claims.prizes[player].queueAmount.sub(entryAmount);

        if (isMint == 1) {
            // Since the entryAmount already exists inside of the escrow we mint the difference
            // between winAmount and entryAmount and update the _claims prize amount with the winAmount
            uint256 mintAmount = winAmount.sub(entryAmount);
            _mint(address(this), mintAmount);
            _claims.prizes[player].prizeAmount = _claims.prizes[player].prizeAmount.add(winAmount);
        } else {
            // If player did not win, we burn the entryAmount inside the escrow.
            // There is no need to update the claim prizes amount since the queueAmount has already been subtracted
            uint256 _takeAmount = entryAmount.div(50);
            uint256 _burnAmount = entryAmount.sub(_takeAmount);
            pearTake = pearTake.add(_takeAmount);

            _burn(address(this), _burnAmount);
        }
    }

    function withdrawFromEscrow(uint amount) public nonReentrant playerExists {
        // require(_claims.prizes[msg.sender].doesExist, "User does not exist in escrow");
        require(_claims.prizes[msg.sender].depositAmount.add(_claims.prizes[msg.sender].prizeAmount) > 0, "Nothing in deposit balance");
        require(_claims.prizes[msg.sender].depositAmount.add(_claims.prizes[msg.sender].prizeAmount) >= amount, "Exceeds deposit balance");

        if (amount > _claims.prizes[msg.sender].depositAmount) {
            uint remainingWithdrawAmount = amount.sub(_claims.prizes[msg.sender].depositAmount);
            _claims.prizes[msg.sender].depositAmount = 0;
            _claims.prizes[msg.sender].prizeAmount = _claims.prizes[msg.sender].prizeAmount.sub(remainingWithdrawAmount);
        } else {
            // Add the entry amount to the queue
            _claims.prizes[msg.sender].depositAmount = _claims.prizes[msg.sender].depositAmount.sub(amount);
        }

        // uint depositAmount = _claims.prizes[msg.sender].depositAmount.add(_claims.prizes[msg.sender].prizeAmount);

        // _claims.prizes[msg.sender].depositAmount = 0;
        // _claims.prizes[msg.sender].prizeAmount = 0;

        this.approve(msg.sender, amount);
        this.transfer(msg.sender, amount);
        emit PlayerWithdrawal(msg.sender, amount);
    }

    // @NOTE: In the future, add the abilities to claim specific amounts of you prize
    function claimPrize(WithdrawTo to) public nonReentrant playerExists {
        // require(_claims.prizes[msg.sender].doesExist, "Player entry does not exist.");
        require(_claims.prizes[msg.sender].prizeAmount > 0, "Player has no prizes to claim.");

        /*
            - Get the prizeAmount from the _claims mapping
            - Remove the prizeAmount from the PearEscrow contract
            - Update the prizeAmount to the player that is claiming the prize
        */

        uint256 prizeAmount = _claims.prizes[msg.sender].prizeAmount;

        // Reset the players prizeAmount to 0
        if (to == WithdrawTo.DEPOSITBALANCE) {
            _claims.prizes[msg.sender].prizeAmount = 0;
            _claims.prizes[msg.sender].depositAmount = _claims.prizes[msg.sender].depositAmount.add(prizeAmount);
            emit PrizeClaimed(msg.sender, prizeAmount, to);
        } else if (to == WithdrawTo.PEARBALANCE) {
            _claims.prizes[msg.sender].prizeAmount = 0;
            this.approve(msg.sender, prizeAmount);
            this.transfer(msg.sender, prizeAmount);
            emit PrizeClaimed(msg.sender, prizeAmount, to);
        }
    }
}