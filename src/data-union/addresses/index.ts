import { ChainId } from "../../types";

export const DEPLOYED_ADDRESSES = {
  [ChainId.PolygonMumbai]: {
    DataUnion: "0x6fcb6823a013C2D563C834E10455aA81169a7226",
    CollectAction: "0x6BBF2eD1efF82bf0910B0DEa1096c79aD348B3eA",
    FeeCollectModule: "0xb0cd483c4de8Ddff6D1e7d6E44C0B7F091CE3575",
    SubscribeAction: "0xe47c5F5e81b6D8d6efFb1279c67933085Afb5dEB",
    MonthlySubscribeModule: "0x661E1Fe30cb1146046667B439FA77495254Fde5d",

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
