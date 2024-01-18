import {
  DataverseConnector,
  SYSTEM_CALL,
} from "@dataverse/dataverse-connector";
import { ChainId } from "../types";
import { DataAssetBase } from "./DataAssetBase";
import {
  GeneralAccessConditions,
  SourceAssetCondition,
  LinkedAssetConditions,
  SourceAssetConditionInput,
} from "./types";

export class DataAssetParser {
  dataverseConnector: DataverseConnector;

  constructor(dataverseConnector: DataverseConnector) {
    this.dataverseConnector = dataverseConnector;
  }

  async parse(fileOrFolderId: string) {
    const res = await this.dataverseConnector.runOS({
      method: SYSTEM_CALL.loadFile,
      params: fileOrFolderId,
    });

    const dataAsset =
      res.fileContent.file?.accessControl?.monetizationProvider?.dataAsset;
    const dependencies =
      res.fileContent.file?.accessControl?.monetizationProvider?.dependencies;
    const encryptionProvider =
      res.fileContent.file?.accessControl?.encryptionProvider;
    const decryptionConditions = encryptionProvider?.decryptionConditions;

    const dataAssetBase = new DataAssetBase({
      ...dataAsset,
      fileOrFolderId,
      dataverseConnector: this.dataverseConnector,
    });

    dataAssetBase.generalAccessConditions = decryptionConditions?.slice(
      -1,
    )?.[0] as GeneralAccessConditions;
    dataAssetBase.sourceAssetCondition = decryptionConditions?.slice(
      -1,
    )?.[2] as SourceAssetCondition;
    dataAssetBase.linkedAssetConditions = decryptionConditions?.slice(
      -1,
    )?.[4] as LinkedAssetConditions;

    dataAssetBase.monetizationProvider = {
      dataAsset,
      dependencies,
    };
    dataAssetBase.encryptionProvider = encryptionProvider;

    return dataAssetBase;
  }

  validateFormat(dataAssetBase: DataAssetBase) {
    if (
      // !dataAssetBase.createAssetHandler ||
      // !dataAssetBase.addGeneralCondition ||
      // !dataAssetBase.addLinkCondition ||
      // !dataAssetBase.addSourceCondition ||
      // !dataAssetBase.applyFileConditions ||
      // !dataAssetBase.applyFolderConditions ||
      // !dataAssetBase.fileOrFolderId ||
      // !dataAssetBase.dataverseConnector ||
      // !dataAssetBase.signer ||
      // !dataAssetBase.monetizationProvider ||
      // dataAssetBase.monetizationProvider.dataAsset?.assetContract !==
      //   dataAssetBase.assetContract ||
      // dataAssetBase.monetizationProvider.dataAsset?.assetId !==
      //   dataAssetBase?.assetId ||
      // dataAssetBase.monetizationProvider.dataAsset?.chainId !==
      //   dataAssetBase?.chainId ||
      !(dataAssetBase instanceof DataAssetBase) ||
      (dataAssetBase.sourceAssetCondition?.[0] as SourceAssetConditionInput)
        ?.contractAddress !== dataAssetBase?.assetContract ||
      (dataAssetBase.sourceAssetCondition?.[0] as SourceAssetConditionInput)
        ?.functionParams[0] !== dataAssetBase?.assetId ||
      (dataAssetBase.sourceAssetCondition?.[0] as SourceAssetConditionInput)
        ?.chain !== ChainId[dataAssetBase?.chainId!]
    ) {
      return false;
    }
    return true;
  }
}
