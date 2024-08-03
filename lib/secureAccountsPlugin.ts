import { extendEnvironment, task } from "hardhat/config";
import { createAccount, loadAccounts } from "./accounts";

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
      console.log(`Network name1: ${currentNetworkName}`);
      createAccount(currentNetworkName);
    });

    task("test", async (_, hre, runSuper) => {
      const currentNetworkName = hre.network.name;
      console.log(`Current network name: ${currentNetworkName}`);
      if (networks.includes(currentNetworkName)) {
        const accounts = loadAccounts(currentNetworkName);
        hre.network.config.accounts = accounts;
      }
      await runSuper();
    });
  });
