import { encodeEventId } from "./event-id";

export enum MessageType {
  Deposit = "Deposit",
  PauseV2 = "PauseV2",
  PauseV3 = "PauseV3",
  Unvet = "Unvet",
  Ping = "Ping",
}

export const ENCODING_VERSION = 1;

export const EventIds = {
  Deposit: encodeEventId(MessageType.Deposit, ENCODING_VERSION),
  PauseV2: encodeEventId(MessageType.PauseV2, ENCODING_VERSION),
  PauseV3: encodeEventId(MessageType.PauseV3, ENCODING_VERSION),
  Unvet: encodeEventId(MessageType.Unvet, ENCODING_VERSION),
  Ping: encodeEventId(MessageType.Ping, ENCODING_VERSION),
};
