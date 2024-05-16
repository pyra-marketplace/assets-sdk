import { DataverseKernel } from "@dataverse/dataverse-kernel";
import {
  Connector,
  SYSTEM_CALL,
  MeteorLocalProvider
} from "@meteor-web3/connector";
import {
  DEPLOYED_ADDRESSES as TOKEN_DEPLOYED_ADDRESSES,
  DataToken
} from "../../src/data-token";
import { ChainId } from "../../src/types";

const chainId = ChainId.BaseSepolia;

const appId = "9aaae63f-3445-47d5-8785-c23dd16e4965";

const postModelId =
  "kjzl6hvfrbw6c8h0oiiv2ccikb2thxsu98sy0ydi6oshj6sjuz9dga94463anvf";

const postVersion = "0.0.1";

const testPK = "";

async function localTest() {
  await DataverseKernel.runNodeKernel();
  // test
  const connector = new Connector(new MeteorLocalProvider(testPK));
  const connectRes = await connector.connectWallet();
  console.log({ connectRes });
  const { pkh } = await connector.runOS({
    method: SYSTEM_CALL.createCapability,
    params: {
      appId
    }
  });
  console.log({ pkh });
  const dataToken = new DataToken({
    chainId,
    connector
  });
  const date = new Date().toISOString();
  const tokenFile = await dataToken.createTokenFile({
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
        currency: TOKEN_DEPLOYED_ADDRESSES[chainId].WETH,
        amount: 1000
      }
    }
    // timestamp: Math.floor(Date.parse(date) / 1000) + 1 * 60 * 60 * 24,
  });
  console.log({ tokenFile });
}

localTest();
