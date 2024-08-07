import { expect } from "chai";
import { ethers } from "hardhat";
import { encodeBytes32String, Signer } from "ethers";
import { getReceipt } from "./lib";
import { DataBusSDK } from "../lib/sdk/sdk";
import { ParseAbi } from "abitype";

const abi = [
  "event MessageDeposit(address indexed guardianAddress, (bytes32 depositRoot, uint256 nonce, uint256 blockNumber, bytes32 blockHash, bytes signature, uint256 stakingModuleId, (string version, string name) app) data)",
  "event MessagePauseV2(address indexed guardianAddress, (bytes32 depositRoot, uint256 nonce, uint256 blockNumber, bytes32 blockHash, bytes signature, uint256 stakingModuleId, (string version, string name) app) data)",
  "event MessagePauseV3(address indexed guardianAddress, (uint256 blockNumber, bytes signature, (string version, string name) app) data)",
  "event MessagePing(address indexed guardianAddress, (uint256 blockNumber, uint256[] stakingModuleIds, (string version, string name) app) data)",
  "event MessageUnvet(address indexed guardianAddress, (uint256 nonce, uint256 blockNumber, bytes32 blockHash, uint256 stakingModuleId, bytes signature, string operatorIds, string vettedKeysByOperator, (string version, string name) app) data)",
] as const;

describe("DataBus", function () {
  let owner: Signer;
  let sdk: DataBusSDK<typeof abi>;

  beforeEach(async function () {
    const DataBus = await ethers.getContractFactory("DataBus");
    [owner] = await ethers.getSigners();
    const dataBus = await DataBus.connect(owner).deploy();

    sdk = new DataBusSDK(await dataBus.getAddress(), abi, owner);
  });

  it("should measure gas for sendPingMessage", async function () {
    const data = {
      blockNumber: 100n,
      stakingModuleIds: [1n, 2n],
      app: { version: "1.0", name: "AppName" },
    };

    const tx = await sdk.sendMessage("MessagePing", data);

    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendPingMessage:", receipt.gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(29847);

    const [event] = await sdk.get("MessagePing");

    expect(event.data).to.deep.equal(data);
    expect(event.guardianAddress).to.deep.equal(await owner.getAddress());

    expect(event).to.deep.equal((await sdk.getAll())[0]);
  });

  it("should measure gas for sendDepositMessage", async function () {
    const data = {
      depositRoot: "0x" + "0".repeat(64),
      nonce: 1,
      blockNumber: 100,
      blockHash: encodeBytes32String("hash"),
      signature: "0x" + "0".repeat(130),
      stakingModuleId: 1,
      app: { version: "1.0", name: "AppName" },
    };
    const tx = await sdk.sendMessage("MessageDeposit", data);
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendDepositMessage:", gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(31858);

    const [event] = await sdk.get("MessageDeposit");

    expect(event.data).to.deep.equal(data);
    expect(event.guardianAddress).to.deep.equal(await owner.getAddress());

    expect(event).to.deep.equal((await sdk.getAll())[0]);
  });

  it("should measure gas for sendUnvetMessage", async function () {
    const data = {
      nonce: 1,
      blockNumber: 100,
      blockHash: encodeBytes32String("hash"),
      stakingModuleId: 1,
      signature: "0x" + "0".repeat(130),
      operatorIds: "operator1",
      vettedKeysByOperator: "keys",
      app: { version: "1.0", name: "AppName" },
    };
    const tx = await sdk.sendMessage("MessageUnvet", data);
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendUnvetMessage:", gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(34024);

    const [event] = await sdk.get("MessageUnvet");

    expect(event.data).to.deep.equal(data);
    expect(event.guardianAddress).to.deep.equal(await owner.getAddress());

    expect(event).to.deep.equal((await sdk.getAll())[0]);
  });

  it("should measure gas for sendPauseMessageV2", async function () {
    const data = {
      depositRoot: "0x" + "0".repeat(64),
      nonce: 1,
      blockNumber: 100,
      blockHash: encodeBytes32String("hash"),
      signature: "0x" + "0".repeat(130),
      stakingModuleId: 1,
      app: { version: "1.0", name: "AppName" },
    };
    const tx = await sdk.sendMessage("MessagePauseV2", data);
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
      signature: "0x" + "0".repeat(130),
      app: { version: "1.0", name: "AppName" },
    };
    const tx = await sdk.sendMessage("MessagePauseV3", data);
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
