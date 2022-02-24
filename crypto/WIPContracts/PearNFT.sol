pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PearNFT is ERC721, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Pear Loot Boxes", "PLB") {

    }

    function _baseURI() internal pure override returns (string memory) {
        return "API_URL_HERE";
    }

    function mint(address to) {
        require(_tokenIdCounter.current() < 3);
        _tokenIdCounter.increment();
        _safeMint(to, _tokenIdCounter.current());

        return _tokenIdCounter.current();
    }
}