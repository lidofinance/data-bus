#!/bin/bash

# This script checks the contract deployment on all networks, as well as the functionality of public node.
# If any of the nodes are not giving the correct data, it is worth finding a new node on the site https://chainlist.org/ before deploying. 

FORKING_NETWORK=gnosis npx hardhat ignition deploy ignition/modules/data-bus.ts --strategy create2
FORKING_NETWORK=polygon npx hardhat ignition deploy ignition/modules/data-bus.ts --strategy create2
FORKING_NETWORK=base-mainnet npx hardhat ignition deploy ignition/modules/data-bus.ts --strategy create2
FORKING_NETWORK=optimism npx hardhat ignition deploy ignition/modules/data-bus.ts --strategy create2
FORKING_NETWORK=chiado npx hardhat ignition deploy ignition/modules/data-bus.ts --strategy create2
