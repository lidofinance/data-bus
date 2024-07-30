import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, parseEther } from "ethers";

import { DSMDataBus } from "../typechain-types";

describe("DataBus Contract", function () {
  let dataBus: DSMDataBus;
  let owner: Signer;
  let guardian1: Signer;
  let guardian2: Signer;
  let nonGuardian: Signer;

  beforeEach(async function () {
    const dataBusFactory = await ethers.getContractFactory("DSMDataBus");
    [owner, guardian1, guardian2, nonGuardian] = await ethers.getSigners();
    dataBus = await dataBusFactory.connect(owner).deploy([
      await guardian1.getAddress(),
      await guardian2.getAddress(),
    ]);
  });

  describe("Guardian management", function () {
    it("should allow the owner to add a new guardian", async function () {
      const newGuardianAddress = await nonGuardian.getAddress();
      await dataBus.connect(owner).addGuardian(newGuardianAddress);
      expect(
        await dataBus.hasRole(await dataBus.GUARDIAN_ROLE(), newGuardianAddress)
      ).to.be.true;
    });

    it("should prevent non-owners from adding guardians", async function () {
      const newGuardianAddress = await nonGuardian.getAddress();
      await expect(
        dataBus.connect(nonGuardian).addGuardian(newGuardianAddress)
      ).to.be.revertedWithOZAccessControlError(newGuardianAddress, await dataBus.GUARDIAN_ROLE());
    });

    it("should allow guardians to send status messages", async function () {
      await expect(
        dataBus.connect(guardian1).sendStatusMessage("System operational")
      )
        .to.emit(dataBus, "Status")
        .withArgs("System operational");
    });

    it("should prevent non-guardians from sending status messages", async function () {
      await expect(
        dataBus.connect(nonGuardian).sendStatusMessage("Hacking attempt")
      ).to.be.revertedWith("You are not a guardian");
    });
  });

  describe("Deposits and events", function () {
    it("should allow guardians to send deposit messages", async function () {
      await expect(
        dataBus
          .connect(guardian1)
          .sendDepositMessage({ value: parseEther("1") })
      )
        .to.emit(dataBus, "Deposit")
        .withArgs(await guardian1.getAddress(), parseEther("1"));
    });

    it("should prevent non-guardians from sending deposit messages", async function () {
      await expect(
        dataBus
          .connect(nonGuardian)
          .sendDepositMessage({ value: parseEther("1") })
      ).to.be.revertedWith("You are not a guardian");
    });
  });
});
