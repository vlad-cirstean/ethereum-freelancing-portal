const web3 = new Web3(window.config.provider);
let accounts = [];
let contracts = {};

async function init() {
    accounts = await web3.eth.getAccounts();
    contracts = {
        marketplaceContract: new web3.eth.Contract(window.contracts.marketplace.abi, window.contracts.marketplace.address)
    };
}


async function run() {
    const { marketplaceContract } = contracts;

    const result = await marketplaceContract.methods.echo('hello').call({ from: accounts[0] });
    console.log(result);
}

init().then(_ => console.log('init done'));
