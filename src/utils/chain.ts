import { LIT_CHAINS } from "@lit-protocol/constants";
import { Chain, ChainId } from "../data-token";

export const getChainByChainId = (chainId: ChainId | number): Chain => {
  switch (chainId) {
    case ChainId.BSCTestnet: {
      return "BSCTestnet";
    }
    case ChainId.PolygonMumbai: {
      return "PolygonMumbai";
    }
    case ChainId.ScrollSepolia: {
      return "ScrollSepolia";
    }
    default:
      throw new Error("Unsupported Network");
  }
};

export function getChainNameFromChainId(chainId: number): string {
  for (let i = 0; i < Object.keys(LIT_CHAINS).length; i++) {
    const chainName = Object.keys(LIT_CHAINS)[i];
    const litChainId = LIT_CHAINS[chainName].chainId;
    if (litChainId === chainId) {
      return chainName;
    }
  }
  if (chainId === 314) {
    return "filecoin";
  }
  throw new Error(`cannot parse chainId ${chainId} for lit protocol`);
}
