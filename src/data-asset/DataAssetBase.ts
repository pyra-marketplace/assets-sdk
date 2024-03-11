import {
  Attached,
  DataAsset,
  Connector,
  DecryptionConditions,
  DecryptionConditionsType,
  EncryptionProtocol,
  EncryptionProvider,
  MonetizationProvider,
  SYSTEM_CALL
} from "@meteor-web3/connector";
import { BigNumberish, BytesLike, Signer, Wallet, ethers } from "ethers";
import {
  getChainIdFromChainName,
  getChainNameFromChainId,
  oneDayLater
} from "../utils";
import { ChainId } from "../types";
import {
  GeneralAccessConditions,
  SourceAssetConditionInput,
  SourceAssetConditions,
  LinkedAssetConditions,
  LinkedAssetConditionInput,
  TimestampCondition,
  OrCondition,
  AndCondition,
  ActParams,
  EIP712Signature,
  PublishParams,
  AddActionsParams
} from "./types";
import { DataMonetizerBase__factory, IERC20__factory } from "./abi/typechain";

export class DataAssetBase {
  fileOrFolderId?: string;
  assetContract?: string;
  chainId?: ChainId;
  assetId?: string;
  generalAccessConditions?: GeneralAccessConditions;
  sourceAssetConditions?: SourceAssetConditions;
  linkedAssetConditions?: LinkedAssetConditions;
  monetizationProvider?: MonetizationProvider;
  encryptionProvider?: EncryptionProvider;
  connector: Connector;
  signer?: Signer;

  constructor({
    chainId,
    connector,
    fileOrFolderId,
    assetContract,
    assetId
  }: {
    chainId?: ChainId;
    connector: Connector;
    fileOrFolderId?: string;
    assetContract?: string;
    assetId?: string;
  }) {
    const provider = connector.getProvider();
    const ethersProvider = new ethers.providers.Web3Provider(provider, "any");
    this.signer = ethersProvider.getSigner();
    this.chainId = chainId;
    this.connector = connector;
    this.assetContract = assetContract;
    this.fileOrFolderId = fileOrFolderId;
    this.assetId = assetId;
  }

  // public async createAssetHandler(method: Function): Promise<string> {
  //   const assetId = await method();
  //   this.assetId = assetId;
  //   return assetId;
  // }

  protected addGeneralCondition(acl: GeneralAccessConditions) {
    this.generalAccessConditions = acl;
  }

