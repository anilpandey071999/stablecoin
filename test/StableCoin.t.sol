// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/StableCoin_Local.sol";

contract TestStableCoin is Test {
    StableCoinLocal public stableCoinLocal;
    function setUp() public {
        stableCoinLocal = new StableCoinLocal();
    }
}