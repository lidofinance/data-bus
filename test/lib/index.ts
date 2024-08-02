import {
  ContractTransactionReceipt,
  ContractTransactionResponse,
} from "ethers";

export const getReceipt = async (
  tx: ContractTransactionResponse
): Promise<ContractTransactionReceipt> => {
  const receipt = await tx.wait();
  if (!receipt) {
    throw new Error(`tx ${tx.from} ${tx.to} receipt not found`);
  }

  return receipt;
};
