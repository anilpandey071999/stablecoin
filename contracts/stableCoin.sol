// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StableCoin is Ownable, ERC20 {
    uint256 public totalCollateral;
    AggregatorV3Interface public ethPriceFeed;
    uint256 public minimumEth = 0.5 ether;

    // Defining custom events
    error InsufficientEthSent(uint256 available, uint256 required);
    error InsufficientNUSDBalance(uint256 available, uint256 required);
    error InsufficientCollateral(uint256 available, uint256 required);
    error ETHTransferFailed();
    error InvalidAddress();

    // Defining custom events
    event EthDeposited(address indexed depositor, uint256 amount);
    event EthRedeemed(address indexed to, uint256 amount);
    event PriceFeedChanged(address newPriceFeed);
    event MinimumEthChanged(uint256 newMinimumEth);
    event EthWithdrawn(address to, uint256 amount);

    constructor(AggregatorV3Interface _priceFeed) ERC20("nUSD", "nUSD") {
        ethPriceFeed = _priceFeed;
    }

    // Function for depositing ETH and receiving nUSD
    function depositETH() external payable {
        if (msg.value < minimumEth)
            revert InsufficientEthSent(msg.value, minimumEth);

        uint256 ethPrice = getETHPriceInUSD();
        uint256 nUSDAmount = (msg.value * ethPrice) / 2;
        totalCollateral += msg.value;
        _mint(msg.sender, nUSDAmount);

        emit EthDeposited(msg.sender, msg.value);
    }

    // Function for redeeming nUSD for ETH
    function redeem(uint256 _amount) external {
        uint256 userBalance = balanceOf(msg.sender);
        if (userBalance < _amount)
            revert InsufficientNUSDBalance(userBalance, _amount);
        uint256 ethPrice = getETHPriceInUSD();
        uint256 ethAmount = (_amount * 2) / ethPrice;

        if (totalCollateral < ethAmount)
            revert InsufficientCollateral(totalCollateral, ethAmount);

        totalCollateral -= ethAmount;
        _burn(msg.sender, _amount);
        (bool success, ) = payable(msg.sender).call{value: ethAmount}("");
        if (!success) revert ETHTransferFailed();

        emit EthRedeemed(msg.sender, ethAmount);
    }

    // Function for getting the latest ETH price in USD
    function getETHPriceInUSD() public view returns (uint256) {
        (, int256 price, , , ) = ethPriceFeed.latestRoundData();
        uint8 decimals = ethPriceFeed.decimals();
        return (uint256(price) / uint256(10 ** decimals));
    }

    // Function for changing the minimum ETH deposit
    function changePriceFeed(address priceFeed) external onlyOwner {
        if (priceFeed == address(0)) revert InvalidAddress();
        ethPriceFeed = AggregatorV3Interface(priceFeed);

        emit PriceFeedChanged(priceFeed);
    }

    // Function for changing the minimum ETH deposit
    function changeMinimumEth(uint256 _minimumEth) external onlyOwner {
        minimumEth = _minimumEth;

        emit MinimumEthChanged(_minimumEth);
    }

    // Function for withdrawing all ETH from the contract
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        if (!success) revert ETHTransferFailed();

        emit EthWithdrawn(msg.sender, balance);
    }
}
