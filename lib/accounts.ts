import { existsSync, readFileSync, writeFileSync } from "fs";

import readline from "readline-sync";
import { ethers } from "ethers";
import { encryptStore, decryptStore } from "./crypto";

const ACCOUNTS_PATH = "./accounts.json";
let passPhrase = "";

type Store = {
  eth: {
    [x: string]: {
      address: string;
      secret: string;
    }[];
  };
};

export class InvalidPasswordError extends Error {}

export const loadAccounts = (networkName: string): any[] => {
  if (!existsSync(ACCOUNTS_PATH)) {
    throw new Error(`Accounts file not found at path: ${ACCOUNTS_PATH}`);
  }

  let store: Store;
  try {
    store = JSON.parse(readFileSync(ACCOUNTS_PATH, "utf-8"));
  } catch (err) {
    throw new Error("Error reading or parsing the accounts file");
  }

  if (!store.eth) {
    throw new Error('No "eth" section found in the accounts file');
  }

  if (!(networkName in store.eth)) {
    throw new Error(
      `Accounts for network "${networkName}" are missing in the file`
    );
  }

  const storeEth = store.eth[networkName];
  const pass = getPassword();

  try {
    return storeEth.map(({ secret, address }) => {
      return { address, ...JSON.parse(decryptStore(secret, pass)) };
    });
  } catch (error) {
    throw new InvalidPasswordError((error as any).message);
  }
};

const generateKeys = () => {
  const wallet = ethers.Wallet.createRandom();
  return wallet;
  //   console.log("Private Key:", wallet.privateKey);
  //   console.log("Public Key:", wallet.publicKey);
  //   console.log("Address:", wallet.address);
};
const getPassword = () => {
  if (passPhrase) return passPhrase;
  passPhrase = readline.question("Enter the pass phrase: ", {
    hideEchoBack: true,
  });
  return passPhrase;
};

export const createAccount = (networkName: string) => {
  try {
    const alreadyCreated = loadAccounts(networkName);
    if (alreadyCreated) {
      console.log(`Already exists: ${alreadyCreated.map((s) => s.address)}`);
    }
    return alreadyCreated;
  } catch (error) {
    if (error instanceof InvalidPasswordError) {
      throw new Error(`Invalid passphrase`);
    }
  }

  const pass = getPassword();
  const { privateKey, publicKey, address, mnemonic } = generateKeys();
  const secret = encryptStore(
    JSON.stringify({ privateKey, publicKey, mnemonic }),
    pass
  );

  const store: Store = {
    eth: { [networkName]: [{ address, secret }] },
  };

  writeFileSync(ACCOUNTS_PATH, JSON.stringify(store), "utf-8");

  //   console.log(loadAccounts(networkName));
};
