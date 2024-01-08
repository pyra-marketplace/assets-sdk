import { Signer } from "ethers";

import { Provider } from "@ethersproject/providers";
import { DeployedContracts } from "../config";
import { IDataTokenHub__factory, IDataTokenHub } from "./contracts";
import { Chain, ChainId } from "./types";
export class DataTokenHub {
  chain: Chain;
  signer?: Signer;
  instance: IDataTokenHub;

  constructor({
    chainId,
    signer,
    provider,
  }: {
    chainId: ChainId;
    signer?: Signer;
    provider?: Provider;
  }) {
    this.chain = ChainId[chainId] as Chain;
    if (signer) {
      this.signer = signer;
      this.instance = IDataTokenHub__factory.connect(
        DeployedContracts[ChainId[chainId]].DataTokenHub,
        signer,
      );
    } else if (provider) {
      this.instance = IDataTokenHub__factory.connect(
        DeployedContracts[ChainId[chainId]].DataTokenHub,
        provider,
      );
    } else {
      throw new Error("No avaliable signer and provider");
    }
  }

  public async whitelistDataTokenFactory(dataTokenFactory: string) {
    const tx = await this.instance.whitelistDataTokenFactory(
      dataTokenFactory,
      true,
    );
    return tx.wait();
  }

  public async setGovernor(governor: string) {
    const tx = await this.instance.setGovernor(governor);
    return tx.wait();
  }

  public getVersion() {
    return this.instance.version();
  }

  public getGovernor() {
    return this.instance.getGovernor();
  }

  public isDataTokenRegistered(dataToken: string) {
    return this.instance.isDataTokenRegistered(dataToken);
  }

  public isDataTokenFactoryWhitelisted(dataTokenFactory: string) {
    return this.instance.isDataTokenFactoryWhitelisted(dataTokenFactory);
  }
}
