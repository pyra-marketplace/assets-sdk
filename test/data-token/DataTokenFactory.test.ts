import { assert } from "chai";
import { BigNumberish, ethers, Signer } from "ethers";
import { describe } from "mocha";

import {
  DataTokenFactory,
  getCyberProfiles,
  getLensProfiles,
  getHandleByLensProfileId,
  createCyberProfile,
  getHandleByCyberProfileId,
  getLensProfileIdByHandle,
} from "../../src/data-token";
import { ZERO_ADDRESS } from "../../src/data-token/constants";
import {
  Chain,
  ChainId,
  CreateDataTokenInput,
  Currency,
  GraphType,
} from "../../src/data-token/types";
import { DeployedContracts } from "../../src/config";
import { infiniteTime } from "../../src/utils";

describe("DataTokenFactory Tests", () => {
  const rpcUrl = "http://127.0.0.1:8545";
  const network = process.env.CHAIN_ENV! as Chain;
  const privateKey = process.env.PRIVATE_KEY!;
  const contentURI = "https://dataverse-os.com";

  describe("LensDataTokenFactory", () => {
    if (network !== "PolygonMumbai") {
      it("Network should change to PolygonMumbai", () => {});
    } else {
      let lensProfileId: BigNumberish;
      let dataTokenFactory: DataTokenFactory;
      let signer: Signer;

      before(async () => {
        const provider = new ethers.providers.JsonRpcProvider(
          rpcUrl,
          ChainId.PolygonMumbai,
        );
        signer = new ethers.Wallet(privateKey, provider);
        dataTokenFactory = new DataTokenFactory({
          chainId: ChainId.PolygonMumbai,
          signer,
        });

        const profileIds = await getLensProfiles({
          chainId: ChainId.PolygonMumbai,
          account: await signer.getAddress(),
        });

        if (profileIds.length !== 0) {
          lensProfileId = profileIds[profileIds.length - 1];
        } else {
          throw new Error(
            `No lens profileId found in account ${await signer.getAddress()}.`,
          );
        }
      });

      it("getLensProfiles successfully", async () => {
        const profileIds = await getLensProfiles({
          chainId: ChainId.PolygonMumbai,
          account: await signer.getAddress(),
        });
        assert.exists(profileIds);
      });

      it("getHandleByLensProfileId successfully", async () => {
        const fullHandle = await getHandleByLensProfileId({
          chainId: ChainId.PolygonMumbai,
          profileId: lensProfileId,
        });
        assert.exists(fullHandle);
      });

      it("getLensProfileIdByHandle successfully", async () => {
        const fullHandle = await getHandleByLensProfileId({
          chainId: ChainId.PolygonMumbai,
          profileId: lensProfileId,
        });

        const profileId = await getLensProfileIdByHandle({
          chainId: ChainId.PolygonMumbai,
          handle: fullHandle!,
        });
        assert.equal(profileId, lensProfileId);
      });

      it("create with SimpleFeeCollectModule successfully", async () => {
        const input: CreateDataTokenInput<GraphType.Lens> = {
          type: GraphType.Lens,
          contentURI,
          profileId: lensProfileId,
          collectModule: "SimpleFeeCollectModule",
          collectLimit: 100,
          recipient: await signer.getAddress(),
          currency: "WMATIC",
          amount: ethers.utils.parseEther("0.001"),
          endTimestamp: infiniteTime(),
        };

        const { creator, originalContract, dataToken } =
          await dataTokenFactory.createDataToken(input);
        assert.equal(creator, await signer.getAddress());
        assert.equal(
          originalContract,
          DeployedContracts.PolygonMumbai.Lens.LensHubProxy,
        );
        assert.notEqual(dataToken, ZERO_ADDRESS);
      });

      it("create with None successfully", async () => {
        const input: CreateDataTokenInput<GraphType.Lens> = {
          type: GraphType.Lens,
          contentURI,
          profileId: lensProfileId,
          collectModule: "None",
          collectLimit: 100,
        };

        const { creator, originalContract, dataToken } =
          await dataTokenFactory.createDataToken(input);
        assert.equal(creator, await signer.getAddress());
        assert.equal(
          originalContract,
          DeployedContracts.PolygonMumbai.Lens.LensHubProxy,
        );
        assert.notEqual(dataToken, ZERO_ADDRESS);
      });
    }
  });

  describe("CyberDataTokenFactory", () => {
    if (network !== "BSCTestnet") {
      it("Network should change to BSCTestnet", () => {});
    } else {
      let cyberProfileId: BigNumberish;
      let dataTokenFactory: DataTokenFactory;
      let signer: Signer;

      before(async () => {
        const provider = new ethers.providers.JsonRpcProvider(
          rpcUrl,
          ChainId.BSCTestnet,
        );
        signer = new ethers.Wallet(privateKey, provider);
        dataTokenFactory = new DataTokenFactory({
          chainId: ChainId.BSCTestnet,
          signer,
        });
        const profileIds = await getCyberProfiles({
          chainId: ChainId.BSCTestnet,
          account: await signer.getAddress(),
        });
        if (profileIds.length !== 0) {
          cyberProfileId = profileIds[0];
        } else {
          cyberProfileId = await createCyberProfile({
            chainId: ChainId.BSCTestnet,
            signer,
            handle: "profile" + Date.now(),
          });
        }
      });

      it("createCyberProfile successfully", async () => {
        const profileId = await createCyberProfile({
          chainId: ChainId.BSCTestnet,
          signer,
          handle: "profile" + Date.now(),
        });
        assert.exists(profileId);
      });

      it("getHandleByCyberProfileId successfully", async () => {
        const handle = "profile" + Date.now();
        const profileId = await createCyberProfile({
          chainId: ChainId.BSCTestnet,
          signer,
          handle,
        });
        const _handle = await getHandleByCyberProfileId({
          chainId: ChainId.BSCTestnet,
          signerOrProvider: signer,
          profileId,
        });
        assert.equal(handle, _handle);
      });

      it("create with CollectPaidMw successfully", async () => {
        const input: CreateDataTokenInput<GraphType.Cyber> = {
          type: GraphType.Cyber,
          contentURI,
          profileId: cyberProfileId,
          essenseMw: "CollectPaidMw",
          totalSupply: 10,
          amount: ethers.utils.parseEther("0.001"),
          recipient: await signer.getAddress(),
          currency: "LINK",
        };

        const { creator, originalContract, dataToken } =
          await dataTokenFactory.createDataToken(input);
        assert.equal(creator, await signer.getAddress());
        assert.equal(
          originalContract,
          DeployedContracts.BSCTestnet.Cyber.CyberProfileProxy,
        );
        assert.notEqual(dataToken, ZERO_ADDRESS);
      });
    }
  });

  describe("ProfilelessDataTokenFactory", () => {
    let dataTokenFactory: DataTokenFactory;
    let signer: Signer;
    let currency: Currency;
    let chainId: ChainId;

    before(async () => {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      signer = new ethers.Wallet(privateKey, provider);
      chainId = await signer.getChainId();
      if (network === "PolygonMumbai") {
        currency = "WMATIC" as Currency<ChainId.PolygonMumbai>;
      }
      if (network === "BSCTestnet") {
        currency = "LINK" as Currency<ChainId.BSCTestnet>;
      }
      if (network === "ScrollSepolia") {
        currency = "USDC" as Currency<ChainId.ScrollSepolia>;
      }
      dataTokenFactory = new DataTokenFactory({
        chainId,
        signer,
      });
    });

    it("create with LimitedFeeCollectModule successfully", async () => {
      const input: CreateDataTokenInput<GraphType.Profileless> = {
        type: GraphType.Profileless,
        contentURI,
        collectModule: "LimitedFeeCollectModule",
        collectLimit: 100,
        amount: ethers.utils.parseEther("0.001"),
        currency,
        recipient: await signer.getAddress(),
      };

      const { creator, originalContract, dataToken } =
        await dataTokenFactory.createDataToken(input);
      assert.equal(creator, await signer.getAddress());
      assert.equal(
        originalContract,
        DeployedContracts[network].Profileless.ProfilelessHub,
      );
      assert.notEqual(dataToken, ZERO_ADDRESS);
    });

    it("create with FreeCollectModule successfully", async () => {
      const input: CreateDataTokenInput<GraphType.Profileless> = {
        type: GraphType.Profileless,
        contentURI,
        collectModule: "FreeCollectModule",
        collectLimit: 100,
      };

      const { creator, originalContract, dataToken } =
        await dataTokenFactory.createDataToken(input);
      assert.equal(creator, await signer.getAddress());
      assert.equal(
        originalContract,
        DeployedContracts[network].Profileless.ProfilelessHub,
      );
      assert.notEqual(dataToken, ZERO_ADDRESS);
    });

    it("create with LimitedTimedFeeCollectModule successfully", async () => {
      const input: CreateDataTokenInput<GraphType.Profileless> = {
        type: GraphType.Profileless,
        contentURI,
        collectModule: "LimitedTimedFeeCollectModule",
        collectLimit: 100,
        amount: ethers.utils.parseEther("0.001"),
        currency,
        recipient: await signer.getAddress(),
        endTimestamp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      };

      const { creator, originalContract, dataToken } =
        await dataTokenFactory.createDataToken(input);
      assert.equal(creator, await signer.getAddress());
      assert.equal(
        originalContract,
        DeployedContracts[network].Profileless.ProfilelessHub,
      );
      assert.notEqual(dataToken, ZERO_ADDRESS);
    });
  });
});
