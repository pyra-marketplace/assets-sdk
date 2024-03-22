import { ChainId } from "../../types";

export const DEPLOYED_ADDRESSES = {
  [ChainId.PolygonMumbai]: {
    DataToken: "0x7bDC6b53EB04DA4787F9a501551b533A314E8fE9",
    CollectAction: "0xB587c77c7BbFebFbC57eB78869EAf8E274091f9C",
    FeeCollectModule: "0x2589B259E8521b9CD22eD16c1e760E222C147392",

    WMATIC: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    WETH: "0x3c68ce8504087f89c640d02d133646d98e64ddd9",
    USDC: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e"
  },
  [ChainId.BSCTestnet]: {
    DataToken: "",
    CollectAction: "",
    FeeCollectModule: "",

    USDT: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
    BNB: "0xEE786A1aA32fc164cca9A28F763Fbc835E748129"
  },
  [ChainId.ScrollSepolia]: {
    DataToken: "",
    CollectAction: "",
    FeeCollectModule: "",

    WETH: "0x5300000000000000000000000000000000000004",
    USDC: "0x690000EF01deCE82d837B5fAa2719AE47b156697",
    USDT: "0x551197e6350936976DfFB66B2c3bb15DDB723250"
  }
};

export const RPC = {
  // [ChainId.Ethereum]: [
  //   "https://eth.llamarpc.com",
  //   "https://rpc.ankr.com/eth",
  //   "https://eth-mainnet.public.blastapi.io"
  // ],
  // [ChainId.Polygon]: [
  //   "https://polygon.llamarpc.com",
  //   "https://polygon.rpc.blxrbdn.com",
  //   "https://polygon-bor-rpc.publicnode.com"
  // ],
  [ChainId.PolygonMumbai]: [
    "https://polygon-mumbai.blockpi.network/v1/rpc/public",
    "https://rpc.ankr.com/polygon_mumbai",
    "https://polygon-mumbai-bor-rpc.publicnode.com"
  ]
};
