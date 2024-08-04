# DSM data bus
The DSM data bus is a separate transport layer for communication between council-daemon and depositor-bot. This works using a smart contract and any evm compatible network.

> [!NOTE]
> The project is currently under development

## Building and testing
Create .env file
```sh
CHIADO_BLOCKSCOUT=<your key from https://gnosis-chiado.blockscout.com>
NODE_HOST=http://127.0.0.1:8888
```

Install the dependencies
```sh
yarn
```
Compile the smart contracts code 
```sh
yarn compile
```
Run the tests
```sh
yarn test
```

## Test environment
A pre-installed environment can be used to test the smart contract. These environments include

- evm test node
- event monitoring system
- smart contract message spammer

To start the test environment, enter the command:

```sh
yarn stand:default
```

A test environment without message spammer is also provided, enter the command to run it:

```sh
yarn stand:monitoring
```

## Deploy

### Chiado — gnosis testnet
1. Create account
```sh
yarn create-account --network chiado
```
2. Visit website https://faucet.chiadochain.net/ and earn some xDAI
3. Deploy

```sh
yarn deploy --network chiado
```

