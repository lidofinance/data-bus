import { extendEnvironment, task } from "hardhat/config";
import { createAccount, loadAccounts } from "./accounts";
import { HardhatRuntimeEnvironment, NetworkUserConfig } from "hardhat/types";

function areArraysEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}

export const validateHHEnv = (
  networks: string[],
  hre: HardhatRuntimeEnvironment
) => {
  const currentNetworkName = hre.network.name;
  console.log(`Current network name: ${currentNetworkName}`);
  if (networks.includes(currentNetworkName)) {
    const hreAccounts = hre.network.config.accounts;
    if (Array.isArray(hreAccounts)) {
      if (!hreAccounts.length)
        throw new Error(
          `Accounts for network ${currentNetworkName} must not be empty`
        );
    } else if (hreAccounts === "remote") {
      throw new Error(
        `Accounts for network ${currentNetworkName} must not be empty`
      );
    } else if (!hreAccounts.mnemonic) {
      throw new Error(
        `Accounts for network ${currentNetworkName} must not be empty`
      );
    }
    const accounts = loadAccounts(currentNetworkName);
    const isEqual = areArraysEqual(
      hre.network.config.accounts as any[],
      accounts.map(({ privateKey }) => privateKey)
    );

    if (!isEqual)
      throw new Error(
        `The data is different from the file data for the network ${currentNetworkName}`
      );
  }
};

export const secureAccountsPlugin = (networks: string[]) =>
  extendEnvironment((hre) => {
    task(
      "create-account",
      "Creates a random account for the specified network"
    ).setAction(async (_, hre) => {
      const currentNetworkName = hre.network.name;
      if (!networks.includes(currentNetworkName)) {
        throw new Error(`The network must be from the list: ${networks}`);
      }
      console.log(`Network name: ${currentNetworkName}`);
      createAccount(currentNetworkName);
    });

    task("get-accounts", "Decrypt and prints accounts").setAction(
      async (_, hre) => {
        const currentNetworkName = hre.network.name;
        const accounts = loadAccounts(currentNetworkName);

        accounts.forEach((w) => {
          const { privateKey, publicKey, address, mnemonic } = w;
          console.log({ privateKey, publicKey, address, mnemonic });
        });
      }
    );

    task("test", async (_, hre, runSuper) => {
      validateHHEnv(networks, hre);
      await runSuper();
    });
    task("run", async (_, hre, runSuper) => {
      validateHHEnv(networks, hre);
      await runSuper();
    });
  });

export const networkWithSecureAccount = (
  name: string,
  net: NetworkUserConfig
): NetworkUserConfig | undefined => {
  let accounts = [];
  try {
    if (process.env.HH_ACCOUNTS_LOAD) accounts = loadAccounts(name);
  } catch (_) {}
  return {
    ...net,
    accounts: accounts.map(({ privateKey }) => privateKey),
  };
};
