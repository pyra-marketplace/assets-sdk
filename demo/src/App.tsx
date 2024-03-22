import React from "react";
import {
  Connector,
  SYSTEM_CALL,
  MeteorWebProvider
} from "@meteor-web3/connector";
import {
  DEPLOYED_ADDRESSES as TOKEN_DEPLOYED_ADDRESSES,
  DataToken
} from "../../src/data-token";
import { DataAssetParser } from "../../src/data-asset/DataAssetParser";
import "./App.scss";
import { ChainId } from "../../src/types";

const connector = new Connector(new MeteorWebProvider());

const appId = "9aaae63f-3445-47d5-8785-c23dd16e4965";

const postModelId =
  "kjzl6hvfrbw6c8h0oiiv2ccikb2thxsu98sy0ydi6oshj6sjuz9dga94463anvf";

const chainId = ChainId.PolygonMumbai;

const postVersion = "0.0.1";

let address: string;

let indexFileId: string;

function App() {
  const [pkh, setPkh] = React.useState("");

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
      chainId: dataAsset.chainId,
      fileId: dataAsset.fileOrFolderId,
      assetId: dataAsset.assetId,
      connector
    });

    const collectionId = await dataToken!.collect(withSig);
    console.log("DataToken collected, collectionId:", collectionId.toNumber());
  };
  /*** wirte operation */

  /*** read operation */
  const isCollected = async () => {
    const dataAssetParser = new DataAssetParser(connector);
    const dataAsset = await dataAssetParser.parse(indexFileId);

    const dataToken = new DataToken({
      chainId: dataAsset.chainId,
      fileId: dataAsset.fileOrFolderId,
      assetId: dataAsset.assetId,
      connector
    });

    const res = await dataToken!.isCollected(address);
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

  const loadDatatokens = async () => {
    const dataTokenIds = [
      "0x197da5229824a7f9a485aae50487771dcd8a20770951d0a188a36c152635b8fb",
      "0x3d1c168cb7f98f242946571c24c50f95b95d0b300495c817cf68aba4f07f5113"
    ];

    const res = await DataToken.loadDataTokens(dataTokenIds);

    console.log(res);
  };

  /*** read operation */

  return (
    <div className='App'>
      <button onClick={() => createCapability()}>createCapability</button>
      <div className='blackText'>{pkh}</div>
      <hr />
      <button onClick={() => createTokenFile()}>createTokenFile</button>
      <button onClick={() => collectFile()}>collectFile</button>
      <br />
      <br />
      <button onClick={() => isCollected()}>isCollected</button>
      <button onClick={() => isFileUnlocked()}>isFileUnlocked</button>
      <button onClick={() => unlockFile()}>unlockFile</button>
      <button onClick={() => loadCreatedTokenFiles()}>
        loadCreatedTokenFiles
      </button>
      <button onClick={() => loadCollectedTokenFiles()}>
        loadCollectedTokenFiles
      </button>
      <button onClick={loadDatatokens}>loadDatatokens</button>
    </div>
  );
}

export default App;
