import { assert } from "chai";
import { Signer, ethers } from "ethers";

import {
  Chain,
  ChainId,
  CreateDataTokenInput,
  Currency as DataTokenCurrency,
  GraphType,
} from "../../src/data-token/types";
import { DataUnion } from "../../src/data-union";
import { DeployedContracts, BlockNumberConfig } from "../../src/config";
// import { createLensProfile, getLensProfiles } from "../../src/data-token";

describe("DataUnion Tests", () => {
  const rpcUrl = "http://127.0.0.1:8545";
  const network = process.env.CHAIN_ENV! as Chain;
  const privateKey = process.env.PRIVATE_KEY!;
  const contentURI = "https://dataverse-os.com";

  const testResourceId = "test-resource-1";
  let dataUnion: DataUnion;
  let signer: Signer;
  let dataTokenCurrency: DataTokenCurrency;

  before(async () => {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    signer = new ethers.Wallet(privateKey, provider);
    if (network === "PolygonMumbai") {
      dataTokenCurrency = "WMATIC" as DataTokenCurrency<ChainId.PolygonMumbai>;
    }
    if (network === "BSCTestnet") {
      dataTokenCurrency = "LINK" as DataTokenCurrency<ChainId.BSCTestnet>;
    }
    // if (network === "ScrollSepolia") {
    //   dataTokenCurrency = "USDC" as DataTokenCurrency<ChainId.ScrollSepolia>;
    // }

    dataUnion = new DataUnion({
      chainId: await signer.getChainId(),
      signer,
    });
  });

  it("publish with BlockSubscribeModule successfully", async () => {
    const createDataTokenInput: CreateDataTokenInput<GraphType.Profileless> = {
      type: GraphType.Profileless,
      contentURI,
      collectModule: "LimitedFeeCollectModule",
      collectLimit: 100,
      amount: ethers.utils.parseEther("0.001"),
      currency: dataTokenCurrency,
      recipient: await signer.getAddress(),
    };

    const {
      dataUnionId,
      publisher,
      resourceId,
      dataToken,
      subscribeModule,
      startBlockNumber,
    } = await dataUnion.publish({
      createDataTokenInput,
      resourceId: testResourceId,
      subscribeModule: "BlockSubscribeModule",
      subscribeModuleInput: {
        currency: "DVC",
        amount: ethers.utils.parseEther("0.0000001"),
      },
    });

    assert.exists(dataUnionId);
    assert.equal(publisher, await signer.getAddress());
    assert.equal(resourceId, testResourceId);
    assert.notEqual(dataToken, ethers.constants.AddressZero);
    assert.equal(
      subscribeModule,
      DeployedContracts[network].DataUnion.BlockSubscribeModule,
    );
    assert.isTrue(startBlockNumber.gt(0));
  });

  it("close successfully", async () => {
    const createDataTokenInput: CreateDataTokenInput<GraphType.Profileless> = {
      type: GraphType.Profileless,
      contentURI,
      collectModule: "LimitedFeeCollectModule",
      collectLimit: 100,
      amount: ethers.utils.parseEther("0.001"),
      currency: dataTokenCurrency,
      recipient: await signer.getAddress(),
    };

    const { dataUnionId: publishedDataUnionId } = await dataUnion.publish({
      createDataTokenInput,
      resourceId: testResourceId,
      subscribeModule: "BlockSubscribeModule",
      subscribeModuleInput: {
        currency: "DVC",
        amount: ethers.utils.parseEther("0.0000001"),
      },
    });

    const { dataUnionId, operator, endBlockNumber } =
      await dataUnion.close(publishedDataUnionId);
    assert.equal(dataUnionId, publishedDataUnionId);
    assert.equal(operator, await signer.getAddress());
    const currentBlockNumber = await signer.provider!.getBlockNumber();
    assert.isTrue(endBlockNumber.lte(currentBlockNumber));
  });

  it("getDataUnionById successfully", async () => {
    const createDataTokenInput: CreateDataTokenInput<GraphType.Profileless> = {
      type: GraphType.Profileless,
      contentURI,
      collectModule: "LimitedFeeCollectModule",
      collectLimit: 100,
      amount: ethers.utils.parseEther("0.001"),
      currency: dataTokenCurrency,
      recipient: await signer.getAddress(),
    };

    const {
      dataUnionId: publishedDataUnionId,
      publisher: unionPublisher,
      resourceId: unionResourceId,
      dataToken: unionDataToken,
      subscribeModule: unionSubscribeModule,
      startBlockNumber: unionStartBlockNumber,
    } = await dataUnion.publish({
      createDataTokenInput,
      resourceId: testResourceId,
      subscribeModule: "BlockSubscribeModule",
      subscribeModuleInput: {
        currency: "DVC",
        amount: ethers.utils.parseEther("0.0000001"),
      },
    });

    const {
      publisher,
      resourceId,
      dataToken,
      subscribeModule,
      startBlockNumber,
    } = await dataUnion.getDataUnionById(publishedDataUnionId);
    assert.equal(publisher, unionPublisher);
    assert.equal(resourceId, unionResourceId);
    assert.equal(dataToken, unionDataToken);
    assert.equal(subscribeModule, unionSubscribeModule);
    assert.isTrue(startBlockNumber.eq(unionStartBlockNumber));
  });

  it("collect successfully", async () => {
    const createDataTokenInput: CreateDataTokenInput<GraphType.Profileless> = {
      type: GraphType.Profileless,
      contentURI,
      collectModule: "LimitedFeeCollectModule",
      collectLimit: 100,
      amount: ethers.utils.parseEther("0.001"),
      currency: dataTokenCurrency,
      recipient: await signer.getAddress(),
    };

    const { dataUnionId: publishedDataUnionId, dataToken: unionDataToken } =
      await dataUnion.publish({
        createDataTokenInput,
        resourceId: testResourceId,
        subscribeModule: "BlockSubscribeModule",
        subscribeModuleInput: {
          currency: "DVC",
          amount: ethers.utils.parseEther("0.0000001"),
        },
      });

    const { dataUnionId, dataToken } =
      await dataUnion.collect(publishedDataUnionId);

    assert.equal(dataUnionId, publishedDataUnionId);
    assert.equal(dataToken, unionDataToken);
    assert.isTrue(
      await dataUnion.isCollected({
        dataUnionId,
        account: await signer.getAddress(),
      }),
    );
  });

  it("isCollected successfully", async () => {
    const createDataTokenInput: CreateDataTokenInput<GraphType.Profileless> = {
      type: GraphType.Profileless,
      contentURI,
      collectModule: "LimitedFeeCollectModule",
      collectLimit: 100,
      amount: ethers.utils.parseEther("0.001"),
      currency: dataTokenCurrency,
      recipient: await signer.getAddress(),
    };

    const { dataUnionId } = await dataUnion.publish({
      createDataTokenInput,
      resourceId: testResourceId,
      subscribeModule: "BlockSubscribeModule",
      subscribeModuleInput: {
        currency: "DVC",
        amount: ethers.utils.parseEther("0.0000001"),
      },
    });

    const collectedStatus = await dataUnion.isCollected({
      dataUnionId,
      account: await signer.getAddress(),
    });
    assert.isTrue(collectedStatus);
  });

  it("subscribe with BlockSubscribeModule successfully", async () => {
    const createDataTokenInput: CreateDataTokenInput<GraphType.Profileless> = {
      type: GraphType.Profileless,
      contentURI,
      collectModule: "LimitedFeeCollectModule",
      collectLimit: 100,
      amount: ethers.utils.parseEther("0.001"),
      currency: dataTokenCurrency,
      recipient: await signer.getAddress(),
    };

    const { dataUnionId: publishedDataUnionId, startBlockNumber } =
      await dataUnion.publish({
        createDataTokenInput,
        resourceId: testResourceId,
        subscribeModule: "BlockSubscribeModule",
        subscribeModuleInput: {
          currency: "DVC",
          amount: ethers.utils.parseEther("0.0000001"),
        },
      });

    const { collectTokenId: collectedTokenId } =
      await dataUnion.collect(publishedDataUnionId);

    const { dataUnionId, collectTokenId, subscribeModule, startAt, endAt } =
      await dataUnion.subscribe({
        dataUnionId: publishedDataUnionId,
        collectTokenId: collectedTokenId,
        subscribeInput: {
          startAt: startBlockNumber,
          endAt: startBlockNumber.add(10),
        },
      });

    assert.equal(dataUnionId, publishedDataUnionId);
    assert.isTrue(collectTokenId.eq(collectedTokenId));
    assert.equal(
      subscribeModule,
      DeployedContracts[network].DataUnion.BlockSubscribeModule,
    );
    assert.isTrue(startAt.eq(startBlockNumber));
    assert.isTrue(endAt.eq(startBlockNumber.add(10)));
  });

  it("subscribe with TimeSegmentSubscribeModule successfully", async () => {
    const createDataTokenInput: CreateDataTokenInput<GraphType.Profileless> = {
      type: GraphType.Profileless,
      contentURI,
      collectModule: "LimitedFeeCollectModule",
      collectLimit: 100,
      amount: ethers.utils.parseEther("0.001"),
      currency: dataTokenCurrency,
      recipient: await signer.getAddress(),
    };

    const { dataUnionId: publishedDataUnionId, startBlockNumber } =
      await dataUnion.publish({
        createDataTokenInput,
        resourceId: testResourceId,
        subscribeModule: "TimeSegmentSubscribeModule",
        subscribeModuleInput: {
          currency: "DVC",
          amount: ethers.utils.parseEther("0.001"),
          segment: "Month",
        },
      });

    const { collectTokenId: collectedTokenId } =
      await dataUnion.collect(publishedDataUnionId);

    const { dataUnionId, collectTokenId, subscribeModule, startAt, endAt } =
      await dataUnion.subscribe({
        dataUnionId: publishedDataUnionId,
        collectTokenId: collectedTokenId,
        subscribeInput: {
          startAt: startBlockNumber,
          segmentsCount: 1,
        },
      });

    assert.equal(dataUnionId, publishedDataUnionId);
    assert.isTrue(collectTokenId.eq(collectedTokenId));
    assert.equal(
      subscribeModule,
      DeployedContracts[network].DataUnion.TimeSegmentSubscribeModule,
    );
    assert.isTrue(startAt.eq(startBlockNumber));
    assert.isTrue(
      endAt.eq(startBlockNumber.add(BlockNumberConfig[network].segment.Month)),
    );
  });

  it("getSubscriptionData successfully", async () => {
    const createDataTokenInput: CreateDataTokenInput<GraphType.Profileless> = {
      type: GraphType.Profileless,
      contentURI,
      collectModule: "LimitedFeeCollectModule",
      collectLimit: 100,
      amount: ethers.utils.parseEther("0.001"),
      currency: dataTokenCurrency,
      recipient: await signer.getAddress(),
    };

    const { dataUnionId, startBlockNumber } = await dataUnion.publish({
      createDataTokenInput,
      resourceId: testResourceId,
      subscribeModule: "BlockSubscribeModule",
      subscribeModuleInput: {
        currency: "DVC",
        amount: ethers.utils.parseEther("0.0000001"),
      },
    });

    const { collectTokenId } = await dataUnion.collect(dataUnionId);

    const { startAt, endAt } = await dataUnion.subscribe({
      dataUnionId,
      collectTokenId,
      subscribeInput: {
        startAt: startBlockNumber,
        endAt: startBlockNumber.add(10),
      },
    });

    const subscriptionList = await dataUnion.getSubscriptionData({
      dataUnionId,
      collectTokenId,
    });
    assert.isTrue(startAt.eq(subscriptionList[0].startAt));
    assert.isTrue(endAt.eq(subscriptionList[0].endAt));
  });

  it("isAccessible successfully", async () => {
    const createDataTokenInput: CreateDataTokenInput<GraphType.Profileless> = {
      type: GraphType.Profileless,
      contentURI,
      collectModule: "LimitedFeeCollectModule",
      collectLimit: 100,
      amount: ethers.utils.parseEther("0.001"),
      currency: dataTokenCurrency,
      recipient: await signer.getAddress(),
    };

    const { dataUnionId, startBlockNumber } = await dataUnion.publish({
      createDataTokenInput,
      resourceId: testResourceId,
      subscribeModule: "BlockSubscribeModule",
      subscribeModuleInput: {
        currency: "DVC",
        amount: ethers.utils.parseEther("0.0000001"),
      },
    });

    const { collectTokenId } = await dataUnion.collect(dataUnionId);

    const { startAt } = await dataUnion.subscribe({
      dataUnionId,
      collectTokenId,
      subscribeInput: {
        startAt: startBlockNumber,
        endAt: startBlockNumber.add(10),
      },
    });

    let accessableStatus: boolean;
    accessableStatus = await dataUnion.isAccessibleByTokenId({
      dataUnionId,
      collectTokenId,
      blockNumber: startAt,
    });
    assert.isTrue(accessableStatus);
    accessableStatus = await dataUnion.isAccessibleBySubscriber({
      dataUnionId,
      subscriber: await signer.getAddress(),
      blockNumber: startAt,
    });
    assert.isTrue(accessableStatus);

    accessableStatus = await dataUnion.isAccessibleByTokenId({
      dataUnionId,
      collectTokenId,
      blockNumber: await signer.provider!.getBlockNumber(),
    });
    assert.isTrue(accessableStatus);
    accessableStatus = await dataUnion.isAccessibleBySubscriber({
      dataUnionId,
      subscriber: await signer.getAddress(),
      blockNumber: await signer.provider!.getBlockNumber(),
    });
    assert.isTrue(accessableStatus);

    accessableStatus = await dataUnion.isAccessibleByTokenId({
      dataUnionId,
      collectTokenId,
      blockNumber: (await signer.provider!.getBlockNumber()) + 1,
    });
    assert.isFalse(accessableStatus);
    accessableStatus = await dataUnion.isAccessibleBySubscriber({
      dataUnionId,
      subscriber: await signer.getAddress(),
      blockNumber: (await signer.provider!.getBlockNumber()) + 1,
    });
    assert.isFalse(accessableStatus);
  });
});
