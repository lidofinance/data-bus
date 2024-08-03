import { HardhatUserConfig } from "hardhat/types";
import { mochaRootHooks } from "./test/hooks";

import dotenv from "dotenv";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-ethers/types";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-chai-matchers";
import { networkWithSecureAccount, secureAccountsPlugin } from "./lib";
dotenv.config();
secureAccountsPlugin(["gnosis", "chiado"]);

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    // gnosis: networkWithSecureAccount("gnosis", {
    //   url: "https://rpc.gnosischain.com",
    // }),
    chiado: networkWithSecureAccount("chiado", {
      url: "https://gnosis-chiado-rpc.publicnode.com",
      gasPrice: 1000000000,
    }),
    // chiado: {
    //   url: "https://gnosis-chiado-rpc.publicnode.com",
    //   gasPrice: 1000000000,
    // },
  },
  etherscan: {
    customChains: [
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          apiURL: "https://gnosis-chiado.blockscout.com/api",
          browserURL: "https://gnosis-chiado.blockscout.com",
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
      chiado: process.env.CHIADO_BLOCKSCOUT as string,
      // gnosis: "your key",
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
