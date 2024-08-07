import { Block } from "ethers";
import { ethers } from "hardhat";
import { randomInt, sleep } from "./utils";
import { DataBusSDK } from "../../lib/sdk/sdk";

const abi = [
  "event MessageDeposit(address indexed guardianAddress, (bytes32 depositRoot, uint256 nonce, uint256 blockNumber, bytes32 blockHash, bytes signature, uint256 stakingModuleId, (string version, string name) app) data)",
  "event MessagePauseV2(address indexed guardianAddress, (bytes32 depositRoot, uint256 nonce, uint256 blockNumber, bytes32 blockHash, bytes signature, uint256 stakingModuleId, (string version, string name) app) data)",
  "event MessagePauseV3(address indexed guardianAddress, (uint256 blockNumber, bytes signature, (string version, string name) app) data)",
  "event MessagePing(address indexed guardianAddress, (uint256 blockNumber, uint256[] stakingModuleIds, (string version, string name) app) data)",
  "event MessageUnvet(address indexed guardianAddress, (uint256 nonce, uint256 blockNumber, bytes32 blockHash, uint256 stakingModuleId, bytes signature, string operatorIds, string vettedKeysByOperator, (string version, string name) app) data)",
] as const;

const getVariants = (block: Block) => {
  const messages = [
    {
      name: "MessagePing"as const,
      data: () => ({
        blockNumber: block.number,
        stakingModuleIds: [randomInt(1, 5), randomInt(6, 10)],
        app: { version: "1.0", name: "AppName" },
      }),
    },
    {
      name: "MessageDeposit"as const,
      data: () => ({
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
      name: "MessageUnvet"as const,
      data: () => ({
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
      name: "MessagePauseV2" as const,
      data: () => ({
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
      name: "MessagePauseV3"as const,
      data: () => ({
        blockNumber: block.number,
        signature: "0x" + "0".repeat(130),
        app: { version: "1.0", name: "AppName" },
      }),
    },
  ];

  return messages;
};

const sendRandomMessage = async <SDK extends DataBusSDK<typeof abi>>(
  sdk: SDK,
  block: Block
) => {
  const variants = getVariants(block);
  const message = variants[randomInt(0, variants.length - 1)];
  console.log(`Sending ${message.name} with random data.`);
  const tx = await sdk.sendMessage(message.name, message.data() as any);
  await tx.wait();
  console.log(`${message.name} executed.`);
};

export const spammer = async (dataBusAddress: string) => {
  const [signer] = await ethers.getSigners();
  const block = (await signer.provider.getBlock("latest")) as Block;
  const sdk = new DataBusSDK(
    dataBusAddress,
    abi,
    signer
  );

  while (true) {
    await sendRandomMessage(sdk, block);
    await sleep(randomInt(5000, 10000));
  }
};
