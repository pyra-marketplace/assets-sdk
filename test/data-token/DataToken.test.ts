import { assert } from "chai";
import { BigNumber, BigNumberish, ethers, Signer } from "ethers";
import { describe } from "mocha";

import {
  DataTokenFactory,
  DataToken,
  getCyberProfiles,
  getLensProfiles,
  createCyberProfile,
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

describe("DataToken Tests", () => {
  const rpcUrl = "http://127.0.0.1:8545";
  const network = process.env.CHAIN_ENV! as Chain;
  const privateKey = process.env.PRIVATE_KEY!;
  const contentURI = "https://dataverse-os.com";

  describe("LensDataToken", () => {
    if (network !== "PolygonMumbai") {
      it("Network should change to PolygonMumbai", () => {});
    } else {
      let lensProfileId: BigNumberish;
      let dataTokenFactory: DataTokenFactory;
      let lensDataToken: DataToken;
      let signer: Signer;

      before(async () => {
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
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
          lensProfileId = profileIds[0];
        } else {
          throw new Error(
            `No lens profileId found in account ${await signer.getAddress()}.`,
          );
        }

        const input: CreateDataTokenInput<GraphType.Lens> = {
          type: GraphType.Lens,
          contentURI,
          profileId: lensProfileId,
          collectModule: "None",
          collectLimit: 100,
          recipient: await signer.getAddress(),
          currency: "WMATIC",
          amount: ethers.utils.parseEther("0.001"),
          endTimestamp: infiniteTime(),
        };

        const { dataToken } = await dataTokenFactory.createDataToken(input);
        lensDataToken = new DataToken({
          chainId: ChainId.PolygonMumbai,
          dataTokenAddress: dataToken,
          signer,
        });
      });

      it("get type successfully", async () => {
        const graphType = await lensDataToken.getType();
        assert.equal(graphType, GraphType.Lens);
      });

      it("get contentURI successfully", async () => {
        const gettedContentURI = await lensDataToken.getContentURI();
        assert.equal(gettedContentURI, contentURI);
      });

      it("get collected status successfully", async () => {
        const isCollected = await lensDataToken.isCollected(
          await signer.getAddress(),
        );
        assert.equal(isCollected, true);
      });

      it("get collectNFT contract successfully", async () => {
        let collectNFT = await lensDataToken.getCollectNFT();
        assert.equal(collectNFT, ZERO_ADDRESS);

        const { collectNFT: collectNFTAddress } =
          await lensDataToken.collect(lensProfileId);

        collectNFT = await lensDataToken.getCollectNFT();
        assert.equal(collectNFT, collectNFTAddress);
      });

      it("get metadata successfully", async () => {
        const metadata = await lensDataToken.getMetadata();
        assert.equal(
          metadata.originalContract,
          DeployedContracts.PolygonMumbai.Lens.LensHubProxy,
        );
        assert.equal(
          BigNumber.from(lensProfileId).eq(metadata.profileId),
          true,
        );
        assert.equal(
          metadata.collectMiddleware,
          DeployedContracts.PolygonMumbai.Lens.CollectPublicationAction,
        );
      });

      it("get DataToken owner successfully", async () => {
        const owner = await lensDataToken.getDataTokenOwner();
        assert.equal(owner, await signer.getAddress());
      });

      it("collect with SimpleFeeCollectModule successfully", async () => {
        const { dataToken, collector } =
          await lensDataToken.collect(lensProfileId);
        assert.equal(dataToken, lensDataToken.address);
        assert.equal(collector, await signer.getAddress());
        assert.equal(await lensDataToken.isCollected(collector), true);
      });

      it("collect with None successfully", async () => {
        const input: CreateDataTokenInput<GraphType.Lens> = {
          type: GraphType.Lens,
          contentURI,
          profileId: lensProfileId,
          collectModule: "None",
          collectLimit: 100,
        };

        const { dataToken: _dataToken } =
          await dataTokenFactory.createDataToken(input);
        const _lensDataToken = new DataToken({
          chainId: ChainId.PolygonMumbai,
          dataTokenAddress: _dataToken,
          signer,
        });
        const { dataToken, collector } =
          await _lensDataToken.collect(lensProfileId);
        assert.equal(dataToken, _dataToken);
        assert.equal(collector, await signer.getAddress());
        assert.equal(await _lensDataToken.isCollected(collector), true);
      });
    }
  });

  describe("CyberDataToken", () => {
    if (network !== "BSCTestnet") {
      it("Network should change to BSCTestnet", () => {});
    } else {
      let cyberProfileId: BigNumberish;
      let dataTokenFactory: DataTokenFactory;
      let cyberDataToken: DataToken;
      let signer: Signer;

      before(async () => {
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
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

        const { dataToken } = await dataTokenFactory.createDataToken(input);

        cyberDataToken = new DataToken({
          chainId: ChainId.BSCTestnet,
          dataTokenAddress: dataToken,
          signer,
        });
      });

      it("get type successfully", async () => {
        const graphType = await cyberDataToken.getType();
        assert.equal(graphType, GraphType.Cyber);
      });

      it("get contentURI successfully", async () => {
        const gettedContentURI = await cyberDataToken.getContentURI();
        assert.equal(gettedContentURI, contentURI);
      });

      it("get collected status successfully", async () => {
        const isCollected = await cyberDataToken.isCollected(
          await signer.getAddress(),
        );
        assert.equal(isCollected, true);
      });

      it("get collectNFT contract successfully", async () => {
        const collectNFT = await cyberDataToken.getCollectNFT();
        assert.equal(collectNFT, ZERO_ADDRESS);
      });

      it("get metadata successfully", async () => {
        const metadata = await cyberDataToken.getMetadata();
        assert.equal(
          metadata.originalContract.toLowerCase(),
          DeployedContracts.BSCTestnet.Cyber.CyberProfileProxy.toLowerCase(),
        );
        assert.equal(
          BigNumber.from(cyberProfileId).eq(metadata.profileId),
          true,
        );
        assert.equal(
          metadata.collectMiddleware.toLowerCase(),
          DeployedContracts.BSCTestnet.Cyber.CollectPaidMw.toLowerCase(),
        );
      });

      it("get DataToken owner successfully", async () => {
        const owner = await cyberDataToken.getDataTokenOwner();
        assert.equal(owner, await signer.getAddress());
      });

      it("collect with CollectPaidMw successfully", async () => {
        const _cyberDataToken = new DataToken({
          chainId: ChainId.BSCTestnet,
          dataTokenAddress: "0x68Cbf22b64B3a44A0931f038539FfdB0B057717a",
          signer,
        });
        const { dataToken, collector } = await _cyberDataToken.collect();
        assert.equal(dataToken, _cyberDataToken.address);
        assert.equal(collector, await signer.getAddress());
        assert.equal(await _cyberDataToken.isCollected(collector), true);
      });
    }
  });

  describe("ProfilelessDataToken", () => {
    let dataTokenFactory: DataTokenFactory;
    let profilelessDataToken: DataToken;
    let signer: Signer;
    let currency: Currency;
    let chainId: ChainId;

    before(async () => {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      signer = new ethers.Wallet(privateKey, provider);
      chainId = await signer.getChainId();
      dataTokenFactory = new DataTokenFactory({
        chainId,
        signer,
      });
      if (network === "PolygonMumbai") {
        currency = "WMATIC" as Currency<ChainId.PolygonMumbai>;
      }
      if (network === "BSCTestnet") {
        currency = "LINK" as Currency<ChainId.BSCTestnet>;
      }
      if (network === "ScrollSepolia") {
        currency = "USDC" as Currency<ChainId.ScrollSepolia>;
      }

      const input: CreateDataTokenInput<GraphType.Profileless> = {
        type: GraphType.Profileless,
        contentURI,
        collectModule: "LimitedFeeCollectModule",
        collectLimit: 100,
        amount: ethers.utils.parseEther("0.001"),
        currency,
        recipient: await signer.getAddress(),
      };

      const { dataToken } = await dataTokenFactory.createDataToken(input);
      profilelessDataToken = new DataToken({
        chainId,
        dataTokenAddress: dataToken,
        signer,
      });
    });

    it("get type successfully", async () => {
      const graphType = await profilelessDataToken.getType();
      assert.equal(graphType, GraphType.Profileless);
    });

    it("get contentURI successfully", async () => {
      const gettedContentURI = await profilelessDataToken.getContentURI();
      assert.equal(gettedContentURI, contentURI);
    });

    it("get collected status successfully", async () => {
      const isCollected = await profilelessDataToken.isCollected(
        await signer.getAddress(),
      );
      assert.equal(isCollected, true);
    });

    it("get collectNFT contract successfully", async () => {
      let collectNFT = await profilelessDataToken.getCollectNFT();
      assert.equal(collectNFT, ZERO_ADDRESS);

      const { collectNFT: collectNFTAddress } =
        await profilelessDataToken.collect();

      collectNFT = await profilelessDataToken.getCollectNFT();
      assert.equal(collectNFT, collectNFTAddress);
    });

    it("get metadata successfully", async () => {
      const metadata = await profilelessDataToken.getMetadata();
      assert.equal(
        metadata.originalContract,
        DeployedContracts[network].Profileless.ProfilelessHub,
      );
      assert.isTrue(BigNumber.from(0).eq(metadata.profileId));
      assert.equal(
        metadata.collectMiddleware,
        DeployedContracts[network].Profileless.LimitedFeeCollectModule,
      );
    });

    it("get DataToken owner successfully", async () => {
      const owner = await profilelessDataToken.getDataTokenOwner();
      assert.equal(owner, await signer.getAddress());
    });

    it("collect with LimitedFeeCollectModule successfully", async () => {
      const { dataToken, collector } = await profilelessDataToken.collect();
      assert.equal(dataToken, profilelessDataToken.address);
      assert.equal(collector, await signer.getAddress());
      assert.equal(await profilelessDataToken.isCollected(collector), true);
    });

    it("collect with FreeCollectModule successfully", async () => {
      const input: CreateDataTokenInput<GraphType.Profileless> = {
        type: GraphType.Profileless,
        contentURI,
        collectModule: "FreeCollectModule",
        collectLimit: 100,
      };

      const { dataToken: dataTokenAddress } =
        await dataTokenFactory.createDataToken(input);

      const _profilelessDataToken = new DataToken({
        chainId,
        dataTokenAddress,
        signer,
      });

      const { dataToken, collector } = await _profilelessDataToken.collect();

      assert.equal(dataToken, _profilelessDataToken.address);
      assert.equal(collector, await signer.getAddress());
      assert.equal(await _profilelessDataToken.isCollected(collector), true);
    });

    it("Collect with LimitedTimedFeeCollectModule successfully", async () => {
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

      const { dataToken: dataTokenAddress } =
        await dataTokenFactory.createDataToken(input);

      const _profilelessDataToken = new DataToken({
        chainId,
        dataTokenAddress,
        signer,
      });

      const { dataToken, collector } = await _profilelessDataToken.collect();

      assert.equal(dataToken, _profilelessDataToken.address);
      assert.equal(collector, await signer.getAddress());
      assert.equal(await _profilelessDataToken.isCollected(collector), true);
    });
  });
});
