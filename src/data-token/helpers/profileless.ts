import { BigNumberish, Wallet } from "ethers";

import {
  PROFILELESS_DOMAIN_NAME,
  PROFILELESS_DOMAIN_VERSION,
} from "../constants";
import { Chain, EIP712Signature } from "../types";
import { DeployedContracts } from "../../config";
import { oneDayLater } from "../../utils";
import { getSigByWallet } from "./signature";

export const _buildProfilelessPostSig = async ({
  chain,
  wallet,
  contentURI,
  collectModule,
  collectModuleInitData,
  nonce,
}: {
  chain: Chain;
  wallet: Wallet;
  contentURI: string;
  collectModule: string;
  collectModuleInitData: string;
  nonce: number;
}) => {
  const deadline = oneDayLater();

  const msgParams = {
    types: {
      PostWithSig: [
        { name: "contentURI", type: "string" },
        { name: "collectModule", type: "address" },
        { name: "collectModuleInitData", type: "bytes" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    domain: {
      name: PROFILELESS_DOMAIN_NAME,
      version: PROFILELESS_DOMAIN_VERSION,
      chainId: await wallet.getChainId(),
      verifyingContract: DeployedContracts[chain].Profileless.ProfilelessHub,
    },
    value: {
      contentURI,
      collectModule,
      collectModuleInitData,
      nonce,
      deadline,
    },
  };

  const { v, r, s } = await getSigByWallet(wallet, msgParams);
  const sig: EIP712Signature = {
    signer: await wallet.getAddress(),
    v,
    r,
    s,
    deadline,
  };

  return sig;
};

export const _buildProfilelessCollectSig = async ({
  chain,
  wallet,
  pubId,
  collectModuleValidateData,
  nonce,
}: {
  chain: Chain;
  wallet: Wallet;
  pubId: BigNumberish;
  collectModuleValidateData: string;
  nonce: number;
}) => {
  const deadline = oneDayLater();

  const msgParams = {
    types: {
      CollectWithSig: [
        { name: "pubId", type: "uint256" },
        { name: "collectModuleValidateData", type: "bytes" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    domain: {
      name: PROFILELESS_DOMAIN_NAME,
      version: PROFILELESS_DOMAIN_VERSION,
      chainId: await wallet.getChainId(),
      verifyingContract: DeployedContracts[chain].Profileless.ProfilelessHub,
    },
    value: {
      pubId,
      collectModuleValidateData,
      nonce,
      deadline,
    },
  };

  const { v, r, s } = await getSigByWallet(wallet, msgParams);
  const sig: EIP712Signature = {
    signer: await wallet.getAddress(),
    v,
    r,
    s,
    deadline,
  };

  return sig;
};
