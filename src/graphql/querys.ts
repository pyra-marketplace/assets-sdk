import { gql, GraphQLClient } from "graphql-request";
import axios from "axios";
import APIJson from "../api.json";

const client = new GraphQLClient(APIJson.DataverseScan);

const instance = axios.create({
  baseURL: "http://127.0.0.1:8576/api/v1/*",
  timeout: 60_000
});

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export async function loadDataTokensCreatedBy(
  dataTokenCreator: string
): Promise<any> {
  const res = await instance({
    url: "/data-token",
    params: {
      publisher: dataTokenCreator
    }
  });
  return res;
}

export async function loadDataTokensCollectedBy(
  collector: string
): Promise<any> {
  const res = await instance({
    url: "/data-token",
    params: {
      collector
    }
  });
  return res;
}

export async function loadDataUnionsPublishedBy(
  publisher: string
): Promise<any> {
  const query = gql`
    query DataUnionList($publisher: String) {
      dataUnionList(publisher: $publisher) {
        data_union_id
        resource_id
        data_token
        data_token_info {
          address
          collect_info {
            collect_nft_address
            sold_list {
              owner
              token_id
            }
            sold_num
            total
            price {
              amount
              currency
              currency_addr
            }
          }
          content_uri
          owner
          source
          chain_id
          end_timestamp
          created_at
        }
        publisher
        subscribe_module
        start_block_number
        payment_token
        amount_per_block
        subscribers {
          data_union_id
          subscriber
          collect_nft
          collect_nft_token_id
          subscriptions {
            start_at
            end_at
          }
        }
        created_at
        currency
        owner
        segment
        chain_id
      }
    }
  `;

  const info: any = await client.request(query, {
    publisher: publisher
  });
  return info.dataUnionList;
}

export async function loadDataUnionsCollectedBy(
  collector: string
): Promise<any> {
  const query = gql`
    query DataUnionSubscriberList($subscriber: String) {
      dataUnionSubscriberList(subscriber: $subscriber) {
        data_union {
          data_union_id
          resource_id
          data_token
          data_token_info {
            address
            collect_info {
              collect_nft_address
              sold_list {
                owner
                token_id
              }
              sold_num
              total
              price {
                amount
                currency
                currency_addr
              }
            }
            content_uri
            owner
            source
            end_timestamp
            created_at
            chain_id
          }
          publisher
          subscribe_module
          start_block_number
          payment_token
          amount_per_block
          subscribers {
            data_union_id
            subscriber
            collect_nft
            collect_nft_token_id
            subscriptions {
              start_at
              end_at
            }
          }
          created_at
          currency
          segment
          owner
          chain_id
        }
      }
    }
  `;

  const info: any = await client.request(query, {
    subscriber: collector
  });
  const result: any = [];
  info.dataUnionSubscriberList.forEach((item: any) => {
    result.push(item.data_union);
  });

  return result;
}

// export async function isDataTokenCollectedBy(
//   dataTokenId: string,
//   collector: string,
// ): Promise<any> {
//   const query = gql`
//     query DataTokenCollector($dataTokenId: String, $collector: String) {
//       dataTokenCollectorList(dataTokenId: $dataTokenId, collector: $collector) {
//         collector
//         collect_nft
//         collect_nft_token_id
//       }
//     }
//   `;
//
//   const info: any = await client.request(query, {
//     dataTokenId: dataTokenId,
//     collector: collector,
//   });
//   return info.dataTokenCollectorList;
// }

export async function loadDataTokenCollectors(
  dataTokenId: string
): Promise<any> {
  // GetDataTokenCollectorController

  const res = await instance({
    url: "/data-token/collector",
    params: {
      asset_id: dataTokenId
    }
  });

  return res;
}

export async function loadDataUnionSubscriptionsBy(
  dataUnionId: string,
  subscriber: string
): Promise<any> {
  const query = gql`
    query DataTokenCollector($subscriber: String, $dataUnionId: String) {
      dataUnionSubscriberList(
        subscriber: $subscriber
        dataUnionId: $dataUnionId
      ) {
        data_union_id
        subscriber
        collect_nft
        collect_nft_token_id
        subscriptions {
          start_at
          end_at
        }
      }
    }
  `;

  const info: any = await client.request(query, {
    dataUnionId: dataUnionId,
    subscriber: subscriber
  });
  return info.dataUnionSubscriberList;
}

export async function loadDataUnionCollectors(
  dataUnionId: string
): Promise<any> {
  const query = gql`
    query DataUnionSubscriberList($dataUnionId: String) {
      dataUnionSubscriberList(dataUnionId: $dataUnionId) {
        data_union_id
        # data_union {
        #   subscribers {
        #     data_union_id
        #     subscriber
        #     collect_nft
        #     collect_nft_token_id
        #     subscriptions {
        #       start_at
        #       end_at
        #     }
        #   }
        #   amount_per_block
        #   payment_token
        #   start_block_number
        #   subscribe_module
        #   publisher
        #   data_token_info {
        #     address
        #     collect_info {
        #       collect_nft_address
        #       sold_list {
        #         owner
        #         token_id
        #       }
        #       sold_num
        #       total
        #       price {
        #         amount
        #         currency
        #         currency_addr
        #       }
        #     }
        #     content_uri
        #     owner
        #     source
        #   }
        #   data_token
        #   resource_id
        #   data_union_id
        # }
        subscriber
        collect_nft
        collect_nft_token_id
        subscriptions {
          start_at
          end_at
        }
      }
    }
  `;

  const info: any = await client.request(query, {
    dataUnionId: dataUnionId
  });
  return info.dataUnionSubscriberList;
}

