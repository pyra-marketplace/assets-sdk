import { ethers, Wallet } from "ethers";

export async function getSigByWallet(
  wallet: Wallet,
  msgParams: {
    domain: any;
    types: any;
    value: any;
  },
): Promise<{ v: number; r: string; s: string }> {
  const sig = await wallet._signTypedData(
    msgParams.domain,
    msgParams.types,
    msgParams.value,
  );
  return ethers.utils.splitSignature(sig);
}
