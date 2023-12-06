// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        // AVAX/USD rate in 18 digit
        return uint256(answer * 10000000000);
    }

    function getPriceConverter(
        uint256 avaxAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 avaxPrice = getPrice(priceFeed);
        uint256 avaxAmountInUsd = (avaxPrice * avaxAmount) /
            1000000000000000000;
        return avaxAmountInUsd;
    }
}
