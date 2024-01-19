import React, { useState } from "react";
import {
  DataverseConnector, WALLET,
  // WALLET,
  // StructuredFolderRecord,
  // Currency,
  // RESOURCE,
  // SYSTEM_CALL,
  // ActionType,
  // DatatokenType,
  // ChainId,
  // DatatokenVars,
  // MirrorFile,
  // CollectModule,
  // DataUnionVars,
  // DataWalletProvider
} from "@dataverse/dataverse-connector";
import { ethers, utils } from "ethers";
import { WalletProvider } from "@dataverse/wallet-provider";
import { DEPLOYED_ADDRESSES as TOKEN_DEPLOYED_ADDRESSES, DataToken, TradeType } from "../../src/data-token";
import { DEPLOYED_ADDRESSES as UNION_DEPLOYED_ADDRESSES, DataUnion } from "../../src/data-union";

import "./App.scss";
import { ChainId } from "../../src/types";

const dataverseConnector = new DataverseConnector();

// export const appId = "9aaae63f-3445-47d5-8785-c23dd16e4965";

// const postModelId =
//   "kjzl6hvfrbw6c8h0oiiv2ccikb2thxsu98sy0ydi6oshj6sjuz9dga94463anvf";

// const actionFileModelId =
//   "kjzl6hvfrbw6c9g4ui7z1jksvbk7y09q6c1ruyqiij0otmvzr7oy3vd0yg43qzw";

// const chainId = ChainId.PolygonMumbai;
// const dataTokenType: DatatokenType = DatatokenType.Profileless;

// const postVersion = "0.0.1";

// let wallet: WALLET;

// let address: string;
// let pkh: string;

// let keyHandler: string;
// let encryptedContent: Record<string, any>;

// let folderId: string;

// let dataUnions: StructuredFolderRecord;
// let dataUnionId: string;

// let indexFileId: string;
// let actionFileId: string;

