import { ChainId } from "../../types";

export const DEPLOYED_ADDRESSES = {
  [ChainId.PolygonMumbai]: {
    DataToken: "0x8EaE24862BF8c1656486D5Cf49F0AE780a93d695",
    CollectAction: "0xC27e4Ac7EBc02866196055BcFFBE8d0d05B185CB",
    FeeCollectModule: "0x59bE42237222d11F0761a78162daE9f1a8450Cdb",

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
  },
  [ChainId.Base]: {
    DataToken: "",
    CollectAction: "",
    FeeCollectModule: "",

    WETH: "0x4200000000000000000000000000000000000006",
    USDC: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
  },
  [ChainId.BaseSepolia]: {
    DataToken: "0xD3ba62d203D8B8Be795e6f1F77bb71948B0a8205",
    CollectAction: "0x8325A514ef2A8Af1B2B02F418E108207B6a45DA5",
    FeeCollectModule: "0xcF9E24E4F808bC017493D5fCF9BA685182D87352",

    WETH: "0x4200000000000000000000000000000000000006"
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
  ],
  [ChainId.Base]: [
    "https://base-rpc.publicnode.com",
    "https://base.blockpi.network/v1/rpc/public",
    "https://base.llamarpc.com"
  ],
  [ChainId.BaseSepolia]: [
    "https://public.stackup.sh/api/v1/node/base-sepolia",
    "https://base-sepolia.blockpi.network/v1/rpc/public",
    "https://base-sepolia-rpc.publicnode.com"
  ]
};
