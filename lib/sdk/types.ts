import {
  Abi,
  AbiParameterToPrimitiveType,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  ExtractAbiEvents,
  ParseAbi,
} from "abitype";

export type TypedKeysObject<
  abi extends Abi,
  index extends number,
  value extends unknown
> = {
  [k in ExtractAbiEvents<abi>["inputs"][index]["name"] extends string
    ? ExtractAbiEvents<abi>["inputs"][index]["name"]
    : never]: value;
};

export type TypedKeyObject<
  abi extends Abi,
  index extends number,
  event extends ExtractAbiEventNames<abi>,
  value extends unknown
> = {
  [k in ExtractAbiEvent<abi, event>["inputs"][index]["name"] extends string
    ? ExtractAbiEvent<abi, event>["inputs"][index]["name"]
    : never]: value;
};

export type EventsTypesResults<abi extends Abi> = TypedKeysObject<
  abi,
  0,
  AbiParameterToPrimitiveType<ExtractAbiEvents<abi>["inputs"][1]>
> &
  TypedKeysObject<abi, 0, string> & {
    txHash: string;
  };

export type Parse<signatures extends readonly string[]> = ParseAbi<signatures>;

export type EventNames<abi extends Abi> = ExtractAbiEventNames<abi>;

export type EventTypeResult<
  abi extends Abi,
  eventName extends ExtractAbiEventNames<abi>
> = TypedKeyObject<
  abi,
  1,
  eventName,
  AbiParameterToPrimitiveType<ExtractAbiEvent<abi, eventName>["inputs"][1]>
> &
  TypedKeyObject<abi, 0, eventName, string> & {
    txHash: string;
  };
