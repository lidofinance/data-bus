import {
  MessageDepositEvent,
  MessagePingEvent,
  MessagePauseV2Event,
  MessagePauseV3Event,
  MessageUnvetEvent,
  DSMDataBus,
} from "../typechain-types/contracts/DSMDataBus";

export const allEvents = [
  "MessageDeposit",
  "MessagePing",
  "MessagePauseV2",
  "MessagePauseV3",
  "MessageUnvet",
] as const;

const formatAppMeta = (
  data: DSMDataBus.AppMetaDataStructOutput
): DSMDataBus.AppMetaDataStruct => {
  return {
    name: data.name,
    version: data.version,
  };
};

export const formatMessageDeposit = (
  event: MessageDepositEvent.OutputObject
): DSMDataBus.DepositDataStruct => {
  const {
    app,
    guardianIndex,
    depositRoot,
    nonce,
    blockNumber,
    blockHash,
    signature,
    stakingModuleId,
  } = event.data;

  return {
    app: formatAppMeta(app),
    guardianIndex,
    depositRoot,
    nonce,
    blockNumber,
    blockHash,
    signature,
    stakingModuleId,
  };
};

export const formatMessagePing = (
  event: MessagePingEvent.OutputObject
): DSMDataBus.PingDataStruct => {
  const { app, guardianIndex, blockNumber, stakingModuleIds } = event.data;

  return {
    app: formatAppMeta(app),
    guardianIndex,
    blockNumber,
    stakingModuleIds,
  };
};

export const formatMessagePauseV2 = (
  event: MessagePauseV2Event.OutputObject
): DSMDataBus.PauseV2DataStruct => {
  const {
    app,
    guardianIndex,
    depositRoot,
    nonce,
    blockNumber,
    blockHash,
    signature,
    stakingModuleId,
  } = event.data;

  return {
    app: formatAppMeta(app),
    guardianIndex,
    depositRoot,
    nonce,
    blockNumber,
    blockHash,
    signature,
    stakingModuleId,
  };
};
export const formatMessagePauseV3 = (
  event: MessagePauseV3Event.OutputObject
): DSMDataBus.PauseV3DataStruct => {
  const { app, guardianIndex, blockNumber, signature } = event.data;

  return {
    app: formatAppMeta(app),
    guardianIndex,
    blockNumber,
    signature,
  };
};

export const formatMessageUnvet = (
  event: MessageUnvetEvent.OutputObject
): DSMDataBus.UnvetDataStruct => {
  const {
    app,
    guardianIndex,
    nonce,
    blockNumber,
    blockHash,
    signature,
    stakingModuleId,
    operatorIds,
    vettedKeysByOperator,
  } = event.data;

  return {
    app: formatAppMeta(app),
    guardianIndex,
    nonce,
    blockNumber,
    blockHash,
    signature,
    stakingModuleId,
    operatorIds,
    vettedKeysByOperator,
  };
};

export const formatters = {
  MessageDeposit: formatMessageDeposit,
  MessagePing: formatMessagePing,
  MessagePauseV2: formatMessagePauseV2,
  MessagePauseV3: formatMessagePauseV3,
  MessageUnvet: formatMessageUnvet,
};
