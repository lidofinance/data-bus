import { parseContractEnvConfig, parseMonitoringConfig } from "./../lib/config";
import { runProcess } from "./lib/run-process";
import { spammer } from "./lib/spammer";
import { sleep } from "./lib/utils";
const envConfig = parseMonitoringConfig(process.env);

async function main() {
  await sleep(1000);
  spammer(envConfig.DATA_BUS_ADDRESS).catch(console.error);

  await runProcess("npx", ["ts-node", "monitoring/index.ts"], {
    DATA_BUS_ADDRESS: envConfig.DATA_BUS_ADDRESS,
    NODE_HOST: "https://gnosis-chiado-rpc.publicnode.com"
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
