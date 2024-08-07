import {
  Abi,
  AbiParameter,
  AbiParameterKind,
  AbiParametersToPrimitiveTypes,
  AbiParameterToPrimitiveType,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  ExtractAbiEvents,
  ParseAbi,
} from "abitype";

export type EventsTypesResults<abi extends Abi> = {
  data: AbiParameterToPrimitiveType<ExtractAbiEvents<abi>["inputs"][1]>;
} & {
  [k in ExtractAbiEvents<abi>["inputs"][0]["name"] extends string
    ? ExtractAbiEvents<abi>["inputs"][0]["name"]
    : never]: string;
} & {
  txHash: string;
};

export type Parse<signatures extends readonly string[]> = ParseAbi<signatures>;

export type EventNames<abi extends Abi> = ExtractAbiEventNames<abi>;

export type EventTypeResult<
  abi extends Abi,
  eventName extends ExtractAbiEventNames<abi>
> = {
  data: AbiParameterToPrimitiveType<
    ExtractAbiEvent<abi, eventName>["inputs"][1]
  >;
} & {
  [k in ExtractAbiEvents<abi>["inputs"][0]["name"] extends string
    ? ExtractAbiEvents<abi>["inputs"][0]["name"]
    : never]: string;
} & {
  txHash: string;
};
