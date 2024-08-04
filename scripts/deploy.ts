import { deploy } from "./lib/deploy";

async function main() {
  await deploy();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