export async function loadDataUnionSubscribers(
  dataUnionId: string
): Promise<any> {
  const query = gql`
    query DataUnionSubscriberList($dataUnionId: String) {
      dataUnionSubscriberList(dataUnionId: $dataUnionId) {
        data_union_id
        data_union {
          subscribers {
            data_union_id
            subscriber
            collect_nft
            collect_nft_token_id
            subscriptions {
              start_at
              end_at
            }
          }
          amount_per_block
          payment_token
          start_block_number
          subscribe_module
          publisher
          data_token_info {
            address
            collect_info {
              collect_nft_address
              sold_list {
                owner
                token_id
              }
              sold_num
              total
              price {
                amount
                currency
                currency_addr
              }
            }
            content_uri
            owner
            source
            chain_id
            created_at
            end_timestamp
          }
          data_token
          resource_id
          data_union_id
          chain_id
          created_at
        }
        subscriber
        collect_nft
        collect_nft_token_id
        subscriptions {
          start_at
          end_at
        }
      }
    }
  `;

  const info: any = await client.request(query, {
    dataUnionId: dataUnionId
  });
  return info.dataUnionSubscriberList;
}

export async function loadDataToken(dataTokenId: string): Promise<any> {
  const res = await instance({
    url: "/data-token",
    params: {
      asset_id: dataTokenId
    }
  });
  return res;
}

export async function loadDataUnion(dataUnionId: string): Promise<any> {
  const query = gql`
    query Query($dataUnionId: String) {
      dataUnion(dataUnionId: $dataUnionId) {
        data_union_id
        resource_id
        data_token
        data_token_info {
          address
          collect_info {
            collect_nft_address
            sold_list {
              owner
              token_id
            }
            sold_num
            total
            price {
              amount
              currency
              currency_addr
            }
          }
          content_uri
          owner
          source
          created_at
          end_timestamp
          chain_id
        }
        publisher
        subscribe_module
        start_block_number
        payment_token
        amount_per_block
        subscribers {
          subscriber
          collect_nft
          collect_nft_token_id
          subscriptions {
            start_at
            end_at
          }
        }
        created_at
        segment
        owner
        currency
      }
    }
  `;

  const info: any = await client.request(query, {
    dataUnionId: dataUnionId
  });
  return info.dataUnion;
}

export async function isDataTokenCollectedBy(
  dataTokenId: string,
  collector: string
): Promise<any> {
  const query = gql`
    query Query($collector: String, $dataTokenId: String) {
      isDataTokenCollectedBy(collector: $collector, dataTokenId: $dataTokenId) {
        is_collected
      }
    }
  `;

  const info: any = await client.request(query, {
    dataTokenId: dataTokenId,
    collector: collector
  });
  return info.isDataTokenCollectedBy.is_collected;
}

export async function isDataUnionCollectedBy(
  dataUnionId: string,
  collector: string
): Promise<any> {
  const query = gql`
    query Query($collector: String, $dataUnionId: String) {
      isDataUnionCollectedBy(collector: $collector, dataUnionId: $dataUnionId) {
        is_collected
      }
    }
  `;

  const info: any = await client.request(query, {
    dataUnionId: dataUnionId,
    collector: collector
  });
  return info.isDataUnionCollectedBy.is_collected;
}

export async function loadDataTokens(
  dataTokenIds: Array<string>
): Promise<any> {
  const res = await instance({
    url: "/data-token",
    params: {
      asset_ids: dataTokenIds
    }
  });
  return res;
}

export async function loadDataUnions(
  dataUnionIds: Array<string>
): Promise<any> {
  const query = gql`
    query Query($dataUnionIds: [String!]) {
      dataUnionList(dataUnionIds: $dataUnionIds) {
        data_union_id
        resource_id
        data_token
        data_token_info {
          address
          collect_info {
            collect_nft_address
            sold_list {
              owner
              token_id
            }
            sold_num
            total
            price {
              amount
              currency
              currency_addr
            }
          }
          content_uri
          owner
          source
          chain_id
          end_timestamp
          created_at
        }
        publisher
        subscribe_module
        start_block_number
        payment_token
        amount_per_block
        subscribers {
          data_union_id
          subscriber
          collect_nft
          collect_nft_token_id
          subscriptions {
            start_at
            end_at
          }
        }
        created_at
        currency
        owner
        segment
        chain_id
      }
    }
  `;

  const info: any = await client.request(query, {
    dataUnionIds: dataUnionIds
  });
  return info.dataUnionList;
}
