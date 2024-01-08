import assert from "assert";
import {
  Attached,
  DataAsset,
  DataverseConnector,
  DecryptionConditions,
  DecryptionConditionsType,
  EncryptionProtocol,
  EncryptionProvider,
  MonetizationProvider,
  SYSTEM_CALL,
  Signal,
} from "@dataverse/dataverse-connector";
import { Signer, ethers } from "ethers";
import {
  getChainIdFromChainName,
  getChainNameFromChainId,
  getTimestampByBlockNumber,
} from "../utils";
import {
  GeneralAccessConditions,
  SourceAssetConditionInput,
  SourceAssetCondition,
  LinkedAssetConditions,
  LinkedAssetConditionInput,
  TimestampCondition,
  OrCondition,
  AndCondition,
} from "./types";

export class DataAssetBase {
  fileOrFolderId: string;
  assetContract?: string;
  chainId?: number;
  assetId?: string;
  generalAccessConditions?: GeneralAccessConditions;
  sourceAssetCondition?: SourceAssetCondition;
  linkedAssetConditions?: LinkedAssetConditions;
  monetizationProvider?: MonetizationProvider;
  encryptionProvider?: EncryptionProvider;
  dataverseConnector: DataverseConnector;
  signer: Signer;

  constructor({
    chainId,
    assetContract,
    fileOrFolderId,
    dataverseConnector,
    assetId,
  }: {
    fileOrFolderId: string;
    dataverseConnector: DataverseConnector;
    chainId?: number;
    assetContract?: string;
    assetId?: string;
  }) {
    if (!fileOrFolderId) {
      throw new Error("File or folder Id cannot be empty");
    }

    try {
      const provider = dataverseConnector.getProvider();
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      this.signer = ethersProvider.getSigner();
      assert(this.signer);
    } catch (error) {
      throw new Error("No avaliable signer in dataverseConnector");
    }

    this.fileOrFolderId = fileOrFolderId;
    this.assetContract = assetContract;
    this.dataverseConnector = dataverseConnector;
    this.chainId = chainId;
    if (assetId) {
      this.assetId = assetId;
    }
  }

  async createAssetHandler(method: Function): Promise<string> {
    const assetId = await method();
    this.assetId = assetId;
    return assetId;
  }

  addGeneralCondition(acl: GeneralAccessConditions) {
    this.generalAccessConditions = acl;
  }

  addSourceCondition({
    acl,
    unlockingTimeStamp,
  }: {
    acl: Omit<
      SourceAssetConditionInput,
      "contractAddress" | "functionParams" | "chain"
    >;
    unlockingTimeStamp?: number;
  }) {
    if (!this.assetContract) {
      throw new Error(
        "AssetContract cannot be empty, please pass in through constructor",
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor",
      );
    }
    if (!this.assetId) {
      throw new Error(
        "AssetId cannot be empty, please call createAssetHandler first",
      );
    }
    (acl as SourceAssetConditionInput).contractAddress = this.assetContract!;
    (acl as SourceAssetConditionInput).functionParams = [
      this.assetId,
      ":userAddress",
    ];
    (acl as SourceAssetConditionInput).chain = getChainNameFromChainId(
      this.chainId!,
    );
    if (unlockingTimeStamp) {
      this.sourceAssetCondition = [
        acl as SourceAssetConditionInput,
        { operator: "and" as const },
        {
          contractAddress: "",
          standardContractType: "timestamp",
          chain: (acl as SourceAssetConditionInput).chain,
          method: "eth_getBlockByNumber",
          parameters: ["latest"],
          returnValueTest: {
            comparator: ">=",
            value: String(unlockingTimeStamp),
          },
        },
      ];
    } else {
      this.sourceAssetCondition = [acl as SourceAssetConditionInput];
    }
  }

