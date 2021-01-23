// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import './Token.sol';

contract Marketplace {
    Token token;

    constructor() public {
        token = new Token();
    }

    function echo(string memory input) public returns (string memory text) {
        return input;
    }
}
