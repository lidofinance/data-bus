import { DSMDataBus__factory } from "../typechain-types";

import { parseMonitoringConfig } from "../lib/config";
import { JsonRpcProvider } from "ethers";
import { allEvents, formatters } from "./event-parser";

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
  const provider = new JsonRpcProvider(envConfig.NODE_HOST);

  const alreadyIndexed: Record<string, boolean> = {};

  const contract = DSMDataBus__factory.connect(
    envConfig.DATA_BUS_ADDRESS,
    provider
  );
  setInterval(async () => {
    const startBlock = await provider.getBlock("latest");
    const [startBlockNumber, envBlockNumber] = generateRange(
      startBlock!.number
    );

    console.log("Block range has been processed:", startBlockNumber, envBlockNumber);

    // TODO: rewrite to getLogs with multi topics (decrease requests to eth node)
    const events = (
      await Promise.all(
        allEvents.map(async (filterName) => {
          const filter = contract.filters[filterName]();
          const rawEvents = await contract.queryFilter(
            filter,
            startBlockNumber,
            envBlockNumber
          );
          const formatter = formatters[filterName];
          const events = rawEvents.map((ev) => {
            // TODO: check logIndex (it can be error in typechain or ethers6 have different api)
            const { index, transactionHash, transactionIndex } = ev;
            const formattedData = formatter(ev.args as any);
            const idempotentKey = `${filterName}-${transactionHash}-${formattedData.guardianIndex}`;

            if (alreadyIndexed[idempotentKey]) return;
            alreadyIndexed[idempotentKey] = true;

            return {
              ...formattedData,
              index,
              transactionHash,
              transactionIndex,
              idempotentKey,
              type: filterName,
            };
          });
          return events;
        })
      )
    ).flat().filter(d => !!d);

    if (!events.length) return;

    console.log(events);
  }, 5000);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
