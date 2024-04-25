# Asset-SDK

[![npm version](https://img.shields.io/npm/v/@pyra-marketplace/assets-sdk.svg)](https://www.npmjs.com/package/@pyra-marketplace/assets-sdk)
![npm](https://img.shields.io/npm/dw/@pyra-marketplace/assets-sdk)
[![License](https://img.shields.io/npm/l/@pyra-marketplace/assets-sdk.svg)](https://github.com/meteor-web3/meteor-hooks/blob/main/LICENSE.md)

## Overview

Asset-SDK provides an extensible set of methods and classes for encryption, unlocking, and monetization on the Dataverse file system network. With defining arbitrary file & asset linking graphs with smart contract gated access control, It should be a good start point for developers to understand and build their own asset marketplaces using new data infrastructures, including decentralized database, encrypted file system, decentralized key management system.

## Install

Before installing asset-sdk, you should install [@meteor-web3/connector](https://github.com/meteor-web3/meteor-sdk/), which is the entrance of Dataverse and Meteor.

```bash
pnpm install @meteor-web3/connector # if you haven't installed it yet
pnpm install @pyra-marketplace/assets-sdk
```

## Examples

### create token-file

```typescript
import {
  Connector,
  MeteorWebProvider
} from "@meteor-web3/connector";
import {
  DEPLOYED_ADDRESSES as TOKEN_DEPLOYED_ADDRESSES,
  DataToken,
  ChainId
} from "@pyra-marketplace/assets-sdk";

const chainId = ChainId.BaseSepolia;
const connector = new Connector(new MeteorWebProvider());

const createTokenFile = async () => {
  const dataToken = new DataToken({
    chainId,
    connector
  });

  const date = new Date().toISOString();

  const res = await dataToken.createTokenFile({
    modelId: "DAPP_MODEL_ID",
    fileName: "create a file",
    fileContent: {
      modelVersion: "0.0.1",
      text: "hello",
      createdAt: date,
      updatedAt: date,
      encrypted: JSON.stringify({
        text: true
      })
    },
    actionsConfig: {
      collectAction: {
        currency: TOKEN_DEPLOYED_ADDRESSES[chainId].WETH,
        amount: 1000
      }
    },
  });
  const indexFileId = res.fileContent.file.fileId;
  console.log({ res, indexFileId });
};
```

### collect token-file

```typescript
import {
  Connector,
  MeteorWebProvider
} from "@meteor-web3/connector";
import {
  DataToken,
  DataAssetParser
} from "@pyra-marketplace/assets-sdk";

const connector = new Connector(new MeteorWebProvider());

const collectFile = async () => {
  const dataAssetParser = new DataAssetParser(connector);
  const dataAsset = await dataAssetParser.parse("DAPP_INDEX_FILE_ID");
  const dataToken = new DataToken({
    chainId: dataAsset.chainId,
    fileId: dataAsset.fileOrFolderId,
    assetId: dataAsset.assetId,
    connector
  });

  const collectionId = await dataToken.collect();
  console.log("DataToken collected, collectionId:", collectionId.toNumber());
};
```

You can find more asset-sdk usage in [demo](./demo).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Contributing

Contributions to this project are welcome. To contribute, please follow these steps:

1. Fork the repository and create a new branch.
2. Make your changes and test them thoroughly.
3. Submit a pull request with a detailed description of your changes.