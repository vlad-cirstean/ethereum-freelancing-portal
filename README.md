# ethereum-freelancing-portal

## Install

- ganache
- truffle (requires node)

## Run

- start ganache
- make sure the port ganache uses is the same as the one in ./truffle-config.js and in ./web/config.js (provider)
- run `truffle migrate --reset`. It will build and redeploy your contracts according to
  ./migrations/1_initial_migration.sol. (first run uncomment all deployments, after that let only the contracts you
  edit)
    
- go to ./web/config.js and chang the contracts addresses found in terminal and the abi's found in ./contracts/ContractName.sol
- open index.html in the browser and be amazed (hint: open the console)
