const web3 = new Web3(window.config.provider);
let accounts = [];
let marketplaceContract = {};

const gas = 2500000;

async function init() {
    const { abi: marketAbi } = await fetch('./Marketplace.json').then(res => res.json());
    accounts = await web3.eth.getAccounts();
    marketplaceContract = new web3.eth.Contract(marketAbi, window.contracts.marketplace.address);
}


async function echo() {
    console.log(await marketplaceContract.methods.echo('hello').call({ from: accounts[0] }));
    console.log(await marketplaceContract.methods.myAddress().call({ from: accounts[0] }));
}

async function initActors() {
    const actors = [
        [ 'createManager', [ accounts[0], 'manager' ] ],
        [ 'createPayer', [ accounts[1], 'payer1' ] ],
        [ 'createPayer', [ accounts[2], 'payer2' ] ],
        [ 'createFreelancer', [ accounts[3], 'freelancer1', 'frontend' ] ],
        [ 'createFreelancer', [ accounts[4], 'freelancer2', 'backend' ] ],
        [ 'createFreelancer', [ accounts[5], 'freelancer3', 'security' ] ],
        [ 'createFreelancer', [ accounts[6], 'evaluator1', 'backend' ] ],
        [ 'createFreelancer', [ accounts[7], 'evaluator2', 'security' ] ]
    ];

    for (const i of actors) {
        await marketplaceContract.methods[i[0]](...i[1]).send({ from: accounts[0], gas: gas });
    }

    const result = await marketplaceContract.methods.getBalance(accounts[1]).call({ from: accounts[0] });
    console.log(result);
}

async function createProduct() {

    let executionTotalCost = 20
    let devTotalCost = 30
    let revTotalCost = 25
    let devMaxTimeout = 5
    let revMaxTimeout = 6
    let projectStartingDate = new Date().getTime();
    let projectMaxTimeout = 7
    marketplaceContract.methods.createProduct(
        executionTotalCost, devTotalCost, revTotalCost,
        devMaxTimeout, revMaxTimeout, projectStartingDate, projectMaxTimeout
    ).send({ from: accounts[0], gas: gas });


}

async function getProduct(productNumber) {

    const result = await marketplaceContract.methods.getProduct(productNumber).call({ from: accounts[0] });
    console.log(result);
}

async function getManager(managerAdr) {
    const result = await marketplaceContract.methods.getManager(managerAdr).call({ from: accounts[0] });
    console.log(result)
}

init().then(_ => console.log('init done'));
