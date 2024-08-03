import { HardhatUserConfig } from "hardhat/types";
import { mochaRootHooks } from "./test/hooks";

import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-chai-matchers";
import { secureAccountsPlugin } from "./lib";

secureAccountsPlugin(["gnosis", "chiado"]);

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    gnosis: {
      url: "https://rpc.gnosischain.com",
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    customChains: [
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          //Blockscout
          apiURL: "https://blockscout.com/gnosis/chiado/api",
          browserURL: "https://blockscout.com/gnosis/chiado",
        },
      },
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          // 3) Select to what explorer verify the contracts
          // Gnosisscan
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
          // Blockscout
          //apiURL: "https://blockscout.com/xdai/mainnet/api",
          //browserURL: "https://blockscout.com/xdai/mainnet",
        },
      },
    ],
    apiKey: {
      //4) Insert your Gnosisscan API key
      //blockscout explorer verification does not require keys
      chiado: "your key",
      gnosis: "your key",
    },
  },
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
