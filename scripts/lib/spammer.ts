import { Block, encodeBytes32String } from "ethers";
import { ethers } from "hardhat";
import { randomInt, sleep } from "./utils";
import { Address, DataBusClient } from "../../client";

const abi = [
  "event MessageDepositV1(address indexed guardianAddress, (uint256 blockNumber, bytes32 blockHash, bytes32 depositRoot, uint256 stakingModuleId, uint256 nonce, (bytes32 r, bytes32 vs) signature, (bytes32 version) app) data)",
  "event MessagePauseV2(address indexed guardianAddress, (uint256 blockNumber, bytes32 blockHash, (bytes32 r, bytes32 vs) signature, uint256 stakingModuleId, (bytes32 version) app) data)",
  "event MessagePauseV3(address indexed guardianAddress, (uint256 blockNumber, bytes32 blockHash, (bytes32 r, bytes32 vs) signature, (bytes32 version) app) data)",
  "event MessagePingV1(address indexed guardianAddress, (uint256 blockNumber, (bytes32 version) app) data)",
  "event MessageUnvetV1(address indexed guardianAddress, (uint256 blockNumber, bytes32 blockHash, uint256 stakingModuleId, uint256 nonce, bytes operatorIds, bytes vettedKeysByOperator, (bytes32 r, bytes32 vs) signature, (bytes32 version) app) data)",
] as const;

const getVariants = (block: Block) => {
  const messages = [
    {
      name: "MessagePingV1" as const,
      data: () => ({
        blockNumber: block.number,
        stakingModuleIds: [randomInt(1, 5), randomInt(6, 10)],
        app: { version: "0x" + "0".repeat(64) as Address },
      }),
    },
    {
      name: "MessageDepositV1" as const,
      data: () => ({
        blockNumber: block.number,
        blockHash: block.hash as string,
        depositRoot: "0x" + "0".repeat(64),
        stakingModuleId: randomInt(1, 5),
        nonce: randomInt(1, 100),
        signature: { r: "0x" + "0".repeat(64), vs: "0x" + "0".repeat(64) },
        app: { version: "0x" + "0".repeat(64) as Address },
      }),
    },
    {
      name: "MessageUnvetV1" as const,
      data: () => ({
        blockNumber: block.number,
        blockHash: block.hash as string,
        stakingModuleId: randomInt(1, 5),
        nonce: randomInt(1, 100),
        operatorIds: encodeBytes32String(
          "operator" + randomInt(1, 10).toString()
        ),
        vettedKeysByOperator: encodeBytes32String(
          "keys" + randomInt(1, 10).toString()
        ),
        signature: { r: "0x" + "0".repeat(64), vs: "0x" + "0".repeat(64) },
        app: { version: "0x" + "0".repeat(64) as Address },
      }),
    },
    {
      name: "MessagePauseV2" as const,
      data: () => ({
        blockNumber: block.number,
        blockHash: block.hash as string,
        signature: { r: "0x" + "0".repeat(64), vs: "0x" + "0".repeat(64) },
        stakingModuleId: randomInt(1, 5),
        app: { version: "0x" + "0".repeat(64) as Address },
      }),
    },
    {
      name: "MessagePauseV3" as const,
      data: () => ({
        blockNumber: block.number,
        blockHash: block.hash as string,
        signature: { r: "0x" + "0".repeat(64), vs: "0x" + "0".repeat(64) },
        app: { version: "0x" + "0".repeat(64) as Address },
      }),
    },
  ];

  return messages;
};

const sendRandomMessage = async <SDK extends DataBusClient<typeof abi>>(
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
  const sdk = new DataBusClient(dataBusAddress, abi, signer);

  while (true) {
    await sendRandomMessage(sdk, block);
    await sleep(randomInt(5000, 10000));
  }
};
