import { AbiCoder, keccak256 } from "ethers";

export const encoder = AbiCoder.defaultAbiCoder();

export const ABI_EVENT_ID = "tuple(string name, uint16 version)";

export const encodeEventId = (name: string, version: number) => {
  return keccak256(encoder.encode([ABI_EVENT_ID], [{name, version}]));
};

// export const decodeEventId = (eventId: string) => {
//   return encoder.decode([ABI_EVENT_ID], eventId);
// };
