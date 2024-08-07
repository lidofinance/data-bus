# Data Bus
This smart contract serves as an abstract data bus, which can be utilized to facilitate lightweight, inter-service communication.

> [!NOTE]
> The project is currently under development

## Features

- minimalistic implementation
- low gas consumption
- does not require support and administration

## How it works

The concept involves using an anonymous event to specify `eventId`, `sender`, and `data`.

- `eventId` consists of an arbitrary set of bytes. Additional logic can be implemented to encode the name and version.
- `sender` is the transaction initiator. Without explicit authorization, it is assumed that the receiving side will filter based on known senders.
- `data` represents arbitrary data encoded as `bytes`.

```solidity
event Message(
    bytes32 indexed eventId,
    address indexed sender,
    bytes data
) anonymous;
```

To leverage this, you need to prepare the structures of your messages, for example:

```ts
tuple(uint256 blockNumber, uint256[] stakingModuleIds, tuple(string version, string name) app)
```
Next, prepare an event identifier, which can be any `bytes32` data, such as:

```ts
tuple(string name, uint16 version)
```

Then, you invoke the contract method:

```solidity
function sendMessage(bytes32 _eventId, bytes calldata _data)
```

Afterwards, you can subscribe to the contract's logs, decode the data, and utilize it as needed.

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
