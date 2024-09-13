import { expect } from "chai";
import { ethers } from "hardhat";
import { encodeBytes32String, Signer } from "ethers";
import { getReceipt } from "./lib";
import { Address, DataBusClient } from "../client";
import {randomInt} from "../scripts/lib/utils";

const abi = [
  "event MessageDepositV1(address indexed guardianAddress, (uint256 blockNumber, bytes32 blockHash, bytes32 depositRoot, uint256 stakingModuleId, uint256 nonce, (bytes32 r, bytes32 vs) signature, (bytes32 version) app) data)",
  "event MessagePauseV2(address indexed guardianAddress, (uint256 blockNumber, bytes32 blockHash, (bytes32 r, bytes32 vs) signature, uint256 stakingModuleId, (bytes32 version) app) data)",
  "event MessagePauseV3(address indexed guardianAddress, (uint256 blockNumber, bytes32 blockHash, (bytes32 r, bytes32 vs) signature, (bytes32 version) app) data)",
  "event MessagePingV1(address indexed guardianAddress, (uint256 blockNumber, (bytes32 version) app) dataWithOtherKey)",
  "event MessageUnvetV1(address indexed guardianAddress, (uint256 blockNumber, bytes32 blockHash, uint256 stakingModuleId, uint256 nonce, bytes operatorIds, bytes vettedKeysByOperator, (bytes32 r, bytes32 vs) signature, (bytes32 version) app) data)",
] as const;

describe("DataBus", function () {
  let owner: Signer;
  let sdk: DataBusClient<typeof abi>;

  beforeEach(async function () {
    const DataBus = await ethers.getContractFactory("DataBus");
    [owner] = await ethers.getSigners();
    const dataBus = await DataBus.connect(owner).deploy();

    sdk = new DataBusClient(await dataBus.getAddress(), abi, owner);
  });

  it("should measure gas for sendPingMessage", async function () {
    const data = {
      blockNumber: 100n,
      app: { version: "0x" + "0".repeat(64) as Address },
    };

    const tx = await sdk.sendMessage("MessagePingV1", data);

    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendPingMessage:", receipt.gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(29847);

    const [event] = await sdk.get("MessagePingV1");

    expect(event.dataWithOtherKey).to.deep.equal(data);
    expect(event.guardianAddress).to.deep.equal(await owner.getAddress());

    expect(event).to.deep.equal((await sdk.getAll())[0]);
  });

  it("should measure gas for sendDepositMessage", async function () {
    const data = {
      blockNumber: 100n,
      blockHash: encodeBytes32String("hash"),
      depositRoot: "0x" + "0".repeat(64),
      stakingModuleId: 1n,
      nonce: 1n,
      signature: {r: "0x" + "0".repeat(64), vs: "0x" + "0".repeat(64) },
      app: { version: "0x" + "0".repeat(64) },
    };
    const tx = await sdk.sendMessage("MessageDepositV1", data as any);
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendDepositMessage:", gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(31858);

    const [event] = await sdk.get("MessageDepositV1");

    expect(event.data).to.deep.equal(data);
    expect(event.guardianAddress).to.deep.equal(await owner.getAddress());

    expect(event).to.deep.equal((await sdk.getAll())[0]);
  });

  it("should measure gas for sendUnvetMessage", async function () {
    const data = {
      blockNumber: 100,
      blockHash: encodeBytes32String("hash"),
      stakingModuleId: 1,
      nonce: 1,
      operatorIds: encodeBytes32String("operator1"),
      vettedKeysByOperator: encodeBytes32String("keys"),
      signature: {r: "0x" + "0".repeat(64), vs: "0x" + "0".repeat(64) },
      app: { version: "0x" + "0".repeat(64) as Address },
    };
    const tx = await sdk.sendMessage("MessageUnvetV1", data as any);
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendUnvetMessage:", gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(34024);

    const [event] = await sdk.get("MessageUnvetV1");

    expect(event.data).to.deep.equal(data);
    expect(event.guardianAddress).to.deep.equal(await owner.getAddress());

    expect(event).to.deep.equal((await sdk.getAll())[0]);
  });

  it("should measure gas for sendPauseMessageV2", async function () {
    const data = {
      blockNumber: 100,
      blockHash: encodeBytes32String("hash"),
      signature: {r: "0x" + "0".repeat(64), vs: "0x" + "0".repeat(64) },
      stakingModuleId: 1,
      app: { version: "0x" + "0".repeat(64) as Address },
    };
    const tx = await sdk.sendMessage("MessagePauseV2", data as any);
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendPauseMessageV2:", gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(31858);

    const [event] = await sdk.get("MessagePauseV2");

    expect(event.data).to.deep.equal(data);
    expect(event.guardianAddress).to.deep.equal(await owner.getAddress());

    expect(event).to.deep.equal((await sdk.getAll())[0]);
  });

  it("should measure gas for sendPauseMessageV3", async function () {
    const data = {
      blockNumber: 100,
      blockHash: encodeBytes32String("hash"),
      signature: {r: "0x" + "0".repeat(64), vs: "0x" + "0".repeat(64) },
      app: { version: "0x" + "0".repeat(64) as Address },
    };
    const tx = await sdk.sendMessage("MessagePauseV3", data as any);
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendPauseMessageV3:", gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(30213);

    const [event] = await sdk.get("MessagePauseV3");

    expect(event.data).to.deep.equal(data);
    expect(event.guardianAddress).to.deep.equal(await owner.getAddress());

    expect(event).to.deep.equal((await sdk.getAll())[0]);
  });
});
