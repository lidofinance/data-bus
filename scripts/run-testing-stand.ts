import { deploy } from "./lib/deploy";
import { runLocalNode } from "./lib/local-node";
import { runProcess } from "./lib/run-process";

async function main() {
  runLocalNode().catch(console.error);
  await new Promise((res) => setTimeout(res, 1000));

  const contract = await deploy();

  await runProcess("npx", ["ts-node", "monitoring/index.ts"], {
    DATA_BUS_ADDRESS: await contract.getAddress(),
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
