import { expect } from "chai";
import { ethers } from "hardhat";
import { encodeBytes32String, Provider, Signer } from "ethers";
import { DataBus, DataBus__factory } from "typechain-types";
import { getReceipt } from "./lib";
import { parseEvents, sendMessage, MessageType } from "../lib/sdk";

describe("DataBus", function () {
  let DataBus: DataBus__factory;
  let dataBus: DataBus;
  let owner: Signer;

  beforeEach(async function () {
    DataBus = await ethers.getContractFactory("DataBus");
    [owner] = await ethers.getSigners();
    dataBus = await DataBus.connect(owner).deploy();
  });

  it("should measure gas for sendPingMessage", async function () {
    const data = {
      blockNumber: 100n,
      stakingModuleIds: [1n, 2n],
      app: { version: "1.0", name: "AppName" },
    };

    const tx = await sendMessage(dataBus, {
      messageType: MessageType.Ping,
      data,
    });

    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendPingMessage:", receipt.gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(29847);

    const event = (await parseEvents(dataBus, owner.provider as Provider))[0];
    expect(event.data).to.deep.equal(data);
    expect(event.sender).to.deep.equal(await owner.getAddress());
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
    const tx = await sendMessage(dataBus, {
      messageType: MessageType.Deposit,
      data,
    });
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendDepositMessage:", gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(31858);

    const event = (await parseEvents(dataBus, owner.provider as Provider))[0];
    expect(event.data).to.deep.equal(data);
    expect(event.sender).to.deep.equal(await owner.getAddress());
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
    const tx = await sendMessage(dataBus, {
      messageType: MessageType.Unvet,
      data,
    });
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendUnvetMessage:", gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(34024);

    const event = (await parseEvents(dataBus, owner.provider as Provider))[0];
    expect(event.data).to.deep.equal(data);
    expect(event.sender).to.deep.equal(await owner.getAddress());
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
    const tx = await sendMessage(dataBus, {
      messageType: MessageType.PauseV2,
      data,
    });
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendPauseMessageV2:", gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(31858);

    const event = (await parseEvents(dataBus, owner.provider as Provider))[0];
    expect(event.data).to.deep.equal(data);
    expect(event.sender).to.deep.equal(await owner.getAddress());
  });

  it("should measure gas for sendPauseMessageV3", async function () {
    const data = {
      blockNumber: 100,
      signature: "0x" + "0".repeat(130),
      app: { version: "1.0", name: "AppName" },
    };
    const tx = await sendMessage(dataBus, {
      messageType: MessageType.PauseV3,
      data,
    });
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendPauseMessageV3:", gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(30213);

    const event = (await parseEvents(dataBus, owner.provider as Provider))[0];
    expect(event.data).to.deep.equal(data);
    expect(event.sender).to.deep.equal(await owner.getAddress());
  });
});
