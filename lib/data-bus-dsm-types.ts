export interface AppMetaData {
  version: string;
  name: string;
}

export interface DepositData {
  guardianIndex: number;
  depositRoot: string;
  nonce: number;
  blockNumber: number;
  blockHash: string;
  signature: string;
  stakingModuleId: number;
  app: AppMetaData;
}

export interface PauseV2Data {
  guardianIndex: number;
  depositRoot: string;
  nonce: number;
  blockNumber: number;
  blockHash: string;
  signature: string;
  stakingModuleId: number;
  app: AppMetaData;
}

export interface PauseV3Data {
  guardianIndex: number;
  blockNumber: number;
  signature: string;
  app: AppMetaData;
}

export interface UnvetData {
  guardianIndex: number;
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
  guardianIndex: number;
  stakingModuleIds: number[];
  app: AppMetaData;
}

export enum MessageType {
    Deposit = 1,
    PauseV2 = 2,
    PauseV3 = 3,
    Unvet = 4,
    Ping = 5,
  }
