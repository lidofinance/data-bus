#!/bin/bash

npx hardhat run scripts/send-test-tx.ts --network chiado
npx hardhat run scripts/send-test-tx.ts --network gnosis
npx hardhat run scripts/send-test-tx.ts --network polygon
npx hardhat run scripts/send-test-tx.ts --network base-mainnet
npx hardhat run scripts/send-test-tx.ts --network optimism
