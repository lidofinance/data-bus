import { expect } from "chai";
import { ethers } from "hardhat";
import { encodeBytes32String } from "ethers";
import { DSMDataBus, DSMDataBus__factory } from "typechain-types";
import { getReceipt } from "./lib";

describe("DSMDataBus", function () {
  let DSMDataBus: DSMDataBus__factory;
  let dataBus: DSMDataBus;
  let owner: any;

  beforeEach(async function () {
    DSMDataBus = await ethers.getContractFactory("DSMDataBus");
    [owner] = await ethers.getSigners();
    dataBus = await DSMDataBus.connect(owner).deploy();
  });

  it("should measure gas for sendPingMessage", async function () {
    const appMeta = { version: "1.0", name: "AppName" };
    const tx = await dataBus.sendPingMessage(appMeta);
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendPingMessage:", receipt.gasUsed.toString());

    expect(gasUsed).to.be.equal(27588);
  });

  it("should measure gas for sendDepositMessage", async function () {
    const depositData = {
      guardianIndex: 1,
      depositRoot: "0x" + "0".repeat(64),
      nonce: 1,
      blockNumber: 100,
      blockHash: encodeBytes32String("hash"),
      signature: "0x" + "0".repeat(130),
      stakingModuleId: 1,
      appMeta: { version: "1.0", name: "AppName" },
    };
    const tx = await dataBus.sendDepositMessage(depositData);
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendDepositMessage:", gasUsed.toString());

    expect(gasUsed).to.be.equal(34767);
  });

  it("should measure gas for sendUnvetMessage", async function () {
    const unvetData = {
      guardianIndex: 1,
      nonce: 1,
      blockNumber: 100,
      blockHash: encodeBytes32String("hash"),
      stakingModuleId: 1,
      signature: "0x" + "0".repeat(130),
      operatorIds: "operator1",
      vettedKeysByOperator: "keys",
      appMeta: { version: "1.0", name: "AppName" },
    };
    const tx = await dataBus.sendUnvetMessage(unvetData);
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendUnvetMessage:", gasUsed.toString());

    expect(gasUsed).to.be.equal(38052);
  });

  it("should measure gas for sendPauseMessageV2", async function () {
    const pauseV2Data = {
      guardianIndex: 1,
      depositRoot: "0x" + "0".repeat(64),
      nonce: 1,
      blockNumber: 100,
      blockHash: encodeBytes32String("hash"),
      signature: "0x" + "0".repeat(130),
      stakingModuleId: 1,
      appMeta: { version: "1.0", name: "AppName" },
    };
    const tx = await dataBus.sendPauseMessageV2(pauseV2Data);
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendPauseMessageV2:", gasUsed.toString());

    expect(gasUsed).to.be.equal(34777);
  });

  it("should measure gas for sendPauseMessageV3", async function () {
    const pauseV3Data = {
      guardianIndex: 1,
      blockNumber: 100,
      signature: "0x" + "0".repeat(130),
      appMeta: { version: "1.0", name: "AppName" },
    };
    const tx = await dataBus.sendPauseMessageV3(pauseV3Data);
    const receipt = await getReceipt(tx);
    const { gasUsed } = receipt;

    console.log("Gas used for sendPauseMessageV3:", gasUsed.toString());

    expect(gasUsed).to.be.equal(31811);
  });
});
