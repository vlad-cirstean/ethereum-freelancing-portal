const web3 = new Web3(window.config.provider);
let accounts = [];
let marketplaceContract = {};

const gas = 2500000;

let productCount = -1;

let selectedAccount

async function init() {
    const { abi: marketAbi } = await fetch('./Marketplace.json').then(res => res.json());
    accounts = await web3.eth.getAccounts();
    marketplaceContract = new web3.eth.Contract(marketAbi, window.contracts.marketplace.address);

    let selector = document.getElementById('gusAccountSelect')
    for(var i = 0; i < accounts.length; i++) {
        var role
        if(i == 0) {
            role = "manager"
        }
        else if(i >= 1 && i <= 2) {
            role = "payer"
        }
        else if(i >= 3 && i <= 5) {
            role = "dev"
        }
        else {
            role = "rev"
        }

        var option = document.createElement("option");
        option.text = "Account_" + i + "_" + role;
        selector.add(option);
    }

    selectedAccount = accounts[0]

    // getProducts();
}

function getSelectedAccount() {
    d = document.getElementById("gusAccountSelect").value;
    d = d.split("_")[1]
    d = parseInt(d)
    selectedAccount = accounts[d]

    getProducts()
}

async function createProduct() {

    let executionTotalCost = document.getElementById("gusExercutionCost").value
    let devTotalCost = document.getElementById("gusDevCost").value
    let revTotalCost = document.getElementById("gusRevCost").value
    let devMaxTimeout = document.getElementById("gusDevMaxTimeout").value
    let revMaxTimeout = document.getElementById("gusRevMaxTimeout").value
    let projectStartingDate = new Date().getTime();
    let projectMaxTimeout = document.getElementById("gusProjectTimeout").value
    let description = document.getElementById("gusDescription").value
    let expertise = document.getElementById("gusExpertise").value


    marketplaceContract.methods.createProduct(
        executionTotalCost, devTotalCost, revTotalCost,
        devMaxTimeout, revMaxTimeout, projectStartingDate, projectMaxTimeout,
        description, expertise
    ).send({ from: selectedAccount, gas: gas });
}

document.getElementById("gusSubmitCreateProduct").onclick = function fun() {
    createProduct()  
}

async function getProductCount() {
    productCount = await marketplaceContract.methods.getProductCount().call({ from: selectedAccount });
    return productCount;
}

async function getProduct(productNumber) {

    const result = await marketplaceContract.methods.getProduct(productNumber).call({ from: selectedAccount });
    return result;
}

async function getProducts() {
    getProductCount().then(
        (prodCount) => {
            divProdList = document.getElementById("gusProductList")
            divProdList.innerHTML = "";

            for(var i = 0; i < prodCount; i++) {
                getProduct(i).then(
                    (prod) => {
                        console.log(prod)
                        var new_row = document.createElement('div');
                        new_row.className = "row";
                        
                        var card = document.createElement('div');
                        card.className = "card"
                        
                        var cardBody = document.createElement('div');
                        cardBody.className = "card-body"

                        var h = document.createElement("H1");
                        h.className = "card-title"              
                        var t = document.createTextNode("Project");
                        var para = document.createElement("p");
                        var t1 = document.createTextNode(prod['description']);
                        var para2 = document.createElement("p");
                        var t2 = document.createTextNode(prod['expertise']);
                        
                        console.log(prod['description'])

                        divProdList.appendChild(new_row);
                        new_row.appendChild(card);
                        card.appendChild(cardBody);
                        cardBody.appendChild(h);
                        h.appendChild(t);
                        cardBody.appendChild(para);
                        para.appendChild(t1);
                        cardBody.appendChild(para2);
                        para2.appendChild(t2);
                        divProdList.appendChild(document.createElement("br"));
                    }
                )
            }
        }
    )
    
}

init().then(_ => console.log('init done'));