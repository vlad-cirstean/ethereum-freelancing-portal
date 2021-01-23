# ethereum-freelancing-portal

## Install

- node
- ganache

## Run

- `npm i`
- start ganache
- make sure the port ganache uses is the same as the one in ./truffle-config.js and in ./web/config.js (provider)
- run `npm run truffle`. It will build and redeploy your contracts according to ./migrations/1_initial_migration.sol. (
  for first run uncomment all deployments, after that let only the contracts you edit)
- go to ./web/config.js and change the contracts addresses printed in terminal, and the abi found in
  ./contracts/ContractName.sol
- run `npm run serve` in the browser and be amazed (hint: open the console)
