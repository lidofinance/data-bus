import { parseContractEnvConfig } from "../lib/config";
import { deploy } from "./lib/deploy";
import { runLocalNode } from "./lib/local-node";
import { runProcess } from "./lib/run-process";
import { spammer } from "./lib/spammer";
import { sleep } from "./lib/utils";

const envConfig = parseContractEnvConfig(process.env);

async function main() {
  runLocalNode().catch(console.error);
  await sleep(1000);

  const contract = await deploy();
  const dataBusAddress = await contract.getAddress();

  spammer(dataBusAddress, envConfig.NODE_HOST).catch(console.error);

  await runProcess("npx", ["ts-node", "monitoring/index.ts"], {
    DATA_BUS_ADDRESS: dataBusAddress,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
