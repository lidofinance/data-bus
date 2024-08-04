import { Block } from "ethers";
import { ethers } from "hardhat";
import { randomInt, sleep } from "./utils";
import { DataBus__factory } from "../../typechain-types";
import {
  UnvetData,
  PauseV2Data,
  PauseV3Data,
  PingData,
  DepositData,
  MessageType,
  sendMessage,
} from "../../lib/sdk";

const getVariants = (block: Block) => {
  const messages = [
    {
      type: MessageType.Ping,
      data: (): PingData => ({
        blockNumber: block.number,
        stakingModuleIds: [randomInt(1, 5), randomInt(6, 10)],
        app: { version: "1.0", name: "AppName" },
      }),
    },
    {
      type: MessageType.Deposit,
      data: (): DepositData => ({
        depositRoot: "0x" + "0".repeat(64),
        nonce: randomInt(1, 100),
        blockNumber: block.number,
        blockHash: block.hash as string,
        signature: "0x" + "0".repeat(130),
        stakingModuleId: randomInt(1, 5),
        app: { version: "1.0", name: "AppName" },
      }),
    },
    {
      type: MessageType.Unvet,
      data: (): UnvetData => ({
        nonce: randomInt(1, 100),
        blockNumber: block.number,
        blockHash: block.hash as string,
        stakingModuleId: randomInt(1, 5),
        signature: "0x" + "0".repeat(130),
        operatorIds: "operator" + randomInt(1, 10).toString(),
        vettedKeysByOperator: "keys" + randomInt(1, 10).toString(),
        app: { version: "1.0", name: "AppName" },
      }),
    },
    {
      type: MessageType.PauseV2,
      data: (): PauseV2Data => ({
        depositRoot: "0x" + "0".repeat(64),
        nonce: randomInt(1, 100),
        blockNumber: block.number,
        blockHash: block.hash as string,
        signature: "0x" + "0".repeat(130),
        stakingModuleId: randomInt(1, 5),
        app: { version: "1.0", name: "AppName" },
      }),
    },
    {
      type: MessageType.PauseV3,
      data: (): PauseV3Data => ({
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
  console.log(`Sending ${message.type} with random data.`);
  const tx = await sendMessage(dataBus, 1, { messageType: message.type, data: message.data() });
  // const tx = await dataBus[message.name](message.data());
  await tx.wait();
  console.log(`${message.type} executed.`);
};

export const spammer = async (dataBusAddress: string) => {
  const [signer] = await ethers.getSigners();
  const dataBus = DataBus__factory.connect(dataBusAddress, signer);
  const block = (await signer.provider.getBlock("latest")) as Block;

  while (true) {
    await sendRandomMessage(dataBus, block);
    await sleep(randomInt(1000, 2000));
  }
};
