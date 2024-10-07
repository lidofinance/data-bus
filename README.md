# Data Bus
This smart contract functions as a communication channel on the blockchain, allowing for efficient message exchange between various services.

## Features

- ability to send arbitrary events with arbitrary data
- minimalistic implementation
- low gas consumption
- does not require support and administration

## How It Works

The smart contract uses a special kind of event, referred to as an "abstract event," which can be customized to carry different types of data under various event identifiers. This flexibility allows the system to handle multiple event types through a single unified mechanism.

### Abstract Event Design

The event structure in the contract is defined as follows:

```solidity
event Message(
    bytes32 indexed eventId,
    address indexed sender,
    bytes data
) anonymous;
```

The `anonymous` attribute in this event means it does not use the standard topic for the event signature as is typical in Ethereum events. Instead, it utilizes a manually specified `eventId` as the primary identifier. This design allows the system to abstract away from specific event types, enabling users to define and emit any event type based on this generic template. For more details on anonymous events, you can refer to the [Solidity documentation](https://docs.soliditylang.org/en/latest/abi-spec.html#events).

### Emitting Events

To emit an event, you first calculate the hash of your event signature (e.g., `keccak256(bytes('SomeEvent(address,bytes)'))`) which becomes the `eventId`. This identifier along with the data is then passed to the following function:

```solidity
function sendMessage(bytes32 _eventId, bytes calldata _data)
```

This function takes the `eventId` and the data you want to transmit, and it logs the event on the blockchain. This method allows any user-defined event to be emitted using the `Message` event template, offering a flexible and powerful way to handle custom events.

### Compatibility and Extensions

This setup is compatible with most Ethereum libraries, which handle the parsing of event data directly. If the event data requires specific types other than `bytes`, additional encoding steps may be necessary when processing or emitting events.

Additionally, to facilitate the use of this contract, we have developed `DataBusClient`. This client library provides methods for both reading and sending events using a human-friendly ABI format. Initially developed in TypeScript, it can be easily ported to other programming languages to meet diverse implementation needs.

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
> Already deployed: https://gnosis-chiado.blockscout.com/address/0xf21Ea6AADb7479d2B9301f190a68A2C36738A0d2#code
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
