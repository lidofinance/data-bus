# Data Bus Smart Contract
This smart contract acts as a communication bridge, facilitating message exchange between various services on the blockchain.

## Features

- ability to send arbitrary events with arbitrary data
- minimalistic implementation
- low gas consumption
- does not require support and administration

## How It Works

In Ethereum, each event is described by a list of topics and additional unindexed data. The first topic (index) is a unique identifier for the type of event, generated from its name and parameters (e.g., `Deposit(address,uint256)`).

When we trigger an event such as `SomeEvent(address)`, it automatically leads to the creation of a record in the blockchain with the identifier and the sender's address.

Example of an event in the contract:

```solidity
event Message(
    bytes32 indexed eventId,
    address indexed sender,
    bytes data
) anonymous;
```

The `anonymous` modifier indicates that the event will be recorded without using the standard signature. Instead, the event identifier `eventId` becomes the primary index. For more information on anonymous events, see the [Solidity documentation](https://docs.soliditylang.org/en/latest/abi-spec.html#events).

The main function of the contract for sending messages:

```solidity
function sendMessage(bytes32 _eventId, bytes calldata _data)
```

To use this function, you first need to encode your event signature (e.g., `keccak256(bytes('SomeEvent(address, bytes)'))`) and your data. Then, you invoke the `sendMessage` method to have the event recorded on the blockchain.

This mechanism is compatible with most Ethereum libraries for handling event data. If the data type differs from `bytes`, additional encoding may be required when retrieving the data.

To assist users, we have developed `DataBusClient`, which consists of methods for reading and sending events using a user-friendly ABI (application binary interface). This library is developed in TypeScript but can be adapted for any programming language.

You can familiarize yourself with the library implementation: [library](/client/index.ts)

Also with usage examples:
- [Simple event monitoring](monitoring/index.ts)
- [Transaction spammer with arbitrary events](scripts/lib/spammer.ts)
- [Implementation of tests](test/DataBus.test.ts)

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
> Already deployed: https://gnosis-chiado.blockscout.com/address/0x42E1DEfC18388E3AA1fCADa851499A11405cf37f?tab=txs
1. Create account
```sh
yarn create-account --network chiado
```
2. Visit website https://faucet.chiadochain.net/ and earn some xDAI
3. Deploy

```sh
yarn deploy --network chiado
```
4. (Optional) Run Testing Stand

The testing stand consists of:
- transaction spammer
- console monitoring

with the help of the testing stand you can visualize the principles of Data Bus operation
