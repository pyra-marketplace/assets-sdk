import {
  DataverseConnector,
  SYSTEM_CALL,
} from "@dataverse/dataverse-connector";
import { ChainId } from "../types";
import { DataAssetBase } from "./DataAssetBase";
import {
  GeneralAccessConditions,
  SourceAssetConditions,
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
    dataAssetBase.sourceAssetConditions = decryptionConditions?.slice(
      -1,
    )?.[2] as SourceAssetConditions;
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
    if (!(dataAssetBase instanceof DataAssetBase)) {
      return false;
    }
    return !dataAssetBase.sourceAssetConditions?.find(
      sourceAssetCondition =>
        (sourceAssetCondition as SourceAssetConditionInput[])[0]
          ?.functionParams[0] !== dataAssetBase?.assetId ||
        (sourceAssetCondition as SourceAssetConditionInput[])[0]?.chain !==
          ChainId[dataAssetBase?.chainId!],
    );
  }
}
