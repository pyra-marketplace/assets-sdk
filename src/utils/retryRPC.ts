import { ethers } from "ethers";
import { RPC } from "../data-token/configs";
import {
  CollectAction__factory,
  DataToken__factory,
  FeeCollectModule__factory
} from "../data-token/abi/typechain";

export const ContractFactory = {
  collectAction__factory: CollectAction__factory,
  dataToken__factory: DataToken__factory,
  feeCollectModule__factory: FeeCollectModule__factory
};

export async function retryRPC({
  chainId,
  contractFactory,
  assetContract,
  method,
  params
}: {
  chainId: number;
  contractFactory?: keyof typeof ContractFactory;
  assetContract?: string;
  method: any;
  params: any[];
}) {
  const rpcList = RPC[chainId as keyof typeof RPC];
  for (let i = 0; i < rpcList.length; i++) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpcList[i]);

      if (contractFactory && assetContract) {
        const instance = ContractFactory[contractFactory].connect(
          assetContract,
          provider
        );
        const res = await (instance as any)[method](...params);
        return res;
      } else {
        const res = (provider as any)[method](...params);
        return res;
      }
    } catch (e) {
      console.log(e);
    }
  }
  throw new Error("RPC error");
}
