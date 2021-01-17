const web3 = new Web3(window.config.provider);
let accounts = [];
let contracts = {};

async function init() {
    accounts = await web3.eth.getAccounts();
    contracts = {
        tokenContract: new web3.eth.Contract(window.contracts.token.abi, window.contracts.token.address)
    };
}


async function run() {
    const { tokenContract } = contracts;

    const result = await tokenContract.methods.hello().call({ from: accounts[0] });
    console.log(result);
}

init().then(_ => console.log('init done'));
