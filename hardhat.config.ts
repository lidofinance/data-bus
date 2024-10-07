
import { parseContractEnvConfig } from "./lib/config";

import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-ignition-ethers";
import "@nomicfoundation/hardhat-ethers/types";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-chai-matchers";


import { encodeBytes32String } from "ethers";
import { addForking } from "./lib/add-forking";

const envConfig = parseContractEnvConfig(process.env);

const baseNetworks = {
  gnosis: {
    url: "https://rpc.gnosischain.com",
    accounts: [envConfig.PK_KEY],
  },
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
  "base-mainnet": {
    url: "https://mainnet.base.org",
    gasPrice: 1000000000,
    accounts: [envConfig.PK_KEY],
  },
};

const config: any = {
  solidity: "0.8.26",
  //   defaultNetwork: 'local',
  networks: {
    ...baseNetworks,
    hardhat: addForking({}, baseNetworks),
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
          browserURL: "https://optimistic.etherscan.io",
        },
      },
      {
        network: "polygon",
        chainId: 137,
        urls: {
          apiURL: "https://api.polygonscan.com/api",
          browserURL: "https://polygonscan.com",
        },
      },
      {
        network: "base-mainnet",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
    ],
    apiKey: {
      chiado: envConfig.CHIADO_BLOCKSCOUT,
      gnosis: envConfig.GNOSISSCAN,
      "base-mainnet": envConfig.BASESCAN,
      optimism: envConfig.OPTIMISTICSCAN,
      polygon: envConfig.POLYGONSCAN,
    },
  },
  mocha: {
    timeout: 40000,
  },
  ignition: {
    strategyConfig: {
      create2: {
        // To learn more about salts, see the CreateX documentation
        salt: encodeBytes32String("data bus deploy 1.0"),
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
