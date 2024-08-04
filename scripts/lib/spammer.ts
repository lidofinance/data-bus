import ethers, { Block, BytesLike, JsonRpcProvider, Wallet } from "ethers";
import { randomInt, sleep } from "./utils";
import { DSMDataBus, DSMDataBus__factory } from "../../typechain-types";

const getVariants = (block: Block) => {
  const messages = [
    {
      name: "sendPingMessage",
      data: (): DSMDataBus.PingDataStruct => ({
        blockNumber: block.number,
        guardianIndex: randomInt(1, 10),
        stakingModuleIds: [randomInt(1, 5), randomInt(6, 10)],
        app: { version: "1.0", name: "AppName" },
      }),
    },
    {
      name: "sendDepositMessage",
      data: (): DSMDataBus.DepositDataStruct => ({
        guardianIndex: randomInt(1, 10),
        depositRoot: "0x" + "0".repeat(64),
        nonce: randomInt(1, 100),
        blockNumber: block.number,
        blockHash: block.hash as BytesLike,
        signature: "0x" + "0".repeat(130),
        stakingModuleId: randomInt(1, 5),
        app: { version: "1.0", name: "AppName" },
      }),
    },
    {
      name: "sendUnvetMessage",
      data: (): DSMDataBus.UnvetDataStruct => ({
        guardianIndex: randomInt(1, 10),
        nonce: randomInt(1, 100),
        blockNumber: block.number,
        blockHash: block.hash as BytesLike,
        stakingModuleId: randomInt(1, 5),
        signature: "0x" + "0".repeat(130),
        operatorIds: "operator" + randomInt(1, 10).toString(),
        vettedKeysByOperator: "keys" + randomInt(1, 10).toString(),
        app: { version: "1.0", name: "AppName" },
      }),
    },
    {
      name: "sendPauseMessageV2",
      data: (): DSMDataBus.PauseV2DataStruct => ({
        guardianIndex: randomInt(1, 10),
        depositRoot: "0x" + "0".repeat(64),
        nonce: randomInt(1, 100),
        blockNumber: block.number,
        blockHash: block.hash as BytesLike,
        signature: "0x" + "0".repeat(130),
        stakingModuleId: randomInt(1, 5),
        app: { version: "1.0", name: "AppName" },
      }),
    },
    {
      name: "sendPauseMessageV3",
      data: (): DSMDataBus.PauseV3DataStruct => ({
        guardianIndex: randomInt(1, 10),
        blockNumber: block.number,
        signature: "0x" + "0".repeat(130),
        app: { version: "1.0", name: "AppName" },
      }),
    },
  ];

  return messages;
};

const sendRandomMessage = async (dataBus: any, block: Block) => {
  const variants = getVariants(block);
  const message = variants[randomInt(0, variants.length - 1)];
  console.log(`Sending ${message.name} with random data.`);
  const tx = await dataBus[message.name](message.data());
  await tx.wait();
  console.log(`${message.name} executed.`);
};
// Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
// Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export const spammer = async (dataBusAddress: string, rpcUrl: string) => {
  const provider = new JsonRpcProvider(rpcUrl);
  const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new Wallet(privateKey, provider);
  const dataBus = DSMDataBus__factory.connect(dataBusAddress, wallet);
  const block = (await provider.getBlock("latest")) as Block;
  while (true) {
    await sendRandomMessage(dataBus, block);
    await sleep(randomInt(1000, 2000));
  }
};
