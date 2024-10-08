import { Block } from "ethers";
import { ethers } from "hardhat";
import { Address, DataBusClient } from "../../client";

const abi = [
  "event InitialTestEvent(address indexed guardianAddress, (uint256 blockNumber, (bytes32 version) app) data)",
] as const;

const sendRandomMessage = async <SDK extends DataBusClient<typeof abi>>(
  sdk: SDK,
  block: Block
) => {
  console.log(`Sending InitialTestEvent with random data.`);
  const tx = await sdk.sendMessage("InitialTestEvent", {
    blockNumber: BigInt(block.number),
    app: { version: ("0x" + "0".repeat(64)) as Address },
  });
  await tx.wait();
  console.log(`InitialTestEvent executed.`);
};

export const sendTestTx = async (dataBusAddress: string) => {
  const [signer] = await ethers.getSigners();
  const block = (await signer.provider.getBlock("latest")) as Block;
  const sdk = new DataBusClient(dataBusAddress, abi, signer);

  await sendRandomMessage(sdk, block);

  console.log(await sdk.getAll(block.number));
};
