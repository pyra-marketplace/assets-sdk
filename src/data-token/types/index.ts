import { IDataToken } from "../abi/typechain/DataToken";

export type TokenAsset = IDataToken.TokenAssetStruct;

export type Actions = "CollectAction" | "ShareAction";

export enum TradeType {
  Buy,
  Sell,
}
