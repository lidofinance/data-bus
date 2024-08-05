export interface AppMetaData {
  version: string;
  name: string;
}

export interface DepositData {
  depositRoot: string;
  nonce: number;
  blockNumber: number;
  blockHash: string;
  signature: string;
  stakingModuleId: number;
  app: AppMetaData;
}

export interface PauseV2Data {
  depositRoot: string;
  nonce: number;
  blockNumber: number;
  blockHash: string;
  signature: string;
  stakingModuleId: number;
  app: AppMetaData;
}

export interface PauseV3Data {
  blockNumber: number;
  signature: string;
  app: AppMetaData;
}

export interface UnvetData {
  nonce: number;
  blockNumber: number;
  blockHash: string;
  stakingModuleId: number;
  signature: string;
  operatorIds: string;
  vettedKeysByOperator: string;
  app: AppMetaData;
}

export interface PingData {
  blockNumber: number;

  stakingModuleIds: number[];
  app: AppMetaData;
}
