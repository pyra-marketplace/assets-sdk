export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Time: { input: any; output: any };
};

export type RootQuery = {
  __typename?: "RootQuery";
  /** List of UserActivity */
  activities: Array<Activity>;
  /** Get single DataToken */
  dataToken?: Maybe<DataToken>;
  /** List of DataToken */
  dataTokenList: Array<DataToken>;
  /** Get single DataTokenCollector */
  dataTokenCollector?: Maybe<DataToken_Collector>;
  /** List of DataTokenCollector */
  dataTokenCollectorList: Array<DataToken_Collector>;
  /** Get single DataToken */
  dappRecord?: Maybe<DappRecord>;
  /** List of DappInfo */
  dappRecordList: Array<DappRecord>;
  /** Get single DappResource */
  dappResource: Dapp_Resource;
  /** List of DappResource */
  dappResourceList: Array<Dapp_Resource>;
  /** Get single DataUnion */
  dataUnion?: Maybe<DataUnion>;
  /** List of DataUnion */
  dataUnionList: Array<DataUnion>;
  /** Get single DataUnionSubscriber */
  dataUnionSubscriber?: Maybe<Data_Union_Subscriber>;
  /** List of DataUnionSubscriber */
  dataUnionSubscriberList: Array<Data_Union_Subscriber>;
  /** Get single DataPool */
  dataPool?: Maybe<DataPool>;
  /** List of DataPool */
  dataPoolList: Array<DataPool>;
  /** Get single DataPoolSubscriber */
  dataPoolSubscriber?: Maybe<Data_Pool_Subscriber>;
  /** List of DataPoolSubscriber */
  dataPoolSubscriberList: Array<Data_Pool_Subscriber>;
  /** Check if dataUnion collected by an specific account */
  isDataUnionCollectedBy?: Maybe<Data_Union_Collect_Result>;
  /** Check if dataToken collected by an specific account */
  isDataTokenCollectedBy?: Maybe<Data_Token_Collect_Result>;
};

