import { Interface } from "ethers";
import fs from "fs";

async function prepare(artifactPath: string, abiPath: string) {
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

  fs.mkdirSync("abi", { recursive: true });
  fs.writeFileSync(abiPath + ".json", JSON.stringify(artifact.abi));
  const iface = new Interface(artifact.abi);
  fs.writeFileSync(abiPath + ".human.json", JSON.stringify(iface.format(false)));
}

async function main() {
  await prepare("artifacts/contracts/DataBus.sol/DataBus.json", "abi/DataBus");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
