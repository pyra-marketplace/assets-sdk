import { LIT_CHAINS } from "@lit-protocol/constants";

export function getChainNameFromChainId(chainId: number): string {
  if (chainId === 314) {
    return "filecoin";
  }
  if (chainId === 8453) {
    return "base";
  }
  if (chainId === 84532) {
    return "base sepolia";
  }

  for (let i = 0; i < Object.keys(LIT_CHAINS).length; i++) {
    const chainName = Object.keys(LIT_CHAINS)[i];
    const litChainId = LIT_CHAINS[chainName].chainId;
    if (litChainId === chainId) {
      return chainName;
    }
  }

  throw new Error(`cannot parse chainId ${chainId} for lit protocol`);
}

export function getChainIdFromChainName(chainName: string): number {
  if (chainName === "filecoin") {
    return 314;
  }
  if (chainName === "base") {
    return 8453;
  }
  if (chainName === "base sepolia") {
    return 84532;
  }

  for (let i = 0; i < Object.keys(LIT_CHAINS).length; i++) {
    const litChainName = Object.keys(LIT_CHAINS)[i];
    if (litChainName === chainName) {
      return LIT_CHAINS[chainName].chainId;
    }
  }

  throw new Error(`cannot parse chainName ${chainName} for lit protocol`);
}
