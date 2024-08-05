import { AbiCoder, Provider } from "ethers";
import { DataBus } from "typechain-types";
import {
  ABI_DEPOSIT_DATA,
  ABI_PAUSE_V2_DATA,
  ABI_PAUSE_V3_DATA,
  ABI_PING_DATA,
  ABI_UNVET_DATA,
  formatMessageDeposit,
  formatMessagePauseV2,
  formatMessagePauseV3,
  formatMessagePing,
  formatMessageUnvet,
} from "./data-bus-parser";
import { ENCODING_VERSION, EventIds, MessageType } from "./data-bus.constants";
import { encodeEventId } from "./event-id";

export const encoder = AbiCoder.defaultAbiCoder();

export async function sendMessage(
  dataBus: DataBus,
  message: { messageType: MessageType; data: any }
) {
  const { messageType, data } = message;
  let dataBytes;

  switch (messageType) {
    case MessageType.Deposit:
      dataBytes = encoder.encode([ABI_DEPOSIT_DATA], [data]);
      break;
    case MessageType.PauseV2:
      dataBytes = encoder.encode([ABI_PAUSE_V2_DATA], [data]);
      break;
    case MessageType.PauseV3:
      dataBytes = encoder.encode([ABI_PAUSE_V3_DATA], [data]);
      break;
    case MessageType.Unvet:
      dataBytes = encoder.encode([ABI_UNVET_DATA], [data]);
      break;
    case MessageType.Ping:
      dataBytes = encoder.encode([ABI_PING_DATA], [data]);
      break;
    default:
      throw new Error("Invalid message type");
  }

  const tx = await dataBus.sendMessage(
    encodeEventId(messageType, ENCODING_VERSION),
    dataBytes
  );
  await tx.wait();
  return tx;
}

export async function parseEvents(
  contract: DataBus,
  provider: Provider,
  blockFrom = 0,
  blockTo: number | string = "latest"
): Promise<any[]> {
  const filter = {
    address: await contract.getAddress(),
    topics: [Object.values(EventIds)],
    fromBlock: blockFrom,
    toBlock: blockTo,
  };

  if (!contract.runner) {
    throw new Error(`contract.runner is not provided`);
  }
  const logs = await provider.getLogs(filter);

  const results: any[] = [];

  for (const log of logs) {
    const data = encoder.decode(["bytes"], log.data)[0];
    if (!data) continue;
    const { topics } = log;
    const [eventId, encodedSnder] = topics;
    const sender = encoder.decode(["address"], encodedSnder)[0];
    let decodedData;
    // TODO: log index
    const idempotentKey = `${eventId}-${log.transactionHash}-${sender}`;
    switch (eventId) {
      case EventIds.Deposit:
        decodedData = encoder.decode([ABI_DEPOSIT_DATA], data);
        results.push({
          event: MessageType.Deposit,
          data: formatMessageDeposit(decodedData[0]),
          idempotentKey,
          sender,
        });
        break;
      case EventIds.PauseV2:
        decodedData = encoder.decode([ABI_PAUSE_V2_DATA], data);
        results.push({
          event: MessageType.PauseV2,
          data: formatMessagePauseV2(decodedData[0]),
          idempotentKey,
          sender,
        });
        break;
      case EventIds.PauseV3:
        decodedData = encoder.decode([ABI_PAUSE_V3_DATA], data);
        results.push({
          event: MessageType.PauseV3,
          data: formatMessagePauseV3(decodedData[0]),
          idempotentKey,
          sender,
        });
        break;
      case EventIds.Unvet:
        decodedData = encoder.decode([ABI_UNVET_DATA], data);
        results.push({
          event: MessageType.Unvet,
          data: formatMessageUnvet(decodedData[0]),
          idempotentKey,
          sender,
        });
        break;
      case EventIds.Ping:
        decodedData = encoder.decode([ABI_PING_DATA], data);
        results.push({
          event: MessageType.Ping,
          data: formatMessagePing(decodedData[0]),
          idempotentKey,
          sender,
        });
        break;
      default:
        console.error("Unknown MessageType:", eventId);
    }
  }

  return results;
}
