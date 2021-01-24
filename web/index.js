const web3 = new Web3(window.config.provider);
let accounts = [];
let marketplaceContract = {};

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
        await marketplaceContract.methods[i[0]](...i[1]).call({ from: accounts[0] });
    }

    const result = await marketplaceContract.methods.getBalance(accounts[1]).call({ from: accounts[0] });
    console.log(result);
}


init().then(_ => console.log('init done'));
