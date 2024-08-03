import { extendEnvironment, task } from "hardhat/config";
import { createAccount, loadAccounts } from "./accounts";

export const accountsPlugin = (networks: string[]) =>
  extendEnvironment((hre) => {
    const currentNetworkName = hre.network.name;
    if (
      networks.includes(currentNetworkName) &&
      !process.env.HH_LOAD_ACCOUNT_DISABLED
    ) {
      const currentNetworkName = hre.network.name;
      const accounts = loadAccounts(currentNetworkName);

      hre.config.networks[currentNetworkName].accounts = accounts.map(
        ({ privateKey }) => privateKey
      );
    }

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
  });
