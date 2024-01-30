import React, { useState } from "react";
import {
  Connector,
  SYSTEM_CALL,
  MeteorWalletProvider
} from "@meteor-web3/connector";
import {
  DEPLOYED_ADDRESSES as TOKEN_DEPLOYED_ADDRESSES,
  DataToken,
  TradeType
} from "../../src/data-token";
import {
  DEPLOYED_ADDRESSES as UNION_DEPLOYED_ADDRESSES,
  DataUnion
} from "../../src/data-union";
import { DataAssetParser } from "../../src/data-asset/DataAssetParser";
import "./App.scss";
import { ChainId } from "../../src/types";

const connector = new Connector(new MeteorWalletProvider());

export const appId = "9aaae63f-3445-47d5-8785-c23dd16e4965";

const postModelId =
  "kjzl6hvfrbw6c8h0oiiv2ccikb2thxsu98sy0ydi6oshj6sjuz9dga94463anvf";

const chainId = ChainId.PolygonMumbai;

const postVersion = "0.0.1";

let address: string;

let unionFolderId: string;

let indexFileId: string;

function App() {
  const [pkh, setPkh] = useState("");

  const createCapability = async () => {
    const connectWalletRes = await connector.connectWallet({
      provider: (window as any).ethereum
    });
    address = connectWalletRes.address;
    console.log(connectWalletRes.address);
    const createCapabilityRes = await connector.runOS({
      method: SYSTEM_CALL.createCapability,
      params: {
        appId
      }
    });
    setPkh(createCapabilityRes.pkh);
    console.log(createCapabilityRes.pkh);
    return createCapabilityRes.pkh;
  };

  /*** wirte operation */
  const createTokenFile = async (withSig: boolean = false) => {
    const dataToken = new DataToken({
      chainId,
      connector
    });

    const date = new Date().toISOString();

    const res = await dataToken.createTokenFile({
      modelId: postModelId,
      fileName: "create a file",
      fileContent: {
        modelVersion: postVersion,
        text: "hello",
        images: [
          "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link"
        ],
        videos: [],
        createdAt: date,
        updatedAt: date,
        encrypted: JSON.stringify({
          text: true,
          images: false,
          videos: false
        })
      },
      actionsConfig: {
        collectAction: {
          currency: TOKEN_DEPLOYED_ADDRESSES[chainId].WMATIC,
          amount: 1000
        },
        shareAction: {
          shareName: "TestShare",
          shareSymbol: "TS",
          currency: TOKEN_DEPLOYED_ADDRESSES[chainId].WMATIC,
          ownerFeePoint: 1000,
          accessibleShareAmount: 1
        }
      },
      // timestamp: Math.floor(Date.parse(date) / 1000) + 1 * 60 * 60 * 24,
      withSig
    });
    indexFileId = res.fileContent.file.fileId;
    console.log(res);
  };

  const collectFile = async (withSig: boolean = false) => {
    const dataAssetParser = new DataAssetParser(connector);
    const dataAsset = await dataAssetParser.parse(indexFileId);

    const dataToken = new DataToken({
      chainId,
      connector,
      fileId: dataAsset.fileOrFolderId,
      assetId: dataAsset.assetId
    });

    const collectionId = await dataToken!.collect(withSig);
    console.log("DataToken collected, collectionId:", collectionId.toNumber());
  };

  const isCollected = async () => {
    const dataAssetParser = new DataAssetParser(connector);
    const dataAsset = await dataAssetParser.parse(indexFileId);

    const dataToken = new DataToken({
      chainId,
      connector,
      fileId: dataAsset.fileOrFolderId,
      assetId: dataAsset.assetId
    });

    const res = await dataToken!.isCollected(address);
    console.log(res);
  };

  const shareFile = async (tradeType: TradeType, withSig = false) => {
    const dataAssetParser = new DataAssetParser(connector);
    const dataAsset = await dataAssetParser.parse(indexFileId);

    const dataToken = new DataToken({
      chainId,
      connector,
      fileId: dataAsset.fileOrFolderId,
      assetId: dataAsset.assetId
    });

    const amount = 50;
    const price = await dataToken.share({
      tradeType,
      amount,
      withSig
    });
    console.log(
      `${
        tradeType === TradeType.Buy ? "Buy" : "Sell"
      } shares succeed, price: ${price}`
    );
  };

  const isShared = async () => {
    const dataAssetParser = new DataAssetParser(connector);
    const dataAsset = await dataAssetParser.parse(indexFileId);

    const dataToken = new DataToken({
      chainId,
      connector,
      fileId: dataAsset.fileOrFolderId,
      assetId: dataAsset.assetId
    });

    const res = await dataToken!.isShared(address);
    console.log(res);
  };

  const unlockFile = async () => {
    try {
      const res = await connector.runOS({
        method: SYSTEM_CALL.unlockFile,
        params: indexFileId
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const isFileUnlocked = async () => {
    try {
      const res = await connector.runOS({
        method: SYSTEM_CALL.isFileUnlocked,
        params: indexFileId
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const createUnionFolder = async (withSig: boolean = false) => {
    const dataUnion = new DataUnion({
      chainId,
      connector
    });

    const res = await dataUnion.createUnionFolder({
      folderName: "Private",
      actionsConfig: {
        collectAction: {
          currency: UNION_DEPLOYED_ADDRESSES[chainId].WMATIC,
          amount: 1000
        },
        subscribeAction: {
          currency: UNION_DEPLOYED_ADDRESSES[chainId].WMATIC,
          amount: 50
        }
      },
      withSig
    });

    unionFolderId = res.newDataUnion.folderId;

    console.log(res);
  };

  const createFileInUnionFolder = async () => {
    const dataAssetParser = new DataAssetParser(connector);
    const dataAsset = await dataAssetParser.parse(unionFolderId);

    const dataUnion = new DataUnion({
      chainId,
      connector,
      folderId: dataAsset.fileOrFolderId,
      assetId: dataAsset.assetId
    });

    const date = new Date().toISOString();

    const res = await dataUnion.createFileInUnionFolder({
      modelId: postModelId,
      fileName: "create a file",
      fileContent: {
        modelVersion: postVersion,
        text: "hello",
        images: [
          "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link"
        ],
        videos: [],
        createdAt: date,
        updatedAt: date,
        encrypted: JSON.stringify({
          text: true,
          images: false,
          videos: false
        })
      },
      unionFolderId,
      timestamp: Math.floor(Date.parse(date) / 1000) + 1 * 60 * 60 * 24
    });

    indexFileId = res.fileContent.file.fileId;

    console.log(res);
  };

  const collectDataUnion = async (withSig: boolean = false) => {
    const dataAssetParser = new DataAssetParser(connector);
    const dataAsset = await dataAssetParser.parse(unionFolderId);

    const dataUnion = new DataUnion({
      chainId,
      connector,
      folderId: dataAsset.fileOrFolderId,
      assetId: dataAsset.assetId
    });

    const collectionId = await dataUnion.collect(withSig);
    console.log("DataUnion collected, collectionId:", collectionId.toNumber());
  };

  const subscribeDataUnion = async (withSig: boolean = false) => {
    const dataAssetParser = new DataAssetParser(connector);
    const dataAsset = await dataAssetParser.parse(unionFolderId);

    const collectionId = 0;

    const dataUnion = new DataUnion({
      chainId,
      connector,
      folderId: dataAsset.fileOrFolderId,
      assetId: dataAsset.assetId
    });

    const { startAt, endAt } = await dataUnion.subscribe({
      collectionId,
      year: 2024,
      month: 1,
      count: 2,
      withSig
    });

    console.log(`DataUnion subscribed from ${startAt} to ${endAt}.`);
  };
  /*** wirte operation */

  /*** read operation */
  const loadCreatedTokenFiles = async () => {
    const dataToken = new DataToken({
      connector
    });
    const res = await dataToken.loadCreatedTokenFiles(address);
    console.log(res);
  };

  const loadCollectedTokenFiles = async () => {
    const dataToken = new DataToken({
      connector
    });
    const res = await dataToken.loadCollectedTokenFiles(address);
    console.log(res);
  };

  // const loadSharedDatatokenFiles = async () => {
  //   const dataToken = new DataToken({
  //     chainId,
  //     connector
  //   });
  //   const res = await dataToken.loadSharedDataTokenFiles(address);
  //   console.log(res);
  // };

  const loadCreatedUnionFolders = async () => {
    const dataUnion = new DataUnion({
      connector
    });
    const res = await dataUnion.loadCreatedUnionFolders(address);
    console.log(res);
  };

  const loadCollectedUnionFolders = async () => {
    const dataUnion = new DataUnion({
      connector
    });
    const res = await dataUnion.loadCollectedUnionFolders(address);
    console.log(res);
  };

  // const loadDatatokens = async () => {
  //   const dataTokenIds = [
  //     "0xd5a9fA9B780a92091B789e57B794c1dd86F3D134",
  //     "0xc4bc152f88b23c5cBD26d7447706C7A55bB953c0",
  //     "0xee81E5318d2CBEF8d08080dA6a931d9f502208A9"
  //   ];

  //   const res = await loadDataTokens(dataTokenIds);

  //   console.log(res);
  // };

  // const isDatatokenCollectedBy = async () => {
  //   const dataTokenId = "0x50eD54ae8700f23E24cB6316ddE8869978AB4d5f";
  //   const res = await connector.runOS({
  //     method: SYSTEM_CALL.isDatatokenCollectedBy,
  //     params: { dataTokenId, collector: address }
  //   });
  //   await isDatatokenCollectedBy({ dataTokenId, collector: address });
  //   console.log(res);
  // };

  // const loadDataUnions = async () => {
  //   const res = await connector.runOS({
  //     method: SYSTEM_CALL.loadDataUnions,
  //     params: [
  //       "0x6eeef1ffc904e0d3f20e6039dcf742cc1e9e2909e40f6a4aa5941f8426be086b"
  //     ]
  //   });
  //   console.log(res);
  // };

  // const isDataUnionCollectedBy = async () => {
  //   const dataUnionId =
  //     "0x6eeef1ffc904e0d3f20e6039dcf742cc1e9e2909e40f6a4aa5941f8426be086b";
  //   const res = await connector.runOS({
  //     method: SYSTEM_CALL.isDataUnionCollectedBy,
  //     params: {
  //       dataUnionId,
  //       collector: address
  //     }
  //   });
  //   console.log(res);
  // };

  // const isDataUnionSubscribedBy = async () => {
  //   const dataUnionId =
  //     "0x6eeef1ffc904e0d3f20e6039dcf742cc1e9e2909e40f6a4aa5941f8426be086b";
  //   const res = await connector.runOS({
  //     method: SYSTEM_CALL.isDataUnionSubscribedBy,
  //     params: {
  //       dataUnionId,
  //       subscriber: address,
  //       timestamp: 0
  //     }
  //   });
  //   console.log(res);
  // };

  /*** read operation */

  return (
    <div className='App'>
      <button onClick={() => createCapability()}>createCapability</button>
      <div className='blackText'>{pkh}</div>
      <hr />
      <button onClick={() => createTokenFile()}>createTokenFile</button>
      <button onClick={() => collectFile()}>collectFile</button>
      <button onClick={() => isCollected()}>isCollected</button>
      <button onClick={() => shareFile(TradeType.Buy)}>shareFile</button>
      <button onClick={() => isShared()}>isShared</button>
      <button onClick={() => isFileUnlocked()}>isFileUnlocked</button>
      <button onClick={() => unlockFile()}>unlockFile</button>
      <button onClick={() => createUnionFolder()}>createUnionFolder</button>
      <button onClick={() => createFileInUnionFolder()}>
        createFileInUnionFolder
      </button>
      <button onClick={() => collectDataUnion()}>collectDataUnion</button>
      <button onClick={() => subscribeDataUnion()}>subscribeDataUnion</button>
      <br />
      <br />
      <button onClick={() => loadCreatedTokenFiles()}>
        loadCollectedTokenFiles
      </button>
      <button onClick={() => loadCollectedTokenFiles()}>
        loadCollectedTokenFiles
      </button>
      {/* <button onClick={loadSharedDatatokenFiles}>
        loadSharedDatatokenFiles
      </button> */}
      <button onClick={() => loadCreatedUnionFolders()}>
        loadCreatedUnionFolders
      </button>
      <button onClick={() => loadCollectedUnionFolders()}>
        loadCollectedUnionFolders
      </button>
      {/* <button onClick={loadDatatokens}>loadDatatokens</button>
      <button onClick={isDatatokenCollectedBy}>isDatatokenCollectedBy</button>
      <button onClick={isDatatokenSharedBy}>isDatatokenSharedBy</button>
      <br />
      <br />
      <button onClick={loadDataUnions}>loadDataUnions</button>
      <button onClick={isDataUnionCollectedBy}>isDataUnionCollectedBy</button>
      <button onClick={isDataUnionSubscribedBy}>isDataUnionSubscribedBy</button> */}
    </div>
  );
}

export default App;
