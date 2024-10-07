import { formatUnits, parseUnits } from "ethers";
import { ethers } from "hardhat";

interface EnsureEtherBalanceConfig {
  etherAmount: bigint;
}

async function ensureEtherBalance(
  addresses: string[],
  config: EnsureEtherBalanceConfig
): Promise<void> {
  const [signer] = await ethers.getSigners();

  for (const address of addresses) {
    const initialBalance: bigint = await signer.provider!.getBalance(address);
    if (initialBalance < config.etherAmount) {
      const neededAmount: bigint = config.etherAmount - initialBalance;
      const tx = await signer.sendTransaction({
        to: address,
        value: neededAmount,
      });
      await tx.wait();
      console.log(
        `Transferred ${formatUnits(neededAmount, "ether")} ETH to ${address}`
      );

      const newBalance: bigint = await signer.provider!.getBalance(address);
      console.log(
        `New balance of ${address} is ${formatUnits(newBalance, "ether")} ETH`
      );
    } else {
      console.log(`Address ${address} has sufficient ETH balance.`);
    }
  }
}

const config: EnsureEtherBalanceConfig = {
  etherAmount: BigInt(parseUnits("20", "ether").toString()),
};

const run = async () => {
  const addresses = [
    "0x711b5fcfed5a30ca78e0cac321b060de9d6f8979",
    "0xdaae8c017f1e2a9bec6111d288f9ebb165e0e163",
    "0x31fa51343297ffce0cc1e67a50b2d3428057d1b1",
    "0x43464fe06c18848a2e2e913194d64c1970f4326a",
    "0x79a132be0c25ced09e745629d47cf05e531bb2bb",
    "0x0bf1b3d1e6f78b12f26204348abfca9310259ffa",
    "0xf060ab3d5dcfdc6a0dfd5ca0645ac569b8f105ca",
  ];

  await ensureEtherBalance(addresses, config);
};

run().catch(console.error);
