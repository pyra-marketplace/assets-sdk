import Moralis from "moralis";
import { ChainId } from "../types";
import APIJson from "../api.json";

export const getBlockNumberByTimestamp = async ({
  chainId,
  timestamp
}: {
  chainId: ChainId;
  timestamp: number;
}) => {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({
      apiKey: APIJson.Moralis
    });
  }

  const response = await Moralis.EvmApi.block.getDateToBlock({
    chain: chainId,
    date: new Date(timestamp * 1000).toISOString()
  });

  return response.raw.block;
};

export const getTimestampByBlockNumber = async ({
  chainId,
  blockNumber
}: {
  chainId: ChainId;
  blockNumber: number;
}) => {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({
      apiKey: APIJson.Moralis
    });
  }

  const response = await Moralis.EvmApi.block.getBlock({
    chain: chainId,
    blockNumberOrHash: blockNumber.toString()
  });

  if (response) {
    return Date.parse(response.raw.timestamp) / 1000;
  } else {
    throw new Error("get block response null");
  }
};