  protected addSourceCondition({
    acl,
    timestamp
  }: {
    acl: Omit<SourceAssetConditionInput, "functionParams">;
    timestamp?: number;
  }) {
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor"
      );
    }
    if (!this.assetId) {
      throw new Error(
        "AssetId cannot be empty, please call createAssetHandler first"
      );
    }
    (acl as SourceAssetConditionInput).functionParams = [
      this.assetId,
      ":userAddress"
    ];

    if (timestamp) {
      const timestampACL = {
        conditionType: "evmBasic",
        contractAddress: "",
        standardContractType: "timestamp",
        chain: (acl as SourceAssetConditionInput).chain,
        method: "eth_getBlockByNumber",
        parameters: ["latest"],
        returnValueTest: {
          comparator: ">=",
          value: String(timestamp)
        }
      } as TimestampCondition;
      if (!this.sourceAssetConditions) {
        this.sourceAssetConditions = [
          [
            acl as SourceAssetConditionInput,
            { operator: "and" as const },
            timestampACL
          ]
        ];
      } else {
        this.sourceAssetConditions.push(
          ...[
            { operator: "or" as const },
            [
              acl as SourceAssetConditionInput,
              { operator: "and" as const },
              timestampACL
            ]
          ]
        );
      }
    } else {
      if (!this.sourceAssetConditions) {
        this.sourceAssetConditions = [[acl as SourceAssetConditionInput]];
      } else {
        this.sourceAssetConditions.push(
          ...[{ operator: "or" as const }, [acl as SourceAssetConditionInput]]
        );
      }
    }
  }

  protected async addLinkCondition({
    acl,
    linkedAsset,
    attached
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
      ...(attached ? Object.values(attached).map((item) => String(item)) : [])
    ];
    (acl as LinkedAssetConditionInput).chain = getChainNameFromChainId(
      linkedAsset.chainId
    );
    if (attached?.timestamp) {
      const timestampACL = {
        conditionType: "evmBasic",
        contractAddress: "",
        standardContractType: "timestamp",
        chain: (acl as LinkedAssetConditionInput).chain,
        method: "eth_getBlockByNumber",
        parameters: ["latest"],
        returnValueTest: {
          comparator: ">=",
          value: String(attached.timestamp)
        }
      } as TimestampCondition;
      if (!this.linkedAssetConditions) {
        this.linkedAssetConditions = [
          [
            acl as LinkedAssetConditionInput,
            { operator: "and" as const },
            timestampACL
          ]
        ];
      } else {
        this.linkedAssetConditions.push(
          ...[
            { operator: "or" as const },
            [
              acl as LinkedAssetConditionInput,
              { operator: "and" as const },
              timestampACL
            ]
          ]
        );
      }
    } else {
      if (!this.linkedAssetConditions) {
        this.linkedAssetConditions = [[acl as LinkedAssetConditionInput]];
      } else {
        this.linkedAssetConditions.push(
          ...[{ operator: "or" as const }, [acl as LinkedAssetConditionInput]]
        );
      }
    }
  }

  protected async applyFileConditions(fileId?: string) {
    if (!fileId && !this.fileOrFolderId) {
      throw new Error("File Id cannot be empty");
    }
    const dependencies = this.linkedAssetConditions?.map((item) => {
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
          chainId: getChainIdFromChainName(item[0].chain)
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
              ).functionParams.slice(2)[index]
            ])
        )
      };
    });
    const monetizationProvider = {
      ...(this.sourceAssetConditions &&
        this.sourceAssetConditions.length > 0 && {
          dataAsset: {
            assetId: this.assetId,
            assetContract: this.assetContract,
            chainId: this.chainId
          }
        }),
      dependencies
    } as MonetizationProvider;
    this.monetizationProvider = monetizationProvider;

    const decryptionConditions = [
      ...(this.generalAccessConditions ? [this.generalAccessConditions] : []),
      ...(this.sourceAssetConditions
        ? [{ operator: "or" as const }, this.sourceAssetConditions]
        : []),
      ...(this.linkedAssetConditions
        ? [{ operator: "or" as const }, this.linkedAssetConditions]
        : [])
    ] as DecryptionConditions;

    const encryptionProvider = {
      protocol: EncryptionProtocol.Lit,
      decryptionConditions,
      decryptionConditionsType:
        DecryptionConditionsType.UnifiedAccessControlCondition
    };
    this.encryptionProvider = encryptionProvider;

    const res = await this.connector.runOS({
      method: SYSTEM_CALL.monetizeFile,
      params: {
        fileId: fileId ?? this.fileOrFolderId!,
        monetizationProvider,
        encryptionProvider
      }
    });

    return res;
  }

  protected async applyFolderConditions(folderId?: string) {
    if (!folderId && !this.fileOrFolderId) {
      throw new Error("Folder Id cannot be empty");
    }

    const dependencies = this.linkedAssetConditions?.map((item) => {
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
          chainId: getChainIdFromChainName(item[0].chain)
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
              ).functionParams.slice(2)[index]
            ])
        )
      };
    });

    const monetizationProvider = {
      ...(this.sourceAssetConditions &&
        this.sourceAssetConditions.length > 0 && {
          dataAsset: {
            assetId: this.assetId,
            assetContract: this.assetContract,
            chainId: this.chainId
          }
        }),
      dependencies
    } as MonetizationProvider;
    this.monetizationProvider = monetizationProvider;

    const decryptionConditions = [
      ...(this.generalAccessConditions ? [this.generalAccessConditions] : []),
      ...(this.sourceAssetConditions
        ? [{ operator: "or" as const }, this.sourceAssetConditions]
        : []),
      ...(this.linkedAssetConditions
        ? [{ operator: "or" as const }, this.linkedAssetConditions]
        : [])
    ] as DecryptionConditions;

    const encryptionProvider =
      decryptionConditions.length > 0
        ? {
            protocol: EncryptionProtocol.Lit,
            decryptionConditions,
            decryptionConditionsType:
              DecryptionConditionsType.UnifiedAccessControlCondition
          }
        : undefined;

    this.encryptionProvider = encryptionProvider;

    const res = await this.connector.runOS({
      method: SYSTEM_CALL.monetizeFolder,
      params: {
        folderId: folderId ?? this.fileOrFolderId!,
        monetizationProvider,
        encryptionProvider
      }
    });

    return res;
  }

  public async getAssetOwner(assetId: BytesLike) {
    if (!this.assetContract) {
      throw new Error(
        "AssetContract cannot be empty, please pass in through constructor"
      );
    }
    if (!this.signer) {
      throw new Error("Signer not found, please collect wallet");
    }
    const dataMonetizerBase = DataMonetizerBase__factory.connect(
      this.assetContract,
      this.signer
    );
    return await dataMonetizerBase.getAssetOwner(assetId);
  }

  protected async createAssetHandler(
    publishParams: PublishParams,
    withSig: boolean = false
  ) {
    if (!this.fileOrFolderId) {
      throw new Error("File or folder Id cannot be empty");
    }
    if (!this.assetContract) {
      throw new Error(
        "AssetContract cannot be empty, please pass in through constructor"
      );
    }
    if (!this.signer) {
      throw new Error("Signer not found, please collect wallet");
    }
    const dataMonetizerBase = DataMonetizerBase__factory.connect(
      this.assetContract,
      this.signer
    );

    let receipt;
    if (!withSig) {
      const tx = await dataMonetizerBase.publish(publishParams);
      receipt = await tx.wait();
    } else {
      const signature = await this._buildPublishSignature(publishParams);
      const tx = await dataMonetizerBase.publishWithSig(
        publishParams,
        signature
      );
      receipt = await tx.wait();
    }
    const targetEvents = receipt.events?.filter(
      (e) => e.event === "AssetPublished"
    );
    if (!targetEvents || targetEvents.length === 0 || !targetEvents[0].args) {
      throw new Error("Filter Published event failed");
    }
    const assetId: string = targetEvents[0].args[0];
    this.assetId = assetId;

    return assetId;
  }

  protected async _act(actParams: ActParams, withSig: boolean = false) {
    if (!this.assetContract) {
      throw new Error(
        "AssetContract cannot be empty, please pass in through constructor"
      );
    }
    if (!this.signer) {
      throw new Error("Signer not found, please collect wallet");
    }
    const dataMonetizerBase = DataMonetizerBase__factory.connect(
      this.assetContract,
      this.signer
    );
    let receipt;
    if (!withSig) {
      const tx = await dataMonetizerBase.act(actParams);
      receipt = await tx.wait();
    } else {
      const signature = await this._buildActSignature(actParams);
      const tx = await dataMonetizerBase.actWithSig(actParams, signature);
      receipt = await tx.wait();
    }
    const targetEvents = receipt.events?.filter(
      (e) => e.event === "AssetActed"
    );
    if (!targetEvents || targetEvents.length === 0 || !targetEvents[0].args) {
      throw new Error("Filter Published event failed");
    }
    const actionReturnDatas: BytesLike[] = targetEvents[0].args[4];
    return actionReturnDatas;
  }

  protected async _addActions(
    addActionsParams: AddActionsParams,
    withSig: boolean = false
  ) {
    if (!this.assetContract) {
      throw new Error(
        "AssetContract cannot be empty, please pass in through constructor"
      );
    }
    if (!this.signer) {
      throw new Error("Signer not found, please collect wallet");
    }
    const dataMonetizerBase = DataMonetizerBase__factory.connect(
      this.assetContract,
      this.signer
    );

    if (!withSig) {
      const tx = await dataMonetizerBase.addActions(addActionsParams);
      await tx.wait();
    } else {
      const signature = await this._buildAddActionsSignature(addActionsParams);
      const tx = await dataMonetizerBase.addActionsWithSig(
        addActionsParams,
        signature
      );
      await tx.wait();
    }
  }

  protected async _checkERC20BalanceAndAllowance(
    currency: string,
    amount: BigNumberish,
    spender: string
  ) {
    const erc20 = IERC20__factory.connect(currency, this.signer!);
    const signerAddr = await this.signer!.getAddress();
    const userBalance = await erc20.balanceOf(signerAddr);
    if (userBalance.lt(amount)) {
      throw new Error("Insufficient Balance");
    }
    const allowance = await erc20.allowance(signerAddr, spender);
    if (allowance.lt(amount)) {
      const tx = await erc20.approve(spender, amount);
      await tx.wait();
    }
  }

  private async _buildPublishSignature(publishParams: PublishParams) {
    if (!this.assetContract) {
      throw new Error(
        "AssetContract cannot be empty, please pass in through constructor"
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor"
      );
    }
    if (!this.signer) {
      throw new Error("Signer not found, please collect wallet");
    }
    const dataMonetizerBase = DataMonetizerBase__factory.connect(
      this.assetContract,
      this.signer
    );
    const nonce = await dataMonetizerBase.getSigNonce(
      await this.signer.getAddress()
    );
    const { name, version } = await dataMonetizerBase.eip712Domain();

    const deadline = oneDayLater();

    const msgParams = {
      types: {
        PublishWithSig: [
          { name: "data", type: "bytes" },
          { name: "actions", type: "address[]" },
          { name: "actionInitDatas", type: "bytes[]" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" }
        ]
      },
      domain: {
        name,
        version,
        chainId: this.chainId,
        verifyingContract: this.assetContract
      },
      value: {
        data: publishParams.data,
        actions: publishParams.actions,
        actionInitDatas: publishParams.actionInitDatas,
        nonce,
        deadline
      }
    };

    const { v, r, s } = ethers.utils.splitSignature(
      await (this.signer as Wallet)._signTypedData(
        msgParams.domain,
        msgParams.types,
        msgParams.value
      )
    );

    const sig: EIP712Signature = {
      signer: await this.signer.getAddress(),
      v,
      r,
      s,
      deadline
    };

    return sig;
  }

  private async _buildActSignature(actParams: ActParams) {
    if (!this.assetContract) {
      throw new Error(
        "AssetContract cannot be empty, please pass in through constructor"
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor"
      );
    }
    if (!this.signer) {
      throw new Error("Signer not found, please collect wallet");
    }
    const dataMonetizerBase = DataMonetizerBase__factory.connect(
      this.assetContract,
      this.signer
    );
    const nonce = await dataMonetizerBase.getSigNonce(
      await this.signer.getAddress()
    );
    const { name, version } = await dataMonetizerBase.eip712Domain();

    const deadline = oneDayLater();

    const msgParams = {
      types: {
        ActWithSig: [
          { name: "assetId", type: "bytes32" },
          { name: "actions", type: "address[]" },
          { name: "actionProcessDatas", type: "bytes[]" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" }
        ]
      },
      domain: {
        name,
        version,
        chainId: this.chainId,
        verifyingContract: this.assetContract
      },
      value: {
        assetId: actParams.assetId,
        actions: actParams.actions,
        actionProcessDatas: actParams.actionProcessDatas,
        nonce,
        deadline
      }
    };

    const { v, r, s } = ethers.utils.splitSignature(
      await (this.signer as Wallet)._signTypedData(
        msgParams.domain,
        msgParams.types,
        msgParams.value
      )
    );

    const sig: EIP712Signature = {
      signer: await this.signer.getAddress(),
      v,
      r,
      s,
      deadline
    };

    return sig;
  }

  private async _buildAddActionsSignature(addActionsParams: AddActionsParams) {
    if (!this.assetContract) {
      throw new Error(
        "AssetContract cannot be empty, please pass in through constructor"
      );
    }
    if (!this.chainId) {
      throw new Error(
        "ChainId cannot be empty, please pass in through constructor"
      );
    }
    if (!this.signer) {
      throw new Error("Signer not found, please collect wallet");
    }
    const dataMonetizerBase = DataMonetizerBase__factory.connect(
      this.assetContract,
      this.signer
    );
    const nonce = await dataMonetizerBase.getSigNonce(
      await this.signer.getAddress()
    );
    const { name, version } = await dataMonetizerBase.eip712Domain();

    const deadline = oneDayLater();

    const msgParams = {
      types: {
        AddActionsWithSig: [
          { name: "assetId", type: "bytes32" },
          { name: "actions", type: "address[]" },
          { name: "actionInitDatas", type: "bytes[]" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" }
        ]
      },
      domain: {
        name,
        version,
        chainId: this.chainId,
        verifyingContract: this.assetContract
      },
      value: {
        assetId: addActionsParams.assetId,
        actions: addActionsParams.actions,
        actionInitDatas: addActionsParams.actionInitDatas,
        nonce,
        deadline
      }
    };

    const { v, r, s } = ethers.utils.splitSignature(
      await (this.signer as Wallet)._signTypedData(
        msgParams.domain,
        msgParams.types,
        msgParams.value
      )
    );

    const sig: EIP712Signature = {
      signer: await this.signer.getAddress(),
      v,
      r,
      s,
      deadline
    };

    return sig;
  }
}
