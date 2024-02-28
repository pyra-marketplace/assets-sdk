import { ChainId } from "../../types";

export const DEPLOYED_ADDRESSES = {
  [ChainId.PolygonMumbai]: {
    DataToken: "0xF1e21f851D6aB7A550e2b72F0b2CD595b334d735",
    CollectAction: "0x0959AE66a6f26c9A3d28D145f30a8AbC2Fa874B3",
    FeeCollectModule: "0x8065e8fa8940681a8e340A531b543eAaF03C84e9",

    WMATIC: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    WETH: "0x3c68ce8504087f89c640d02d133646d98e64ddd9",
    USDC: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e",
  },
  [ChainId.BSCTestnet]: {
    DataToken: "",
    CollectAction: "",
    FeeCollectModule: "",

    USDT: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
    BNB: "0xEE786A1aA32fc164cca9A28F763Fbc835E748129",
  },
  [ChainId.ScrollSepolia]: {
    DataToken: "",
    CollectAction: "",
    FeeCollectModule: "",

    WETH: "0x5300000000000000000000000000000000000004",
    USDC: "0x690000EF01deCE82d837B5fAa2719AE47b156697",
    USDT: "0x551197e6350936976DfFB66B2c3bb15DDB723250",
  },
};
