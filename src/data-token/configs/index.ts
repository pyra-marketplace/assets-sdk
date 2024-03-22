import { ChainId } from "../../types";

export const DEPLOYED_ADDRESSES = {
  [ChainId.PolygonMumbai]: {
    DataToken: "0x7777B55eee5E32a9043A28625eD7A8D0D57aF319",
    CollectAction: "0x86464dAf428e3c8874747D8CCeF572622A70c98f",
    FeeCollectModule: "0xEf102d43982c6295B152A0F39c59C8cb19FF4060",

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
