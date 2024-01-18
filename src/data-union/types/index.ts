import { IDataUnion } from "../abi/typechain/DataUnion";

export type UnionAsset = IDataUnion.UnionAssetStruct;

// import { BigNumber, BigNumberish, BytesLike } from "ethers";
// import { CreateDataTokenInput, GraphType } from "../../data-token";

// export type SubscribeModule =
//   | "BlockSubscribeModule"
//   | "TimeSegmentSubscribeModule";

// export type Currency = "DVC";

// export type TimeSegment = "Week" | "Month";

// export interface PublishDataUnionInput {
//   createDataTokenInput: CreateDataTokenInput<GraphType.Profileless>;
//   resourceId: string;
//   subscribeModule: SubscribeModule;
//   subscribeModuleInput: {
//     currency: Currency;
//     amount: BigNumberish;
//     segment?: TimeSegment;
//   };
// }

// export interface PublishDataUnionOutput {
//   dataUnionId: BytesLike;
//   publisher: string;
//   resourceId: string;
//   dataToken: string;
//   subscribeModule: string;
//   startBlockNumber: BigNumber;
// }

// export interface CloseDataUnionOutput {
//   dataUnionId: BytesLike;
//   operator: string;
//   endBlockNumber: BigNumber;
// }

// export interface CollectDataUnionOutput {
//   dataUnionId: BytesLike;
//   dataToken: string;
//   collectTokenId: BigNumber;
// }

// export interface SubscribeDataUnionInput {
//   dataUnionId: BytesLike;
//   collectTokenId: BigNumberish;
//   subscribeInput: {
//     startAt?: BigNumberish;
//     endAt?: BigNumberish;
//     segmentsCount?: BigNumberish;
//   };
// }

// export interface SubscribeDataUnionOutput {
//   dataUnionId: BytesLike;
//   collectTokenId: BigNumber;
//   subscribeModule: string;
//   startAt: BigNumber;
//   endAt: BigNumber;
// }

// export {
//   DataUnion as DataUnionGraphType,
//   Data_Union_Subscriber,
// } from "../../graphql/types";
