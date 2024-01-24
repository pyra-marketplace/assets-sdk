import { ChainId } from "../../types";

export const DEPLOYED_ADDRESSES = {
  [ChainId.PolygonMumbai]: {
    DataUnion: "0xa5B1689f622D9230ACc7a1738000BcEe66701d37",
    CollectAction: "0x8926e00660303752870ae196Dd636498becC3711",
    FeeCollectModule: "0x846309529630794506097932A8ceae20f1E7c373",
    SubscribeAction: "0x62440c487e1DC3aB08cB9FBcB24Cc90a5C6e1306",
    MonthlySubscribeModule: "0xcb8e99DcE9E26fF6A51Dc51B2ca1b8274d4C6b58",

    WMATIC: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    WETH: "0x3c68ce8504087f89c640d02d133646d98e64ddd9",
    USDC: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e",
    DAI: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
  },
  [ChainId.BSCTestnet]: {
    DataUnion: "",
    CollectAction: "",
    FeeCollectModule: "",
    SubscribeAction: "",
    MonthlySubscribeModule: "",

    USDT: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
    BNB: "0xEE786A1aA32fc164cca9A28F763Fbc835E748129",
    CCT: "0xce91C2bbEdfda8A120fD4884d720725E5E1D7d30",
    LINK: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
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
