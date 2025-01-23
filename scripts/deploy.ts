import { writeFile } from "node:fs/promises";
import { deploy } from "./lib/deploy";
import { sendTestTx } from "./lib/test-tx";
import path from "node:path";
import { network } from "hardhat";

async function main() {
  const contract = await deploy();

  const address = await contract.getAddress();

  // await sendTestTx(address);

  await writeFile(
    path.join("deployed", `${network.name}.json`),
    JSON.stringify({ contract: { address } }),
    "utf8"
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
