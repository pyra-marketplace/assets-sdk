import { ChainId } from "../../types";

export const DEPLOYED_ADDRESSES = {
  [ChainId.PolygonMumbai]: {
    DataToken: "0x4767ec46b9f3e4830feCe251eFE923D8aA992632",
    CollectAction: "0x558F4fd941726518387eDF9B445D14820AfA5904",
    FeeCollectModule: "0x01C0A09Ac3c11b7aa693F40dd35575f21a2db67d",
    ShareAction: "0xFfb0E2E04439d242bf585a48B1fD567986cbA6ee",
    DefaultCurve: "0xefB2Bda58822EeeCFC5713E6B67592daCbfd8059",

    WMATIC: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    WETH: "0x3c68ce8504087f89c640d02d133646d98e64ddd9",
    USDC: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e",
    DAI: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
  },
  [ChainId.BSCTestnet]: {
    DataToken: "",
    CollectAction: "",
    FeeCollectModule: "",
    ShareAction: "",
    DefaultCurve: "",

    USDT: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
    BNB: "0xEE786A1aA32fc164cca9A28F763Fbc835E748129",
    CCT: "0xce91C2bbEdfda8A120fD4884d720725E5E1D7d30",
    LINK: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
  },
  [ChainId.ScrollSepolia]: {
    DataToken: "",
    CollectAction: "",
    FeeCollectModule: "",
    ShareAction: "",
    DefaultCurve: "",

    WETH: "0x5300000000000000000000000000000000000004",
    USDC: "0x690000EF01deCE82d837B5fAa2719AE47b156697",
    USDT: "0x551197e6350936976DfFB66B2c3bb15DDB723250",
  },
};