function App() {
  // const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [address, setAddress] = useState("");
  const [dataToken, setDataToken] = useState<DataToken>();
  const [dataTokenId, setDataTokenId] = useState<string>("0x29eec7833b1d3f195551617512e16636597f1bd0ad5c6a5c7038f286d18d327d");
  const [dataUnionId, setDataUnionId] = useState<string>("0x4d618a7c8e9c11ebf120493681a5493d5fd8451929c981efc586b82091f785cb");

  const connectWallet = async () => {
    const provider = (window as any).ethereum;
    console.log(provider);
    const {address} = await dataverseConnector.connectWallet({
      wallet: WALLET.METAMASK,
      provider
    });
    setDataToken(dataToken);
    setAddress(address);
  }

  const publishDataToken = async (withSig: boolean = false) => {
    const dataToken = new DataToken({
      chainId: ChainId.PolygonMumbai,
      dataverseConnector,
      fileId: "test-file-id",
    });

    const assetId = await dataToken!.publish({
      resourceId: "test-resource-id",
      actionsConfig: {
        collectAction: {
          currency: TOKEN_DEPLOYED_ADDRESSES[ChainId.PolygonMumbai].WMATIC,
          amount: 1000
        },
        shareAction: {
          shareName: "TestShare",
          shareSymbol: "TS",
          currency: TOKEN_DEPLOYED_ADDRESSES[ChainId.PolygonMumbai].WMATIC,
          ownerFeePoint: 1000,
          accessibleShareAmount: 1
        }
      },
      withSig
    });

    setDataTokenId(assetId);

    console.log("DataToken published, assetId:", assetId)
  }

  const collectDataToken = async (withSig: boolean = false) => {
    const dataToken = new DataToken({
      chainId: ChainId.PolygonMumbai,
      dataverseConnector,
      fileId: "test-file-id",
      assetId: dataTokenId
    });
    const collectionId = await dataToken!.collect(withSig);
    console.log("DataToken collected, collectionId:", collectionId.toNumber());
  }

  const shareDataToken = async (tradeType: TradeType, withSig = false) => {
    const dataToken = new DataToken({
      chainId: ChainId.PolygonMumbai,
      dataverseConnector,
      fileId: "test-file-id",
      assetId: dataTokenId
    });

    const amount = 50;
    const price = await dataToken.share({
      tradeType,
      amount,
      withSig
    });
    console.log(`${tradeType === TradeType.Buy ? "Buy" : "Sell"} shares succeed, price: ${price}`)
  }

  const addDataTokenActions = async (withSig: boolean = false) => {
    const dataToken = new DataToken({
      chainId: ChainId.PolygonMumbai,
      dataverseConnector,
      fileId: "test-file-id",
    });

    await dataToken.publish({
      resourceId: "test-resource-id"
    });

    await dataToken.addActions({
      collectAction: {
        currency: TOKEN_DEPLOYED_ADDRESSES[ChainId.PolygonMumbai].WMATIC,
        amount: 1000
      },
      shareAction: {
        shareName: "TestShare",
        shareSymbol: "TS",
        currency: TOKEN_DEPLOYED_ADDRESSES[ChainId.PolygonMumbai].WMATIC,
        ownerFeePoint: 1000,
        accessibleShareAmount: 1
      },
       withSig
    });
    
    console.log("AddActions succeed.");
  }

  const publishDataUnion = async (withSig: boolean = false) => {
    const dataUnion = new DataUnion({
      chainId: ChainId.PolygonMumbai,
      dataverseConnector,
      folderId: "test-folder-id",
    });

    const assetId = await dataUnion!.publish({
      resourceId: "test-resource-id",
      actionsConfig: {
        collectAction: {
          currency: UNION_DEPLOYED_ADDRESSES[ChainId.PolygonMumbai].WMATIC,
          amount: 1000
        },
        subscribeAction: {
          currency: UNION_DEPLOYED_ADDRESSES[ChainId.PolygonMumbai].WMATIC,
          amount: 50
        }
      },
      withSig
    });

    setDataUnionId(assetId);

    console.log("DataUnion published, assetId:", assetId)
  }

  const collectDataUnion = async (withSig: boolean = false) => {
    const dataUnion = new DataUnion({
      chainId: ChainId.PolygonMumbai,
      dataverseConnector,
      folderId: "test-folder-id",
      assetId: dataUnionId
    });
    const collectionId = await dataUnion!.collect(withSig);
    console.log("DataUnion collected, collectionId:", collectionId.toNumber());
  }

  const subscribeDataUnion = async (withSig: boolean = false) => {
    const collectionId = 0;

    const dataUnion = new DataUnion({
      chainId: ChainId.PolygonMumbai,
      dataverseConnector,
      folderId: "test-folder-id",
      assetId: dataUnionId
    });

    const {startAt, endAt} = await dataUnion.subscribe({
      collectionId,
      year: 2024,
      month: 1,
      count: 2,
      withSig
    });

    console.log(`DataUnion subscribed from ${startAt} to ${endAt}.`);
  }

//   const [_pkh, _setPkh] = useState("");
//   const [provider, setProvider] = useState<WalletProvider>();

//   /*** Capability ***/
//   const connectWalletWithMetamaskProvider = async (_wallet = wallet) => {
//     const provider = (window as any).ethereum;
//     console.log(provider);
//     const res = await dataverseConnector.connectWallet({
//       wallet: _wallet,
//       provider
//     });
//     console.log(res);
//     setProvider(provider);
//     wallet = WALLET.EXTERNAL_WALLET;
//     address = res.address;
//     _setAddress(address);
//     provider.on("chainChanged", (networkId: string) => {
//       console.log(Number(networkId));
//     });
//     provider.on("accountsChanged", (accounts: Array<string>) => {
//       console.log(accounts);
//       address = utils.getAddress(accounts[0]);
//       _setAddress(address);
//     });
//     return res;
//   };

//   const createCapability = async () => {
//     await connectWalletWithMetamaskProvider();
//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.createCapability,
//       params: {
//         appId,
//         resource: RESOURCE.CERAMIC
//       }
//     });
//     pkh = res.pkh;
//     const cacao = res.cacao;
//     _setPkh(pkh);
//     console.log(pkh);
//     console.log(cacao);
//     return pkh;
//   };

//   /*** Capability ***/

//   /*** DataUnions ***/
//   const publishDataUnion = async () => {
//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.createFolder,
//       params: {
//         folderName: "data union",
//         folderDescription: "data union description"
//       }
//     });

//     const collectModule =
//       "LimitedTimedFeeCollectModule" as CollectModule<DatatokenType.Profileless>;
//     const dataUnionVars = {
//       dataTokenVars: {
//         chainId,
//         type: dataTokenType,
//         streamId: res.newFolder.folderId,
//         collectModule,
//         collectLimit: 100,
//         ...(collectModule !== "FreeCollectModule" && {
//           recipient: address,
//           currency: Currency.WMATIC,
//           amount: 0.0001
//         }),
//         ...(collectModule === "LimitedTimedFeeCollectModule" && {
//           endTimestamp: String(Math.floor(Date.now() / 1000) + 1 * 60 * 60 * 24)
//         })
//       },
//       resourceId: "",
//       subscribeModule: "TimeSegmentSubscribeModule",
//       subscribeModuleInput: {
//         amount: 0.0001,
//         currency: "DVC",
//         segment: "Week"
//       }
//     };
//     const dataUnion = new DataUnion({ chainId, folderId, dataverseConnector });

//     const { dataUnionId: dataUnionContractId } =
//       await dataverseConnector.monetizationTemplate.dataUnion.createDataUnion({
//         signer: new ethers.providers.Web3Provider(provider!).getSigner(),
//         dataUnionVars: dataUnionVars as DataUnionVars
//       });

//     const monetizationProvider =
//       dataverseConnector.monetizationTemplate.dataUnion.generateMonetizationProvider(
//         {
//           chainId,
//           dataUnionId: dataUnionContractId as string
//         }
//       );

//     // const dataUnion = await dataverseConnector.runOS({
//     //   method: SYSTEM_CALL.publishDataUnion,
//     //   params: {
//     //     dataUnionId: res.newFolder.folderId,
//     //     monetizationProvider
//     //     // contentType: { resource: StorageResource.CERAMIC, resourceId: postModelId },
//     //     // contentType: { resource: StorageResource.IPFS },
//     //     // actionType: ActionType.LIKE,
//     //   }
//     // });
//     console.log(dataUnion);
//   };

//   const updateDataUnionBaseInfo = async () => {
//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.updateDataUnionBaseInfo,
//       params: {
//         dataUnionId: dataUnionId!,
//         dataUnionName: new Date().toISOString(),
//         dataUnionDescription: new Date().toISOString()
//       }
//     });
//     console.log(res);
//   };

//   const loadCreatedDataUnions = async () => {
//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.loadCreatedDataUnions
//     });
//     dataUnions = res;
//     console.log(res);
//     return res;
//   };

//   const loadCollectedDataUnions = async () => {
//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.loadCollectedDataUnions
//     });
//     console.log(res);
//   };

//   const loadDataUnionById = async () => {
//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.loadDataUnionById,
//       params: dataUnionId
//     });
//     console.log(res);
//   };

//   const deleteDataUnion = async () => {
//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.deleteDataUnion,
//       params: {
//         dataUnionId: dataUnionId!
//       }
//     });
//     console.log(res);
//   };

//   const deleteAllDataUnion = async () => {
//     if (!dataUnions) {
//       dataUnions = await loadCreatedDataUnions();
//     }
//     await Promise.all(
//       Object.keys(dataUnions).map((dataUnionId) =>
//         dataverseConnector.runOS({
//           method: SYSTEM_CALL.deleteDataUnion,
//           params: { dataUnionId }
//         })
//       )
//     );
//   };
//   /*** DataUnions ***/

//   /*** Files ***/
//   const createIndexFile = async () => {
//     const date = new Date().toISOString();

//     const encrypted = JSON.stringify({
//       text: false,
//       images: false,
//       videos: false
//     });

//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.createIndexFile,
//       params: {
//         modelId: postModelId,
//         fileName: "create a file",
//         fileContent: {
//           modelVersion: postVersion,
//           text: "hello",
//           images: [
//             "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link"
//           ],
//           videos: [],
//           createdAt: date,
//           updatedAt: date,
//           encrypted
//         },
//         encryptedContent,
//         keyHandler
//       }
//     });

//     indexFileId = res.fileContent.file.fileId;
//     console.log(res);
//   };

//   const updateIndexFile = async () => {
//     const date = new Date().toISOString();

//     const encrypted = JSON.stringify({
//       text: true,
//       images: true,
//       videos: false
//     });

//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.updateIndexFile,
//       params: {
//         fileId: indexFileId!,
//         fileName: "update the file",
//         fileContent: {
//           modelVersion: postVersion,
//           text: "hello",
//           images: [
//             "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link"
//           ],
//           videos: [],
//           createdAt: date,
//           updatedAt: date,
//           encrypted
//         },
//         encryptedContent,
//         keyHandler
//       }
//     });
//     console.log(res);
//   };

//   const loadFile = async () => {
//     const file = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.loadFile,
//       params: indexFileId
//     });
//     console.log(file);
//     return file;
//   };

//   const loadFilesBy = async () => {
//     const fileRecord = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.loadFilesBy,
//       params: {
//         modelId: postModelId,
//         pkh
//       }
//     });
//     console.log(fileRecord);
//   };

//   const loadActionFilesByFileId = async () => {
//     const fileRecord = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.loadActionFilesByFileId,
//       params: indexFileId
//     });
//     console.log(fileRecord);
//   };

//   const loadActionFilesByDataUnionId = async () => {
//     const fileRecord = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.loadActionFilesByDataUnionId,
//       params: dataUnionId
//     });
//     console.log(fileRecord);
//   };

//   const loadCreatedDatatokenFiles = async () => {
//     const fileRecord = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.loadCreatedDatatokenFiles
//     });
//     console.log(fileRecord);
//   };

//   const loadCollectedDatatokenFiles = async () => {
//     const fileRecord = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.loadCollectedDatatokenFiles
//     });
//     console.log(fileRecord);
//   };

//   const createActionFile = async () => {
//     if (!indexFileId) {
//       throw "RelationId cannnot be empty";
//     }
//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.createActionFile,
//       params: {
//         folderId,
//         action: {
//           actionType: ActionType.LIKE,
//           comment: "I like it!",
//           isRelationIdEncrypted: false,
//           isCommentEncrypted: false
//         },
//         relationId: indexFileId,
//         fileName: "like"
//       }
//     });
//     actionFileId = res.newFile.fileId;
//     console.log(res);
//   };

//   const updateActionFile = async () => {
//     if (!indexFileId) {
//       throw "RelationId cannnot be empty";
//     }
//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.updateActionFile,
//       params: {
//         fileId: actionFileId!,
//         isRelationIdEncrypted: true,
//         isCommentEncrypted: true,
//         fileName: "like"
//       }
//     });
//     actionFileId = res.currentFile.fileId;
//     console.log(res);
//   };

//   const monetizeFile = async (fileId?: string) => {
//     try {
//       if (!pkh) {
//         throw "You must connect capability";
//       }

//       const isDatatoken = false;
//       let dataTokenId: string | undefined;

//       if (isDatatoken) {
//         const collectModule =
//           "LimitedTimedFeeCollectModule" as CollectModule<DatatokenType.Profileless>;
//         const dataTokenVars = {
//           chainId,
//           type: dataTokenType,
//           streamId: fileId ?? indexFileId,
//           collectModule,
//           collectLimit: 100,
//           ...(collectModule !== "FreeCollectModule" && {
//             recipient: address,
//             currency: Currency.WMATIC,
//             amount: 0.0001
//           }),
//           ...(collectModule === "LimitedTimedFeeCollectModule" && {
//             endTimestamp: String(
//               Math.floor(Date.now() / 1000) + 1 * 60 * 60 * 24
//             )
//           })
//         };

//         const dataToken =
//           await dataverseConnector.monetizationTemplate.dataToken.createDatatoken(
//             {
//               signer: new ethers.providers.Web3Provider(provider!).getSigner(),
//               dataTokenVars: dataTokenVars as DatatokenVars
//             }
//           );
//         dataTokenId = dataToken.dataTokenId;
//       }

//       if (dataTokenId || dataUnionId) {
//         const monetizationProvider =
//           await dataverseConnector.monetizationTemplate.dataToken.generateMonetizationProvider(
//             {
//               chainId,
//               dataTokenId,
//               dataUnionIds: [dataUnionId]
//               // unlockingTimestamp: String(
//               //   Math.floor(Date.now() / 1000) + 5 * 60
//               // )
//             }
//           );

//         let dataUnionChainId: ChainId | undefined;
//         let unionContractAddress: string | undefined;
//         if (dataUnionId) {
//           const res = await dataverseConnector.runOS({
//             method: SYSTEM_CALL.loadDataUnionById,
//             params: dataUnionId
//           });
//           dataUnionChainId = res.accessControl?.monetizationProvider?.chainId;
//           unionContractAddress =
//             res.accessControl?.monetizationProvider?.unionContract;
//         }

//         const decryptionConditions =
//           await dataverseConnector.monetizationTemplate.dataToken.generateAccessControlConditions(
//             {
//               address,
//               dataTokenId,
//               dataUnionIds: [dataUnionId],
//               dataTokenChainId: chainId,
//               unlockingTimestamp: monetizationProvider.unlockingTimestamp,
//               dataUnionChainId,
//               unionContractAddress,
//               blockNumber: monetizationProvider.blockNumber
//             }
//           );

//         const encryptionProvider =
//           dataverseConnector.monetizationTemplate.dataToken.generateEncryptionProvider(
//             decryptionConditions
//           );

//         const res = await dataverseConnector.runOS({
//           method: SYSTEM_CALL.monetizeFile,
//           params: {
//             // actionFile cannot be monetized to a dataToken
//             fileId: fileId ?? indexFileId,
//             monetizationProvider,
//             encryptionProvider
//           }
//         });
//         console.log(res);
//         return res;
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   /*** Files ***/

//   /*** Collect and Unlock ***/
//   const collectFile = async () => {
//     try {
//       let profileId;
//       if (dataTokenType !== DatatokenType.Profileless) {
//         profileId = await getOrCreateProfileId({
//           pkh: pkh!,
//           lensNickName: "handle" + Date.now()
//         });
//       }

//       const loadFileRes = await dataverseConnector.runOS({
//         method: SYSTEM_CALL.loadFile,
//         params: indexFileId
//       });

//       const { dataTokenId, chainId } =
//         loadFileRes.fileContent.file.accessControl.monetizationProvider;

//       await dataverseConnector.monetizationTemplate.dataToken.collectDatatoken({
//         dataTokenId,
//         chainId,
//         profileId,
//         signer: new ethers.providers.Web3Provider(provider!).getSigner()
//       });

//       const res = await dataverseConnector.runOS({
//         method: SYSTEM_CALL.createActionFile,
//         params: {
//           action: {
//             actionType: ActionType.COLLECT
//           },
//           relationId: loadFileRes.fileContent.file.fileId,
//           fileName: "collect"
//         }
//       });
//       console.log(res);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const collectDataUnion = async () => {
//     try {
//       const res = await dataverseConnector.runOS({
//         method: SYSTEM_CALL.collectDataUnion,
//         params: dataUnionId
//       });
//       console.log(res);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const subscribeDataUnion = async () => {
//     try {
//       const fileRes = await loadFile();
//       const file = (fileRes.fileContent.file ??
//         fileRes.fileContent.content) as MirrorFile;

//       if (!file.accessControl?.monetizationProvider?.dataUnionIds) {
//         throw "The file cannot be subscribed";
//       }

//       const startAt = file.accessControl?.monetizationProvider?.blockNumber;

//       const dataUnion = await dataverseConnector.runOS({
//         method: SYSTEM_CALL.loadDataUnionById,
//         params: dataUnionId
//       });

//       const dataUnionContractId =
//         dataUnion.accessControl?.monetizationProvider?.dataUnionId;

//       const dataUnions = await dataverseConnector.runOS({
//         method: SYSTEM_CALL.loadDataUnions,
//         params: [dataUnionContractId!]
//       });

//       const subscriptionList = dataUnions[0]?.subscribers?.filter(
//         (item) => item.subscriber === address
//       );

//       const collectTokenId = subscriptionList[0]?.collect_nft_token_id;

//       const res = await dataverseConnector.runOS({
//         method: SYSTEM_CALL.subscribeDataUnion,
//         params: {
//           dataUnionId: dataUnionId!,
//           collectTokenId,
//           subscribeInput: {
//             startAt,
//             segmentsCount: 1
//           }
//         }
//       });
//       console.log(res);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const unlockFile = async () => {
//     try {
//       const res = await dataverseConnector.runOS({
//         method: SYSTEM_CALL.unlockFile,
//         params: indexFileId
//       });
//       console.log(res);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const isFileUnlocked = async () => {
//     try {
//       const res = await dataverseConnector.runOS({
//         method: SYSTEM_CALL.isFileUnlocked,
//         params: actionFileId || indexFileId
//       });
//       console.log(res);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   /*** Collect and Unlock ***/

//   /*** Query Datatoken ***/
//   const loadDatatokens = async () => {
//     const dataTokenIds = [
//       "0xd5a9fA9B780a92091B789e57B794c1dd86F3D134",
//       "0xc4bc152f88b23c5cBD26d7447706C7A55bB953c0",
//       "0xee81E5318d2CBEF8d08080dA6a931d9f502208A9"
//     ];
//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.loadDatatokens,
//       params: dataTokenIds
//     });
//     console.log(res);
//   };

//   const isDatatokenCollectedBy = async () => {
//     const dataTokenId = "0x50eD54ae8700f23E24cB6316ddE8869978AB4d5f";
//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.isDatatokenCollectedBy,
//       params: { dataTokenId, collector: address }
//     });
//     console.log(res);
//   };
//   /*** Query Datatoken ***/

//   /*** Query DataUnion ***/
//   const loadDataUnions = async () => {
//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.loadDataUnions,
//       params: [
//         "0x6eeef1ffc904e0d3f20e6039dcf742cc1e9e2909e40f6a4aa5941f8426be086b"
//       ]
//     });
//     console.log(res);
//   };

//   const isDataUnionCollectedBy = async () => {
//     const dataUnionId =
//       "0x6eeef1ffc904e0d3f20e6039dcf742cc1e9e2909e40f6a4aa5941f8426be086b";
//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.isDataUnionCollectedBy,
//       params: {
//         dataUnionId,
//         collector: address
//       }
//     });
//     console.log(res);
//   };

//   const isDataUnionSubscribedBy = async () => {
//     const dataUnionId =
//       "0x6eeef1ffc904e0d3f20e6039dcf742cc1e9e2909e40f6a4aa5941f8426be086b";
//     const res = await dataverseConnector.runOS({
//       method: SYSTEM_CALL.isDataUnionSubscribedBy,
//       params: {
//         dataUnionId,
//         subscriber: address,
//         timestamp: 0
//       }
//     });
//     console.log(res);
//   };
  /*** Query DataUnion ***/

  return (
    <div className='App'>
      <button onClick={connectWallet}>connectWallet</button>
      <div className='blackText'>{address}</div>
      <hr />
      <button onClick={() => publishDataToken()}>publishDataToken</button>
      <button onClick={() => publishDataToken(true)}>publishDataTokenWithSig</button>
      <div className="blackText">{dataTokenId}</div>
      <button onClick={() => collectDataToken()}>collectDataToken</button>
      <button onClick={() => collectDataToken(true)}>collectDataTokenWithSig</button>
      <button onClick={() => shareDataToken(TradeType.Buy)}>(Buy)shareDataToken</button>
      <button onClick={() => shareDataToken(TradeType.Buy, true)}>(Buy)shareDataTokenWithSig</button>
      <button onClick={() => shareDataToken(TradeType.Sell)}>(Sell)shareDataToken</button>
      <button onClick={() => shareDataToken(TradeType.Sell, true)}>(Sell)shareDataTokenWithSig</button>
      <button onClick={() => addDataTokenActions()}>addDataTokenActions</button>
      <button onClick={() => addDataTokenActions(true)}>addDataTokenActionsWithSig</button>
      <hr />
      <button onClick={() => publishDataUnion()}>publishDataUnion</button>
      <button onClick={() => publishDataUnion(true)}>publishDataUnionWithSig</button>
      <div className='blackText'>{dataUnionId}</div>
      <button onClick={() => collectDataUnion()}>collectDataUnion</button>
      <button onClick={() => collectDataUnion(true)}>collectDataUnionWithSig</button>
      <button onClick={() => subscribeDataUnion()}>subscribeDataUnion</button>
      <button onClick={() => subscribeDataUnion(true)}>subscribeDataUnionWithSig</button>

      {/* <button onClick={createCapability}>createCapability</button>
      <div className='blackText'>{_pkh}</div>
      <button onClick={publishDataUnion}>publishDataUnion</button>
      <button onClick={updateDataUnionBaseInfo}>updateDataUnionBaseInfo</button>
      <button onClick={loadCreatedDataUnions}>loadCreatedDataUnions</button>
      <button onClick={loadCollectedDataUnions}>loadCollectedDataUnions</button>
      <button onClick={loadDataUnionById}>loadDataUnionById</button>
      <button onClick={deleteDataUnion}>deleteDataUnion</button>
      <button onClick={deleteAllDataUnion}>deleteAllDataUnion</button>
      <br />
      <br />
      <button onClick={createIndexFile}>createIndexFile</button>
      <button onClick={updateIndexFile}>updateIndexFile</button>
      <button onClick={loadFile}>loadFile</button>
      <button onClick={loadFilesBy}>loadFilesBy</button>
      <button onClick={loadCreatedDatatokenFiles}>
        loadCreatedDatatokenFiles
      </button>
      <button onClick={loadCollectedDatatokenFiles}>
        loadCollectedDatatokenFiles
      </button>
      <button onClick={() => monetizeFile()}>monetizeFile</button>
      <br />
      <br />
      <button onClick={collectFile}>collectFile</button>
      <button onClick={collectDataUnion}>collectDataUnion</button>
      <button onClick={subscribeDataUnion}>subscribeDataUnion</button>
      <button onClick={unlockFile}>unlockFile</button>
      <button onClick={isFileUnlocked}>isFileUnlocked</button>
      <br />
      <br />
      <button onClick={loadDatatokens}>loadDatatokens</button>
      <button onClick={isDatatokenCollectedBy}>isDatatokenCollectedBy</button>
      <br />
      <br />
      <button onClick={loadDataUnions}>loadDataUnions</button>
      <button onClick={isDataUnionCollectedBy}>isDataUnionCollectedBy</button>
      <button onClick={isDataUnionSubscribedBy}>isDataUnionSubscribedBy</button>
      <br />
      <br /> */}
    </div>
  );
}

export default App;
