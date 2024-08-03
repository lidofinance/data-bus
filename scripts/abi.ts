import fs from "fs";

const artifactPath = "artifacts/contracts/DSMDataBus.sol/DSMDataBus.json";
const abiPath = "abi/DSMDataBus.json";

async function main() {
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  fs.mkdirSync('abi', { recursive: true });
  fs.writeFileSync(abiPath, JSON.stringify(artifact.abi));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
