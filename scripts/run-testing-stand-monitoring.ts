import { deploy } from "./lib/deploy";
import { runLocalNode } from "./lib/local-node";
import { runProcess } from "./lib/run-process";
import { sleep } from "./lib/utils";

async function main() {
  runLocalNode().catch(console.error);
  await sleep(1000);

  const contract = await deploy();
  const dataBusAddress = await contract.getAddress();

  await runProcess("npx", ["ts-node", "monitoring/index.ts"], {
    DATA_BUS_ADDRESS: dataBusAddress,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