  async addLinkCondition({
    acl,
    linkedAsset,
    attached,
  }: {
    acl: Omit<
      LinkedAssetConditionInput,
      "contractAddress" | "functionParams" | "chain"
    >;
    linkedAsset?: DataAsset;
    attached?: Attached;
  }) {
    if (
      !linkedAsset?.assetContract ||
      !linkedAsset?.assetId ||
      !linkedAsset?.chainId
    ) {
      return;
    }
    (acl as LinkedAssetConditionInput).contractAddress =
      linkedAsset.assetContract;
    (acl as LinkedAssetConditionInput).functionParams = [
      linkedAsset.assetId,
      ":userAddress",
      ...(attached ? Object.values(attached).map(item => String(item)) : []),
    ];
    (acl as LinkedAssetConditionInput).chain = getChainNameFromChainId(
      linkedAsset.chainId,
    );
    if (attached?.blockNumber) {
      const timestampACL = {
        contractAddress: "",
        standardContractType: "timestamp",
        chain: (acl as LinkedAssetConditionInput).chain,
        method: "eth_getBlockByNumber",
        parameters: ["latest"],
        returnValueTest: {
          comparator: ">=",
          value: String(
            await getTimestampByBlockNumber({
              chainId: linkedAsset.chainId,
              blockNumber: attached.blockNumber,
            }),
          ),
        },
      } as TimestampCondition;
      if (!this.linkedAssetConditions) {
        this.linkedAssetConditions = [
          [
            acl as LinkedAssetConditionInput,
            { operator: "and" as const },
            timestampACL,
          ],
        ];
      } else {
        this.linkedAssetConditions.push(
          ...[
            { operator: "or" as const },
            [
              acl as LinkedAssetConditionInput,
              { operator: "and" as const },
              timestampACL,
            ],
          ],
        );
      }
    } else {
      if (!this.linkedAssetConditions) {
        this.linkedAssetConditions = [[acl as LinkedAssetConditionInput]];
      } else {
        this.linkedAssetConditions.push(
          ...[{ operator: "or" as const }, [acl as LinkedAssetConditionInput]],
        );
      }
    }
  }

  async applyFileConditions() {
    const dependencies = this.linkedAssetConditions?.map(item => {
      if ((item as OrCondition)?.operator) {
        return;
      }
      item = item as (
        | LinkedAssetConditionInput
        | AndCondition
        | TimestampCondition
      )[];
      item[0] = item[0] as LinkedAssetConditionInput;
      return {
        linkedAsset: {
          assetId: item[0].functionParams[0],
          assetContract: item[0].contractAddress,
          chainId: getChainIdFromChainName(item[0].chain),
        },
        attached: Object.fromEntries(
          item[0].functionAbi.inputs
            .slice(2)
            .map((_item, index) => [
              _item.name,
              (
                (
                  item as (
                    | LinkedAssetConditionInput
                    | AndCondition
                    | TimestampCondition
                  )[]
                )[0] as LinkedAssetConditionInput
              ).functionParams.slice(2)[index],
            ]),
        ),
      };
    });
    const monetizationProvider = {
      dataAsset: {
        assetId: this.assetId,
        assetContract: this.assetContract,
        chainId: this.chainId,
      },
      dependencies,
    } as MonetizationProvider;
    this.monetizationProvider = monetizationProvider;

    const decryptionConditions = [
      this.generalAccessConditions,
      { operator: "or" as const },
      this.sourceAssetCondition,
      { operator: "or" as const },
      this.linkedAssetConditions,
    ] as DecryptionConditions;

    const encryptionProvider = {
      protocol: EncryptionProtocol.Lit,
      decryptionConditions,
      decryptionConditionsType:
        DecryptionConditionsType.UnifiedAccessControlCondition,
    };
    this.encryptionProvider = encryptionProvider;

    const res = await this.dataverseConnector.runOS({
      method: SYSTEM_CALL.monetizeFile,
      params: {
        fileId: this.fileOrFolderId!,
        monetizationProvider,
        encryptionProvider,
      },
    });

    return res;
  }

  async applyFolderConditions(signal?: Signal) {
    const monetizationProvider = {
      dataAsset: {
        assetId: this.assetId,
        assetContract: this.assetContract,
        chainId: this.chainId,
      },
    } as MonetizationProvider;

    this.monetizationProvider = monetizationProvider;

    const res = await this.dataverseConnector.runOS({
      method: SYSTEM_CALL.monetizeFolder,
      params: {
        folderId: this.fileOrFolderId!,
        monetizationProvider,
        signal,
      },
    });

    return res;
  }
}
