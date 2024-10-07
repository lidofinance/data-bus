import { HardhatUserConfig } from "hardhat/types";

import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-ethers/types";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-chai-matchers";
import { parseContractEnvConfig } from "./lib/config";

// accountsPlugin(["gnosis", "chiado"]);

const envConfig = parseContractEnvConfig(process.env);

const config: HardhatUserConfig = {
  solidity: "0.8.26",
  //   defaultNetwork: 'local',
  networks: {
    gnosis: {
      // https://gnosis-rpc.publicnode.com
      url: "https://rpc.gnosischain.com",
      accounts: [envConfig.PK_KEY],
    },
    // local: {
    //   url: envConfig.NODE_HOST,
    // },
    chiado: {
      url: "https://gnosis-chiado-rpc.publicnode.com",
      gasPrice: 1000000000,
      accounts: [envConfig.PK_KEY],
    },
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
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
          // Blockscout
          //apiURL: "https://blockscout.com/xdai/mainnet/api",
          //browserURL: "https://blockscout.com/xdai/mainnet",
        },
      },
    ],
    apiKey: {
      chiado: envConfig.CHIADO_BLOCKSCOUT,
      gnosis: envConfig.GNOSISSCAN,
    },
  },
  mocha: {
    timeout: 40000,
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
    alwaysGenerateOverloads: false,
    dontOverrideCompile: false,
  },
};

export default config;
