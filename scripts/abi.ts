import fs from "fs";

const artifactPath = "artifacts/contracts/DataBus.sol/DataBus.json";
const abiPath = "abi/DataBus.json";

async function main() {
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  fs.mkdirSync('abi', { recursive: true });
  fs.writeFileSync(abiPath, JSON.stringify(artifact.abi));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
