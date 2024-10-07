#!/bin/bash

npx hardhat ignition deploy ignition/modules/data-bus.ts --network gnosis --strategy create2 --verify
npx hardhat ignition deploy ignition/modules/data-bus.ts --network polygon --strategy create2 --verify
npx hardhat ignition deploy ignition/modules/data-bus.ts --network base-mainnet --strategy create2 --verify
npx hardhat ignition deploy ignition/modules/data-bus.ts --network optimism --strategy create2 --verify
npx hardhat ignition deploy ignition/modules/data-bus.ts --network chiado --strategy create2 --verify
