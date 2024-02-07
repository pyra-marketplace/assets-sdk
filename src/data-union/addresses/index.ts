import { ChainId } from "../../types";

export const DEPLOYED_ADDRESSES = {
  [ChainId.PolygonMumbai]: {
    DataUnion: "0xf2d039A7E210DF6885f76EC3bAB8a79773AbaeD0",
    CollectAction: "0x96eDBC4728aBad818baF72FB13C280C5CBA76188",
    FeeCollectModule: "0x854C2c7B4bF9dFcC7700B61FBBED4eCFB1a35a52",
    SubscribeAction: "0xB60e1bA92d9B4ED493f6353fFE4Fabd1D622f400",
    MonthlySubscribeModule: "0xb4421374638493f92607E3167859f6ec5A696952",

    WMATIC: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    WETH: "0x3c68ce8504087f89c640d02d133646d98e64ddd9",
    USDC: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e",
  },
  [ChainId.BSCTestnet]: {
    DataUnion: "",
    CollectAction: "",
    FeeCollectModule: "",
    SubscribeAction: "",
    MonthlySubscribeModule: "",

    BNB: "0xEE786A1aA32fc164cca9A28F763Fbc835E748129",
    USDT: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
  },
  [ChainId.ScrollSepolia]: {
    DataUnion: "",
    CollectAction: "",
    FeeCollectModule: "",
    SubscribeAction: "",
    MonthlySubscribeModule: "",

    WETH: "0x5300000000000000000000000000000000000004",
    USDC: "0x690000EF01deCE82d837B5fAa2719AE47b156697",
    USDT: "0x551197e6350936976DfFB66B2c3bb15DDB723250",
  },
};
