import { ParseAbi } from "abitype";
import { Contract, EventFragment, Interface, Provider, Signer } from "ethers";
import { EventNames, EventsTypesResults, EventTypeResult } from "./types";

export interface SDKParams {
  dataBusAddress: string;
  eventsAbi: string[];
  signer: Signer;
}

export class DataBusSDK<signatures extends readonly string[]> {
  private dataBusAddress: string;
  private eventsInterface: Interface;
  private provider: Provider;
  private eventsFragments: EventFragment[] = [];
  private dataBus: Contract;

  constructor(dataBusAddress: string, eventsAbi: signatures, signer: Signer) {
    this.dataBusAddress = dataBusAddress;
    this.eventsInterface = new Interface(eventsAbi);
    if (!signer.provider) {
      throw new Error("Signer with provider is required");
    }
    this.provider = signer.provider;
    this.eventsInterface.forEachEvent((event) => {
      this.eventsFragments.push(event);
    });
    this.dataBus = new Contract(
      dataBusAddress,
      ["function sendMessage(bytes32 _eventId, bytes _data)"],
      signer
    );
  }

  async sendMessage(eventName: EventNames<ParseAbi<signatures>>, data: any) {
    const event = this.eventsFragments.find((ev) => ev.name === eventName);
    if (!event) {
      throw new Error(`event with name "${eventName}" not found`);
    }
    const coder = this.eventsInterface.getAbiCoder();
    const dataBytes = coder.encode([event.inputs[1].format("full")], [data]);
    const tx = await this.dataBus.sendMessage(event.topicHash, dataBytes);
    await tx.wait();
    return tx;
  }

  async get<Name extends EventNames<ParseAbi<signatures>>>(
    eventName: Name,
    blockFrom = 0,
    blockTo: number | string = "latest"
  ): Promise<EventTypeResult<ParseAbi<signatures>, Name>[]> {
    const event = this.eventsFragments.find((ev) => ev.name === eventName);
    if (!event) {
      throw new Error(`event with name "${eventName}" not found`);
    }

    return this.getByTopics([event.topicHash], blockFrom, blockTo) as unknown as Promise<EventTypeResult<ParseAbi<signatures>, Name>[]>;
  }

  async getAll(blockFrom = 0, blockTo: number | string = "latest"): Promise<EventsTypesResults<ParseAbi<signatures>>[]> {
    return this.getByTopics(
        this.eventsFragments.map(({ topicHash }) => topicHash),
        blockFrom,
        blockTo
    ) as unknown as Promise<EventsTypesResults<ParseAbi<signatures>>[]>;
  }

  private async getByTopics(
    topics: string[],
    blockFrom: number,
    blockTo: number | string
  ) {
    const filter = {
      address: this.dataBusAddress,
      topics: [topics],
      fromBlock: blockFrom,
      toBlock: blockTo,
    };
    const result = [];
    const logs = await this.provider.getLogs(filter);
    for (const log of logs) {
      const data = this.eventsInterface.parseLog({
        ...log,
        data: this.eventsInterface.getAbiCoder().decode(["bytes"], log.data)[0],
      });
      if (!data) continue;

      result.push({ ...data.args.toObject(true), name: data.name, txHash: log.transactionHash });
    }

    return result;
  }
}
