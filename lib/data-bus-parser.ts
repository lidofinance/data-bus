import {
  AppMetaData,
  DepositData,
  PauseV2Data,
  PauseV3Data,
  PingData,
  UnvetData,
} from "./data-bus-dsm-types";

const formatAppMeta = (data: any[]): AppMetaData => {
  const [version, name] = data;
  return {
    version,
    name,
  };
};

export const ABI_DEPOSIT_DATA =
  "tuple(int256 guardianIndex, bytes32 depositRoot, uint256 nonce, uint256 blockNumber, bytes32 blockHash, bytes signature, uint256 stakingModuleId, tuple(string version, string name) app)";

export const formatMessageDeposit = (data: any[]): DepositData => {
  const [
    guardianIndex,
    depositRoot,
    nonce,
    blockNumber,
    blockHash,
    signature,
    stakingModuleId,
    app,
  ] = data;

  return {
    guardianIndex,
    depositRoot,
    nonce,
    blockNumber,
    blockHash,
    signature,
    stakingModuleId,
    app: formatAppMeta(app),
  };
};

export const ABI_PING_DATA =
  "tuple(uint256 blockNumber, int256 guardianIndex, uint256[] stakingModuleIds, tuple(string version, string name) app)";

export const formatMessagePing = (data: any[]): PingData => {
  const [blockNumber, guardianIndex, stakingModuleIds, app] = data;

  return {
    app: formatAppMeta(app),
    blockNumber,
    guardianIndex,
    stakingModuleIds,
  };
};

export const ABI_PAUSE_V2_DATA =
  "tuple(int256 guardianIndex, bytes32 depositRoot, uint256 nonce, uint256 blockNumber, bytes32 blockHash, bytes signature, uint256 stakingModuleId, tuple(string version, string name) app)";

export const formatMessagePauseV2 = (data: any[]): PauseV2Data => {
  const [
    guardianIndex,
    depositRoot,
    nonce,
    blockNumber,
    blockHash,
    signature,
    stakingModuleId,
    app,
  ] = data;

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

export const ABI_PAUSE_V3_DATA =
  "tuple(int256 guardianIndex, uint256 blockNumber, bytes signature, tuple(string version, string name) app)";

export const formatMessagePauseV3 = (data: any[]): PauseV3Data => {
  const [guardianIndex, blockNumber, signature, app] = data;

  return {
    guardianIndex,
    blockNumber,
    signature,
    app: formatAppMeta(app),
  };
};

export const ABI_UNVET_DATA =
  "tuple(int256 guardianIndex, uint256 nonce, uint256 blockNumber, bytes32 blockHash, uint256 stakingModuleId, bytes signature, string operatorIds, string vettedKeysByOperator, tuple(string version, string name) app)";

export const formatMessageUnvet = (data: any[]): UnvetData => {
  const [
    guardianIndex,
    nonce,
    blockNumber,
    blockHash,
    stakingModuleId,
    signature,
    operatorIds,
    vettedKeysByOperator,
    app,
  ] = data;

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
