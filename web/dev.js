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
            var option = document.createElement("option");
            option.text = "Account_" + i + "_" + role;
            selector.add(option);
        }
        else {
            role = "rev"
        }


    }

    selectedAccount = accounts[0]
}

function getSelectedAccount() {
    d = document.getElementById("gusAccountSelect").value;
    d = d.split("_")[1]
    d = parseInt(d)
    selectedAccount = accounts[d]

    getProducts()
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

            for(let i = 0; i < prodCount; i++) {
                getProduct(i).then(
                    (prod) => {
                        var new_row = document.createElement('div');
                        new_row.className = "row";
                        
                        var card = document.createElement('div');
                        card.className = "card"
                        
                        var cardBody = document.createElement('div');
                        cardBody.className = "card-body"

                        var h = document.createElement("H1");
                        h.className = "card-title"              
                        var t = document.createTextNode("Project " + i);
                        var para = document.createElement("p");
                        var t1 = document.createTextNode(prod['description']);
                        var para2 = document.createElement("p");
                        var t2 = document.createTextNode(prod['expertise']);

                        var input = document.createElement("INPUT");
                        input.setAttribute("type", "number");
                        input.id = "dev-project-" + i;

                        var button = document.createElement('button');
                        button.innerHTML = 'Apply to project';
                        button.onclick = function() {
                            let sallary = parseInt(document.getElementById("dev-project-" + i).value);
                            
                            console.log(i, sallary)

                            marketplaceContract.methods.registerDevForProduct(i, sallary).send({ from: selectedAccount, gas }).then(
                                (resp) => {
                                    console.log(resp);
                                }
                            ).catch((error) => {
                                console.error(error);
                                alert(error);
                            })
                        };

                        var sendWorkDoneButton = document.createElement('button');
                        sendWorkDoneButton.innerHTML = 'Work Done';
                        sendWorkDoneButton.style.background='#ff9900';
                        sendWorkDoneButton.style.color='#232f3e';
                        sendWorkDoneButton.onclick = function() {

                            // marketplaceContract.methods.registerDevForProduct(i, sallary).send({ from: selectedAccount, gas }).then(
                            //     (resp) => {
                            //         console.log(resp);
                            //     }
                            // ).catch((error) => {
                            //     console.error(error);
                            //     alert(error);
                            // })
                        };

                        divProdList.appendChild(new_row);
                        new_row.appendChild(card);
                        card.appendChild(cardBody);
                        cardBody.appendChild(h);
                        h.appendChild(t);
                        cardBody.appendChild(para);
                        para.appendChild(t1);
                        cardBody.appendChild(para2);
                        para2.appendChild(t2);
                        cardBody.appendChild(input);
                        cardBody.appendChild(button);
                        cardBody.appendChild(document.createElement("br"));
                        cardBody.appendChild(document.createElement("br"));
                        cardBody.appendChild(sendWorkDoneButton);
                        divProdList.appendChild(document.createElement("br"));
                    }
                )
            }
        }
    )
    
}

init().then(_ => console.log('init done'));