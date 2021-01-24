// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import './Token.sol';

contract Marketplace {
    Token token;

    address owner;

    struct User {
        string name;
        uint rep;
        string expertise;
    }

    mapping(address => User) managers;
    mapping(address => User) payers;
    mapping(address => User) freelancers;
    mapping(address => User) evaluators;

    modifier requireOwner(){
        require(msg.sender == owner, "not owner crowd contract");
        _;
    }

    constructor() public {
        token = new Token();
        owner = msg.sender;
    }

    function echo(string memory input) public returns (string memory text) {
        return input;
    }

    function myAddress() public returns (address text) {
        return msg.sender;
    }

    function createManager(address adr, string memory name) public requireOwner {
        managers[adr] = User(name, 5, '');
    }

    function createPayer(address adr, string memory name) public requireOwner {
        payers[adr] = User(name, 5, '');
        token.transfer(adr, 1000);
    }

    function createFreelancer(address adr, string memory name, string memory expertise) public requireOwner {
        freelancers[adr] = User(name, 5, expertise);
    }

    function createEvaluator(address adr, string memory name, string memory expertise) public requireOwner {
        evaluators[adr] = User(name, 5, expertise);
    }

    function getBalance(address adr) public view returns (uint) {
        return token.balanceOf(adr);
    }
}
