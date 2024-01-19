import { ChainId } from "../../types";

export const DEPLOYED_ADDRESSES = {
  [ChainId.PolygonMumbai]: {
    DataToken: "",
    CollectAction: "",
    ShareAction: "",
    FeeCollectModule: "",
    DefaultCurve: "",

    WMATIC: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    WETH: "0x3c68ce8504087f89c640d02d133646d98e64ddd9",
    USDC: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e",
    DAI: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
  },
  [ChainId.BSCTestnet]: {
    DataToken: "",
    CollectAction: "",
    ShareAction: "",
    FeeCollectModule: "",
    DefaultCurve: "",

    USDT: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
    BNB: "0xEE786A1aA32fc164cca9A28F763Fbc835E748129",
    CCT: "0xce91C2bbEdfda8A120fD4884d720725E5E1D7d30",
    LINK: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
  },
  [ChainId.ScrollSepolia]: {
    DataToken: "",
    CollectAction: "",
    ShareAction: "",
    FeeCollectModule: "",
    DefaultCurve: "",

    WETH: "0x5300000000000000000000000000000000000004",
    USDC: "0x690000EF01deCE82d837B5fAa2719AE47b156697",
    USDT: "0x551197e6350936976DfFB66B2c3bb15DDB723250",
  },
};