export type RootQueryActivitiesArgs = {
  addr: Scalars["String"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  filter?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type RootQueryDataTokenArgs = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  creator?: InputMaybe<Scalars["String"]["input"]>;
};

export type RootQueryDataTokenListArgs = {
  dataTokenId?: InputMaybe<Scalars["String"]["input"]>;
  owner?: InputMaybe<Scalars["String"]["input"]>;
  collector?: InputMaybe<Scalars["String"]["input"]>;
  dataTokenIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
  chainId?: InputMaybe<Scalars["String"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  pageNumber?: InputMaybe<Scalars["Int"]["input"]>;
};

export type RootQueryDataTokenCollectorArgs = {
  dataToken?: InputMaybe<Scalars["String"]["input"]>;
  collectNFT?: InputMaybe<Scalars["String"]["input"]>;
  collectNFTTokenId?: InputMaybe<Scalars["String"]["input"]>;
  collector?: InputMaybe<Scalars["String"]["input"]>;
};

export type RootQueryDataTokenCollectorListArgs = {
  dataTokenId?: InputMaybe<Scalars["String"]["input"]>;
  collectNFT?: InputMaybe<Scalars["String"]["input"]>;
  collector?: InputMaybe<Scalars["String"]["input"]>;
  chainId?: InputMaybe<Scalars["String"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  pageNumber?: InputMaybe<Scalars["Int"]["input"]>;
};

export type RootQueryDappRecordArgs = {
  dappId?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["String"]["input"]>;
};

export type RootQueryDappRecordListArgs = {
  dappId?: InputMaybe<Scalars["String"]["input"]>;
  administrator?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["String"]["input"]>;
  chainId?: InputMaybe<Scalars["String"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  pageNumber?: InputMaybe<Scalars["Int"]["input"]>;
};

export type RootQueryDappResourceArgs = {
  resourceId?: InputMaybe<Scalars["String"]["input"]>;
  vault?: InputMaybe<Scalars["String"]["input"]>;
};

export type RootQueryDappResourceListArgs = {
  dappId?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["String"]["input"]>;
  vault?: InputMaybe<Scalars["String"]["input"]>;
  chainId?: InputMaybe<Scalars["String"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  pageNumber?: InputMaybe<Scalars["Int"]["input"]>;
};

export type RootQueryDataUnionArgs = {
  dataUnionId?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["String"]["input"]>;
  publisher?: InputMaybe<Scalars["String"]["input"]>;
  dataToken?: InputMaybe<Scalars["String"]["input"]>;
};

export type RootQueryDataUnionListArgs = {
  dataUnionId?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["String"]["input"]>;
  publisher?: InputMaybe<Scalars["String"]["input"]>;
  dataToken?: InputMaybe<Scalars["String"]["input"]>;
  subscribeModule?: InputMaybe<Scalars["String"]["input"]>;
  dataUnionIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
  chainId?: InputMaybe<Scalars["String"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  pageNumber?: InputMaybe<Scalars["Int"]["input"]>;
};

export type RootQueryDataUnionSubscriberArgs = {
  dataUnionId?: InputMaybe<Scalars["String"]["input"]>;
  collectNFT?: InputMaybe<Scalars["String"]["input"]>;
  collectNFTTokenId?: InputMaybe<Scalars["String"]["input"]>;
};

export type RootQueryDataUnionSubscriberListArgs = {
  dataUnionId?: InputMaybe<Scalars["String"]["input"]>;
  subscriber?: InputMaybe<Scalars["String"]["input"]>;
  collectNft?: InputMaybe<Scalars["String"]["input"]>;
  chainId?: InputMaybe<Scalars["String"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  pageNumber?: InputMaybe<Scalars["Int"]["input"]>;
};

export type RootQueryDataPoolArgs = {
  dataPoolId?: InputMaybe<Scalars["String"]["input"]>;
  resourceId?: InputMaybe<Scalars["String"]["input"]>;
  publisher?: InputMaybe<Scalars["String"]["input"]>;
  dataToken?: InputMaybe<Scalars["String"]["input"]>;
};

export type RootQueryDataPoolListArgs = {
  dataPoolId?: InputMaybe<Scalars["String"]["input"]>;
  publisher?: InputMaybe<Scalars["String"]["input"]>;
  subscribeModule?: InputMaybe<Scalars["String"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
};

export type RootQueryDataPoolSubscriberArgs = {
  dataPoolId?: InputMaybe<Scalars["String"]["input"]>;
  subscriber?: InputMaybe<Scalars["String"]["input"]>;
  collectNFT?: InputMaybe<Scalars["String"]["input"]>;
  collectNFTTokenId?: InputMaybe<Scalars["String"]["input"]>;
};

export type RootQueryDataPoolSubscriberListArgs = {
  dataPoolId?: InputMaybe<Scalars["String"]["input"]>;
  subscriber?: InputMaybe<Scalars["String"]["input"]>;
  collectNFT?: InputMaybe<Scalars["String"]["input"]>;
};

export type RootQueryIsDataUnionCollectedByArgs = {
  dataUnionId?: InputMaybe<Scalars["String"]["input"]>;
  collector?: InputMaybe<Scalars["String"]["input"]>;
};

export type RootQueryIsDataTokenCollectedByArgs = {
  dataTokenId?: InputMaybe<Scalars["String"]["input"]>;
  collector?: InputMaybe<Scalars["String"]["input"]>;
};

export type DataPool = {
  __typename?: "DataPool";
  data_pool_id: Scalars["String"]["output"];
  resource_id: Scalars["String"]["output"];
  data_token: Scalars["String"]["output"];
  publisher: Scalars["String"]["output"];
  subscribe_module: Scalars["String"]["output"];
  payment_token: Scalars["String"]["output"];
  amount_per_block: Scalars["String"]["output"];
  subscribers: Array<Data_Pool_Subscriber>;
};

export type Data_Pool_Subscriber = {
  __typename?: "data_pool_subscriber";
  data_pool_id: Scalars["String"]["output"];
  subscriber: Scalars["String"]["output"];
  collect_nft: Scalars["String"]["output"];
  collect_nft_token_id: Scalars["String"]["output"];
  start_at: Scalars["String"]["output"];
  end_at: Scalars["String"]["output"];
};

export type DataUnion = {
  __typename?: "DataUnion";
  data_union_id: Scalars["String"]["output"];
  resource_id: Scalars["String"]["output"];
  data_token: Scalars["String"]["output"];
  data_token_info: DataToken;
  publisher: Scalars["String"]["output"];
  owner: Scalars["String"]["output"];
  subscribe_module: Scalars["String"]["output"];
  start_block_number: Scalars["String"]["output"];
  payment_token: Scalars["String"]["output"];
  amount_per_block: Scalars["String"]["output"];
  currency: Scalars["String"]["output"];
  segment: Scalars["String"]["output"];
  subscribers: Array<Data_Union_Subscriber>;
  chain_id: Scalars["String"]["output"];
  created_at: Scalars["String"]["output"];
};

export type Data_Union_Subscriber = {
  __typename?: "data_union_subscriber";
  data_union_id: Scalars["String"]["output"];
  data_union: DataUnion;
  subscriber: Scalars["String"]["output"];
  collect_nft: Scalars["String"]["output"];
  collect_nft_token_id: Scalars["String"]["output"];
  subscriptions: Array<Data_Union_Subscription>;
  chain_id: Scalars["String"]["output"];
};

export type Data_Union_Subscription = {
  __typename?: "data_union_subscription";
  start_at: Scalars["String"]["output"];
  end_at: Scalars["String"]["output"];
};

export type DappRecord = {
  __typename?: "DappRecord";
  dapp_id: Scalars["String"]["output"];
  administrator: Scalars["String"]["output"];
  resources: Array<Dapp_Resource>;
  chain_id: Scalars["String"]["output"];
  created_at: Scalars["String"]["output"];
};

export type Dapp_Resource = {
  __typename?: "dapp_resource";
  resource_id: Scalars["String"]["output"];
  dapp_id: Scalars["String"]["output"];
  vault: Scalars["String"]["output"];
  fee_point: Scalars["String"]["output"];
  created_at: Scalars["String"]["output"];
};

export type Activity = {
  __typename?: "activity";
  content: Activity_Content;
  data_token_info: DataToken;
  timestamp: Scalars["Float"]["output"];
  type: Scalars["String"]["output"];
  user_address: Scalars["String"]["output"];
};

export type Activity_Content = {
  __typename?: "activity_content";
  data_token_address: Scalars["String"]["output"];
  from?: Maybe<Scalars["String"]["output"]>;
  to?: Maybe<Scalars["String"]["output"]>;
};

export type DataToken = {
  __typename?: "DataToken";
  address: Scalars["String"]["output"];
  collect_info: Collect_Info;
  content_uri: Scalars["String"]["output"];
  owner: Scalars["String"]["output"];
  source: Scalars["String"]["output"];
  chain_id: Scalars["String"]["output"];
  created_at: Scalars["String"]["output"];
  end_timestamp: Scalars["String"]["output"];
};

export type Collect_Info = {
  __typename?: "collect_info";
  collect_nft_address: Scalars["String"]["output"];
  sold_list: Array<Collect_Nft>;
  sold_num: Scalars["String"]["output"];
  total: Scalars["String"]["output"];
  price: Price;
};

export type DataToken_Collector = {
  __typename?: "dataToken_collector";
  collector: Scalars["String"]["output"];
  dataToken: DataToken;
  collect_nft: Scalars["String"]["output"];
  collect_nft_token_id: Scalars["String"]["output"];
  created_at: Scalars["String"]["output"];
  chain_id: Scalars["String"]["output"];
};

export type Price = {
  __typename?: "price";
  amount: Scalars["String"]["output"];
  currency: Scalars["String"]["output"];
  currency_addr: Scalars["String"]["output"];
};

export type Collect_Nft = {
  __typename?: "collect_nft";
  owner: Scalars["String"]["output"];
  token_id: Scalars["String"]["output"];
};

export type Data_Union_Collect_Result = {
  __typename?: "data_union_collect_result";
  is_collected: Scalars["Boolean"]["output"];
};

export type Data_Token_Collect_Result = {
  __typename?: "data_token_collect_result";
  is_collected: Scalars["Boolean"]["output"];
};
