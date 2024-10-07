#!/bin/bash

FORKING_NETWORK=gnosis npx hardhat ignition deploy ignition/modules/data-bus.ts --strategy create2
FORKING_NETWORK=polygon npx hardhat ignition deploy ignition/modules/data-bus.ts --strategy create2
FORKING_NETWORK=base-mainnet npx hardhat ignition deploy ignition/modules/data-bus.ts --strategy create2
FORKING_NETWORK=optimism npx hardhat ignition deploy ignition/modules/data-bus.ts --strategy create2
FORKING_NETWORK=chiado npx hardhat ignition deploy ignition/modules/data-bus.ts --strategy create2
