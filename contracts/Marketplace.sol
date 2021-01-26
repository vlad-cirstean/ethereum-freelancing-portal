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
        bool isValue;
    }

    mapping(address => User) managers;
    mapping(address => User) payers;
    mapping(address => User) freelancers;
    mapping(address => User) evaluators;

    struct paiedUser {
        uint flatAmount;
        uint procentOfTotalCost;
    }

    struct Product {
        bool startedFunding;
        bool startedDeveloping;
        bool startedExecution;
        
        bool workDone;
        
        bool managerValidated;
        bool revValidated;
        
        uint executionTotalCost;
        uint devTotalCost;
        uint revTotalCost;

        address[] projectPayers;
        address[] projectFreelancers;
        address projectManager;
        address projectEvaluator;

        mapping(address => paiedUser) freelancersSalaries;
        mapping(address => paiedUser) evaluatorSalary;
        mapping(address => paiedUser) payersContribution;

        int developingStartingDate;
        int devMaxTimeout;
        int revStartingDate;
        int revMaxTimeout;
        int projectStartingDate;
        int projectMaxTimeout;
    }

    Product[] products;

    modifier requireOwner(){
        require(msg.sender == owner, "not owner crowd contract");
        _;
    }

    modifier requireManager(){
        require(managers[msg.sender].isValue, "not manager, no right to create product");
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
        managers[adr] = User(name, 5, '', true);
    }

    function createPayer(address adr, string memory name) public requireOwner {
        payers[adr] = User(name, 5, '', true);
        token.transfer(adr, 1000);
    }

    function createFreelancer(address adr, string memory name, string memory expertise) public requireOwner {
        freelancers[adr] = User(name, 5, expertise, true);
    }

    function createEvaluator(address adr, string memory name, string memory expertise) public requireOwner {
        evaluators[adr] = User(name, 5, expertise, true);
    }

    function getBalance(address adr) public view returns (uint) {
        return token.balanceOf(adr);
    }

    function createProduct(
        uint executionTotalCost,
        uint devTotalCost,
        uint revTotalCost,
        int devMaxTimeout,
        int revMaxTimeout,
        int projectStartingDate,
        int projectMaxTimeout
    ) public requireManager {
        bool startedFunding = true;
        bool startedDeveloping = false;
        bool startedExecution = false;
        bool workDone = false;
        bool managerValidated = false;
        bool revValidated = false;
        address[] projectPayers = new address[](0);
        address[] projectFreelancers = new address[](0);

        address projectManager = msg.sender;
        address projectEvaluator = address(0);

        mapping(address => paiedUser) freelancersSalaries;
        mapping(address => paiedUser) evaluatorSalary;
        mapping(address => paiedUser) payersContribution;

        int developingStartingDate = -1;
        int revStartingDate = -1;
        
        product = Product(
            startedFunding, 
            startedDeveloping, 
            startedExecution,
            workDone,
            managerValidated,
            revValidated,
            executionTotalCost,
            devTotalCost,
            revTotalCost,
            projectPayers,
            projectFreelancers,
            projectManager,
            projectEvaluator,
            freelancersSalaries,
            evaluatorSalary,
            payersContribution,
            developingStartingDate,
            devMaxTimeout,
            revStartingDate,
            revMaxTimeout,
            projectStartingDate,
            projectMaxTimeout
        );
        products.push(product);
    }
}
