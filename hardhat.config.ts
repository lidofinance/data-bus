import { HardhatUserConfig } from "hardhat/types";
import { mochaRootHooks } from "./test/hooks";

import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-chai-matchers";

const config: HardhatUserConfig = {
  solidity: "0.8.20",

  mocha: {
    timeout: 40000,
    rootHooks: mochaRootHooks,
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
    alwaysGenerateOverloads: false,
    dontOverrideCompile: false,
  },
};

export default config;
