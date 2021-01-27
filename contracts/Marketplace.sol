// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma abicoder v2;

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
        bool managerAnswer;
        bool revValidated;
        bool revAnswer;

        bool projectDone;

        uint executionTotalCost;
        uint devTotalCost;
        uint revTotalCost;
        uint totalCost;

        uint numPayers;
        uint numFreelancers;

        address[] projectPayers;
        address[] projectFreelancers;
        address projectEvaluator;

        uint[] payersContribution;
        uint fundsCollected;
        uint[] freelancersSalaries;
        uint evaluatorSalary;

        address projectManager;

        int developingStartingDate;
        int devMaxTimeout;
        int revStartingDate;
        int revMaxTimeout;
        int projectStartingDate;
        int projectMaxTimeout;

        string description;
        string expertise;
    }

    uint numPorducts;
    mapping(uint => Product) products;

    modifier requireOwner(){
        require(msg.sender == owner, "not owner crowd contract");
        _;
    }

    modifier requireManager(){
        require(managers[msg.sender].isValue, "not manager, no right to create product");
        _;
    }

    modifier requirePayer(){
        require(payers[msg.sender].isValue, "not payer");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function initToken(address adr) public requireOwner {
        token = Token(adr);
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

    function getManager(address adr) public returns (User memory) {
        return managers[adr];
    }

    function createPayer(address adr, string memory name) public requireOwner {
        payers[adr] = User(name, 5, '', true);
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
        int projectMaxTimeout,
        string memory description,
        string memory expertise
    ) public {
        Product storage product = products[numPorducts++];
        product.startedFunding = true;
        product.startedDeveloping = false;
        product.startedExecution = false;
        product.workDone = false;
        product.managerValidated = false;
        product.revValidated = false;

        product.projectManager = msg.sender;
        product.developingStartingDate = - 1;
        product.revStartingDate = - 1;

        product.executionTotalCost = executionTotalCost;
        product.devTotalCost = devTotalCost;
        product.revTotalCost = revTotalCost;
        product.totalCost = executionTotalCost + devTotalCost + revTotalCost;

        product.devMaxTimeout = devMaxTimeout;
        product.revMaxTimeout = revMaxTimeout;
        product.projectStartingDate = projectStartingDate;
        product.projectMaxTimeout = projectMaxTimeout;

        product.description = description;
        product.expertise = expertise;
    }

    function getProduct(uint prodNumber) public view returns (Product memory) {
        return products[prodNumber];
    }

    function getProductCount() public view returns (uint) {
        return numPorducts;
    }


    function financeProduct(uint prodNumber, uint amount) public requirePayer {
        require(products[prodNumber].startedFunding == true, 'project funding has finished');

        token.transferFrom(msg.sender, address(this), amount);
        products[prodNumber].fundsCollected += amount;

        if (products[prodNumber].fundsCollected >= products[prodNumber].totalCost) {
            products[prodNumber].startedFunding = false;
            products[prodNumber].startedDeveloping = true;
        }

        uint i;
        for (i = 0; i < products[prodNumber].projectPayers.length; i++) {
            if (products[prodNumber].projectPayers[i] == msg.sender) {
                products[prodNumber].payersContribution[i] += amount;
                return;
            }
        }
        products[prodNumber].projectPayers.push(msg.sender);
        products[prodNumber].payersContribution.push(amount);
    }

    function withdrawProductFinance(uint prodNumber, uint amount) public requirePayer {
        require(products[prodNumber].startedFunding == true, 'project funding has finished');

        uint i;
        for (i = 0; i < products[prodNumber].projectPayers.length; i++) {
            if (products[prodNumber].projectPayers[i] == msg.sender) {
                break;
            }
        }
        require(products[prodNumber].projectPayers[i] == msg.sender, 'not financed this product');
        require(products[prodNumber].payersContribution[i] >= amount, 'not enough funds');

        products[prodNumber].payersContribution[i] -= amount;
        products[prodNumber].fundsCollected -= amount;
        token.transfer(msg.sender, amount);
    }

    function returnMoneyToPayers(uint prodNumber) public requireManager {
        require(products[prodNumber].startedFunding == true, 'project funding has finished');
        require(products[prodNumber].projectManager == msg.sender, 'not manager of this product');
        for (uint i = 0; i < products[prodNumber].projectPayers.length; i++) {
            uint amount = products[prodNumber].payersContribution[i];
            if (amount >= 0) {
                token.transfer(products[prodNumber].projectPayers[i], amount);
            }
        }
    }

    function registerRevForProduct(uint productId, uint salary) public {
        require(products[productId].projectEvaluator == address(0), "rev already exists for project");
        // require(products[productId].startedDeveloping == true, "project not funded yet");

        products[productId].projectEvaluator = msg.sender;
        products[productId].evaluatorSalary = salary;
    }

    function registerDevForProduct(uint productId, uint salary) public {
        require(salary < products[productId].devTotalCost, "cost exceeds total cost allocated for devs");
        // require(products[productId].startedDeveloping == true, "project not funded yet");

        products[productId].projectFreelancers.push(msg.sender);
        products[productId].freelancersSalaries.push(salary);
        products[productId].numFreelancers++;
    }

    function rejectDevToWorkOnProject(uint prodNumber, address devAdr) public {
        require(products[prodNumber].startedDeveloping == true, "Project should be in execution");
        require(products[prodNumber].projectManager == msg.sender, 'not manager of this product');

        uint arrLength = products[prodNumber].projectFreelancers.length;
        for (uint i = 0; i < arrLength; i++) {
            if (products[prodNumber].projectFreelancers[i] == devAdr) {
                products[prodNumber].projectFreelancers[i] = products[prodNumber].projectFreelancers[arrLength - 1];
                products[prodNumber].projectFreelancers.pop();
                break;
            }
        }

        uint sum = 0;
        for (uint i = 0; i < products[prodNumber].freelancersSalaries.length; i++) {
            sum += products[prodNumber].freelancersSalaries[i];
        }

        if (sum == products[prodNumber].devTotalCost) {
            products[prodNumber].managerValidated = false;
            products[prodNumber].workDone = false;
            products[prodNumber].startedExecution = true;
            products[prodNumber].startedDeveloping = false;
            products[prodNumber].startedFunding = false;
        }
    }

    function sendWorkDone(uint prodNumber) public {
        require(products[prodNumber].startedExecution == true, "Project should be in execution");

        uint i;
        for (i = 0; i < products[prodNumber].projectFreelancers.length; i++) {
            if (products[prodNumber].projectFreelancers[i] == msg.sender) {
                break;
            }
        }
        require(products[prodNumber].projectFreelancers[i] == msg.sender, 'not dev of this product');

        products[prodNumber].managerValidated = false;
        products[prodNumber].workDone = true;
        products[prodNumber].startedExecution = false;
        products[prodNumber].startedDeveloping = false;
        products[prodNumber].startedFunding = false;
    }

    function acceptDevWork(uint prodNumber) public {
        require(products[prodNumber].workDone == true, "Project should be in execution");
        require(products[prodNumber].projectManager == msg.sender, 'not manager of this product');


        products[prodNumber].managerValidated = true;
        products[prodNumber].workDone = false;
        products[prodNumber].startedExecution = false;
        products[prodNumber].startedDeveloping = false;
        products[prodNumber].startedFunding = false;

        for (uint i = 0; i < products[prodNumber].projectFreelancers.length; i++) {
            token.transfer(products[prodNumber].projectFreelancers[i], products[prodNumber].freelancersSalaries[i]);

            if (freelancers[products[prodNumber].projectFreelancers[i]].rep < 5) {
                freelancers[products[prodNumber].projectFreelancers[i]].rep++;
            }
        }
    }

    function acceptManagerValidation(uint prodNumber, bool validated) public {
        require(products[prodNumber].projectEvaluator == msg.sender, "Your are not the evaluator of this project");
        require(products[prodNumber].workDone == true, "Dev haven't yet submited their work");
        require(products[prodNumber].managerValidated == true, "Manager have not validated project");
        require(products[prodNumber].managerAnswer == false, "Manager approved project, no need for this");

        if (validated) {
            for (uint i = 0; i < products[prodNumber].projectFreelancers.length; i++) {
                token.transfer(products[prodNumber].projectFreelancers[i], products[prodNumber].freelancersSalaries[i]);

                if (freelancers[products[prodNumber].projectFreelancers[i]].rep < 5) {
                    freelancers[products[prodNumber].projectFreelancers[i]].rep++;
                }
            }
        } else {
            for (uint i = 0; i < products[prodNumber].projectFreelancers.length; i++) {
                if (freelancers[products[prodNumber].projectFreelancers[i]].rep > 0) {
                    freelancers[products[prodNumber].projectFreelancers[i]].rep--;
                }
            }

            products[prodNumber].projectDone = true;
            token.transfer(products[prodNumber].projectEvaluator, products[prodNumber].evaluatorSalary);
            if(evaluators[products[prodNumber].projectEvaluator].rep > 0) {
                evaluators[products[prodNumber].projectEvaluator].rep++;
            }


            products[prodNumber].numFreelancers = 0;
            delete products[prodNumber].projectFreelancers;
            delete products[prodNumber].freelancersSalaries;

            products[prodNumber].projectEvaluator = address(0);
            products[prodNumber].evaluatorSalary = 0;

            products[prodNumber].workDone = false;
            products[prodNumber].managerValidated = false;
            products[prodNumber].startedDeveloping = true;
            products[prodNumber].startedExecution = false;
            products[prodNumber].startedFunding = false;

        }
    }

}
