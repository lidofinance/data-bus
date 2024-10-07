import { deploy } from "./lib/deploy";
import { sendTestTx } from "./lib/test-tx";

async function main() {
  const contract = await deploy();

  await sendTestTx(await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
