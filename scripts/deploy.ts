import { writeFile, mkdir } from "node:fs/promises";
import { deploy } from "./lib/deploy";
import { sendTestTx } from "./lib/test-tx";
import path from "node:path";
import { network } from "hardhat";

async function main() {
  const contract = await deploy();

  const address = await contract.getAddress();

  // await sendTestTx(address);

  const deployedPath = path.join("deployed", `${network.name}.json`);

  await mkdir("deployed", { recursive: true });
  await writeFile(
    deployedPath,
    JSON.stringify({ contract: { address } }),
    "utf8",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
