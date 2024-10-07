import { HardhatUserConfig } from "hardhat/types";

import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-ignition-ethers";
import "@nomicfoundation/hardhat-ethers/types";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-chai-matchers";

import { parseContractEnvConfig } from "./lib/config";
import { encodeBytes32String } from "ethers";

// accountsPlugin(["gnosis", "chiado"]);

const envConfig = parseContractEnvConfig(process.env);

const config: any = {
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

    optimism: {
      url: "https://optimism-rpc.publicnode.com",
      gasPrice: 1000000000,
      accounts: [envConfig.PK_KEY],
    },

    polygon: {
      url: "https://polygon-bor-rpc.publicnode.com",
      gasPrice: 1000000000,
      accounts: [envConfig.PK_KEY],
    },

    'base-mainnet': {
      url: 'https://mainnet.base.org',
      accounts: [process.env.WALLET_KEY as string],
      gasPrice: 1000000000,
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
      {
        network: "optimism",
        chainId: 10,
        urls: {
          apiURL: "https://api.optimistic.etherscan.io/api",
          browserURL: "https://optimistic.etherscan.io"
        }
      },
      {
        network: "polygon",
        chainId: 137,
        urls: {
          apiURL: "https://api.polygonscan.com/api",
          browserURL: "https://polygonscan.com"
        }
      },
      {
        network: "base-mainnet",
        chainId: 8453,
        urls: {
         apiURL: "https://api.basescan.org/api",
         browserURL: "https://basescan.org"
        }
      }
    ],
    apiKey: {
      chiado: envConfig.CHIADO_BLOCKSCOUT,
      gnosis: envConfig.GNOSISSCAN,
      "base-mainnet": envConfig.BASESCAN,
      optimism: envConfig.OPTIMISTICSCAN,
      polygon: envConfig.POLYGONSCAN
    },
  },
  mocha: {
    timeout: 40000,
  },
  ignition: {
    strategyConfig: {
      create2: {
        // To learn more about salts, see the CreateX documentation
        salt: encodeBytes32String('data bus deploy 1.0'),
      },
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
    alwaysGenerateOverloads: false,
    dontOverrideCompile: false,
  },
};

export default config;
