import { expect } from "chai";
import { ethers } from "hardhat";
import { encodeBytes32String, Signer } from "ethers";
import { DataBus, DataBus__factory } from "typechain-types";
import { getReceipt } from "./lib";
import { parseEvents, sendMessage } from "../lib/data-bus-sdk";
import { MessageType } from "../lib/data-bus-dsm-types";

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
      guardianIndex: 1n,
      stakingModuleIds: [1n, 2n],
      app: { version: "1.0", name: "AppName" },
    };

    const tx = await sendMessage(dataBus, 1, {
      messageType: MessageType.Ping,
      data,
    });

    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendPingMessage:", receipt.gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(33445);

    const eventData = (await parseEvents(dataBus))[0].data;
    expect(eventData).to.deep.equal(data);
  });

  it("should measure gas for sendDepositMessage", async function () {
    const data = {
      guardianIndex: 1,
      depositRoot: "0x" + "0".repeat(64),
      nonce: 1,
      blockNumber: 100,
      blockHash: encodeBytes32String("hash"),
      signature: "0x" + "0".repeat(130),
      stakingModuleId: 1,
      app: { version: "1.0", name: "AppName" },
    };
    const tx = await sendMessage(dataBus, 1, {
      messageType: MessageType.Deposit,
      data,
    });
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendDepositMessage:", gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(36775);

    const eventData = (await parseEvents(dataBus))[0].data;
    expect(eventData).to.deep.equal(data);
  });

  it("should measure gas for sendUnvetMessage", async function () {
    const data = {
      guardianIndex: 1,
      nonce: 1,
      blockNumber: 100,
      blockHash: encodeBytes32String("hash"),
      stakingModuleId: 1,
      signature: "0x" + "0".repeat(130),
      operatorIds: "operator1",
      vettedKeysByOperator: "keys",
      app: { version: "1.0", name: "AppName" },
    };
    const tx = await sendMessage(dataBus, 1, {
      messageType: MessageType.Unvet,
      data,
    });
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendUnvetMessage:", gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(40039);

    const eventData = (await parseEvents(dataBus))[0].data;
    expect(eventData).to.deep.equal(data);
  });

  it("should measure gas for sendPauseMessageV2", async function () {
    const data = {
      guardianIndex: 1,
      depositRoot: "0x" + "0".repeat(64),
      nonce: 1,
      blockNumber: 100,
      blockHash: encodeBytes32String("hash"),
      signature: "0x" + "0".repeat(130),
      stakingModuleId: 1,
      app: { version: "1.0", name: "AppName" },
    };
    const tx = await sendMessage(dataBus, 1, {
      messageType: MessageType.PauseV2,
      data,
    });
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendPauseMessageV2:", gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(36763);

    const eventData = (await parseEvents(dataBus))[0].data;
    expect(eventData).to.deep.equal(data);
  });

  it("should measure gas for sendPauseMessageV3", async function () {
    const data = {
      guardianIndex: 1,
      blockNumber: 100,
      signature: "0x" + "0".repeat(130),
      app: { version: "1.0", name: "AppName" },
    };
    const tx = await sendMessage(dataBus, 1, {
      messageType: MessageType.PauseV3,
      data,
    });
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendPauseMessageV3:", gasUsed.toString());

    expect(gasUsed).to.be.lessThanOrEqual(33798);

    const eventData = (await parseEvents(dataBus))[0].data;
    expect(eventData).to.deep.equal(data);
  });
});
