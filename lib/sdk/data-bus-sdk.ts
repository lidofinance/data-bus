import { AbiCoder } from "ethers";
import { DataBus } from "typechain-types";
import { MessageType } from "./data-bus-dsm-types";
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

export const encoder = AbiCoder.defaultAbiCoder();

export async function sendMessage(
  dataBus: DataBus,
  encodingVersion: number,
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

  const tx = await dataBus.sendMessage(messageType, encodingVersion, dataBytes);
  await tx.wait();
  return tx;
}

export async function parseEvents(
  contract: DataBus,
  blockFrom = 0,
  blockTo: number | string = "latest"
): Promise<any[]> {
  const events = await contract.queryFilter(
    contract.filters.Message(),
    blockFrom,
    blockTo
  );
  const results: any[] = [];

  for (const event of events) {
    const { messageType, data } = event.args;
    let decodedData;

    switch (Number(messageType)) {
      case MessageType.Deposit:
        decodedData = encoder.decode([ABI_DEPOSIT_DATA], data);
        results.push({
          event: MessageType.Deposit,
          data: formatMessageDeposit(decodedData[0]),
        });
        break;
      case MessageType.PauseV2:
        decodedData = encoder.decode([ABI_PAUSE_V2_DATA], data);
        results.push({
          event: MessageType.PauseV2,
          data: formatMessagePauseV2(decodedData[0]),
        });
        break;
      case MessageType.PauseV3:
        decodedData = encoder.decode([ABI_PAUSE_V3_DATA], data);
        results.push({
          event: MessageType.PauseV3,
          data: formatMessagePauseV3(decodedData[0]),
        });
        break;
      case MessageType.Unvet:
        decodedData = encoder.decode([ABI_UNVET_DATA], data);
        results.push({
          event: MessageType.Unvet,
          data: formatMessageUnvet(decodedData[0]),
        });
        break;
      case MessageType.Ping:
        decodedData = encoder.decode([ABI_PING_DATA], data);
        results.push({
          event: MessageType.Ping,
          data: formatMessagePing(decodedData[0]),
        });
        break;
      default:
        console.error("Unknown MessageType:", Number(messageType));
    }
  }

  return results;
}
