// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract nUSD is ERC20 {
    uint256 public totalCollateral;
    address payable public owner;
    AggregatorV3Interface public ethPriceFeed;

    constructor() ERC20("nUSD", "nUSD") {
        owner = payable(msg.sender);
    }

     function depositETH() external payable {
        // TODO: Implement checks to ensure some ETH is being sent.

        // TODO: Implement logic to get the price of ETH in USD.

        // TODO: Calculate the amount of nUSD to mint (50% of the USD value of the deposited ETH).

        // TODO: Add the deposited ETH to the total collateral.

        // TODO: Mint the calculated amount of nUSD and transfer to the sender.
    }

    function redeem(uint256 _amount) external {
        // TODO: Implement checks to ensure the sender has enough nUSD to redeem.

        // TODO: Implement logic to get the price of ETH in USD.

        // TODO: Calculate the amount of ETH to send (double the USD value of the nUSD to be redeemed).

        // TODO: Check if there is enough collateral to send the calculated amount of ETH.

        // TODO: Subtract the ETH to send from the total collateral.

        // TODO: Burn the nUSD from the sender's balance.

        // TODO: Transfer the calculated amount of ETH to the sender.
    }

    function getETHPriceInUSD() public view returns (uint256) {
        // TODO: Implement logic to connect to an oracle and return the current price of ETH in USD.
    }
}
