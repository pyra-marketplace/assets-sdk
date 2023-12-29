import { assert } from "chai";
import { ethers } from "ethers";
import { describe } from "mocha";

import { DataTokenHub } from "../../src/data-token";
import { DeployedContracts } from "../../src/config";

describe("DataTokenHub Tests", () => {
  const rpcUrl = "http://127.0.0.1:8545";
  const network = process.env.CHAIN_ENV!;

  let dataTokenHub: DataTokenHub;

  before(async () => {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const signer = provider.getSigner();
    dataTokenHub = new DataTokenHub({
      chainId: await signer.getChainId(),
      signer,
    });
  });

  it("DataTokenFactory has been whitelisted", async () => {
    const factories: string[] = [];
    if (DeployedContracts[network].Lens) {
      factories.push(DeployedContracts[network].Lens.DataTokenFactory);
    }
    if (DeployedContracts[network].Cyber) {
      factories.push(DeployedContracts[network].Cyber.DataTokenFactory);
    }
    factories.push(DeployedContracts[network].Profileless.DataTokenFactory);
    factories.map(async factory => {
      const isWhitelisted =
        await dataTokenHub.isDataTokenFactoryWhitelisted(factory);
      assert.equal(isWhitelisted, true);
    });
  });
});
