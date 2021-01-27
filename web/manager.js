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
            role = "rev";
            var option = document.createElement("option");
            option.text = "Account_" + i + "_" + role;
            selector.add(option);
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
                        console.log(prod)
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
                        input.id = "rev-project-" + i;


                        var workDoneAcceptButton = document.createElement('button');
                        var workDoneDenyButton = document.createElement('button');

                        workDoneAcceptButton.innerHTML = 'Accept that Project is Done'
                        workDoneDenyButton.innerHTML = 'Denny that Project is Done'

                        workDoneAcceptButton.style.background='#228B22';
                        workDoneDenyButton.style.background='#FF0000';
                        workDoneAcceptButton.style.color = 'white';
                        workDoneDenyButton.style.color = 'white';

                        workDoneAcceptButton.onclick = function() {
                            
                            let projectAccepted = true
                            // marketplaceContract.methods.registerRevForProduct(i, sallary).send({ from: selectedAccount, gas }).then(
                            //     (resp) => {
                            //         console.log(resp);
                            //         alert("Registered for product " + i);
                            //     }
                            // ).catch((error) => {
                            //     console.error(error);
                            //     alert(error);
                            // })
                        };

                        workDoneDenyButton.onclick = function() {
                            
                            let projectAccepted = false
                            // marketplaceContract.methods.registerRevForProduct(i, sallary).send({ from: selectedAccount, gas }).then(
                            //     (resp) => {
                            //         console.log(resp);
                            //         alert("Registered for product " + i);
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


                        cardBody.appendChild(workDoneAcceptButton)
                        cardBody.appendChild(workDoneDenyButton)


                        var h2 = document.createElement("H3");      
                        var t3 = document.createTextNode("Project Devs that Applied");
                        new_row.appendChild(document.createElement("br"))
                        new_row.appendChild(h2)
                        h2.appendChild(t3)

                        a = ['fre11', 'free2']
                        b =  [123, 432]

                        console.log(prod['projectFreelancers'])

                        for(let idxDev = 0; idxDev < a.length; idxDev++) {
                            console.log(idxDev)
                            var dev = a[idxDev]
                            var devSallary = b[idxDev]

                            var card = document.createElement('div');
                            card.id = 'card-dev-' + i + '_' + idxDev
                            card.className = "card"
                            
                            var cardBody = document.createElement('div');
                            cardBody.className = "card-body"

                            var h = document.createElement("H2");
                            h.className = "card-title"              
                            var t = document.createTextNode(dev);

                            var para = document.createElement("p");
                            var t1 = document.createTextNode(devSallary);

                            var rejectDevButton = document.createElement('button');

                            rejectDevButton.innerHTML = 'Reject Dev'
                            rejectDevButton.style.background='#ff9900';
                            rejectDevButton.style.color = '#232f3e';
                            rejectDevButton.id = 'reject-button-dev-' + i + '_' + idxDev

                            card.appendChild(cardBody);
                            cardBody.appendChild(h);
                            h.appendChild(t);
                            cardBody.appendChild(para);
                            para.appendChild(t1);

                            card.appendChild(rejectDevButton);

                            new_row.appendChild(document.createElement("br"))
                            new_row.appendChild(card)
    
                            rejectDevButton.onclick = function() {
                                
                                alert("Dev Rejected from project")
                                // call reject dev

                                // marketplaceContract.methods.registerRevForProduct(i, sallary).send({ from: selectedAccount, gas }).then(
                                //     (resp) => {
                                //         console.log(resp);
                                //         alert("Registered for product " + i);
                                //     }
                                // ).catch((error) => {
                                //     console.error(error);
                                //     alert(error);
                                // })

                                let auxCard = document.getElementById('card-dev-'+ i + '_' + idxDev)
                                let auxBttn = document.getElementById('reject-button-dev-' + i + '_' + idxDev)
                                auxCard.removeChild(auxBttn);
                            };
                        }
                        
                        divProdList.appendChild(document.createElement("br"));
                    }
                )
            }
        }
    )
    
}

init().then(_ => console.log('init done'));