import { DataBus__factory } from "../typechain-types";

import { parseMonitoringConfig } from "../lib/config";
import { JsonRpcProvider } from "ethers";
import { parseEvents } from "../lib/sdk";

const MONITORING_BLOCK_OVERLAP = 200;

const generateRange = (
  x: number,
  deltaX: number = MONITORING_BLOCK_OVERLAP
): [number, number] => {
  const lowerBound = Math.max(0, x - deltaX);
  return [lowerBound, x];
};

async function main() {
  const envConfig = parseMonitoringConfig(process.env);
  console.log("Started with config:", envConfig);

  const provider = new JsonRpcProvider(envConfig.NODE_HOST);

  const alreadyIndexed: Record<string, boolean> = {};

  const contract = DataBus__factory.connect(
    envConfig.DATA_BUS_ADDRESS,
    provider
  );
  setInterval(async () => {
    const startBlock = await provider.getBlock("latest");
    const [startBlockNumber, envBlockNumber] = generateRange(
      startBlock!.number
    );

    console.log(
      "Block range has been processed:",
      startBlockNumber,
      envBlockNumber
    );

    const events = await parseEvents(
      contract,
      startBlockNumber,
      envBlockNumber
    );

    events.map((event) => {
      if (alreadyIndexed[event.idempotentKey]) return;
      alreadyIndexed[event.idempotentKey] = true;
      console.log(event);
    });
  }, 5000);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
