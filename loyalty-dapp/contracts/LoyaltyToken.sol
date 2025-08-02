// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LoyaltyToken is ERC20, Ownable {
    constructor() ERC20("BrandPoints", "BPNT") Ownable(msg.sender) {}

    function mintPoints(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burnPoints(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
