import { parseMonitoringConfig } from "../lib/config";
import { JsonRpcProvider, Wallet } from "ethers";
import { DataBusClient } from "../client";

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
  const sdk = new DataBusClient(
    envConfig.DATA_BUS_ADDRESS,
    [
      "event MessageDeposit(address indexed guardianAddress, (bytes32 depositRoot, uint256 nonce, uint256 blockNumber, bytes32 blockHash, bytes signature, uint256 stakingModuleId, (string version) app) data)",
      "event MessagePauseV2(address indexed guardianAddress, (bytes32 depositRoot, uint256 nonce, uint256 blockNumber, bytes32 blockHash, bytes signature, uint256 stakingModuleId, (string version) app) data)",
      "event MessagePauseV3(address indexed guardianAddress, (uint256 blockNumber, bytes signature, (string version) app) data)",
      "event MessagePing(address indexed guardianAddress, (uint256 blockNumber, uint256[] stakingModuleIds, (string version) app) data)",
      "event MessageUnvet(address indexed guardianAddress, (uint256 nonce, uint256 blockNumber, bytes32 blockHash, uint256 stakingModuleId, bytes signature, string operatorIds, string vettedKeysByOperator, (string version) app) data)",
    ] as const,
    new Wallet(
      "0x0000000000000000000000000000000000000000000000000000000000000001",
      provider
    )
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

    const events = await sdk.getAll(startBlockNumber, envBlockNumber);

    events.map((event) => {
      if (alreadyIndexed[event.txHash]) return;
      alreadyIndexed[event.txHash] = true;
      console.log(event);
    });
  }, 5000);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
