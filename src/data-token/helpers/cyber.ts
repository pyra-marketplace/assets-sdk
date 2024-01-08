import { Wallet, BigNumberish, Signer, BigNumber, ethers } from "ethers";

import { Provider } from "@ethersproject/providers";
import axios from "axios";
import {
  CYBER_DOMAIN_NAME,
  CYBER_DOMAIN_VERSION,
  EMPTY_BYTES,
  ZERO_ADDRESS,
} from "../constants";
import { ProfileNFT__factory } from "../contracts";
import { Chain, ChainId, EIP712Signature } from "../types";
import { ApiConfig, DeployedContracts, RpcUrlConfig } from "../../config";
import { DataTypes } from "../contracts/Cyber/ProfileNFT";
import { oneDayLater } from "../../utils";
import { getSigByWallet } from "./signature";

export async function createCyberProfile({
  chainId,
  signer,
  handle,
  imageURI,
}: {
  chainId: ChainId;
  signer: Signer;
  handle: string;
  imageURI?: string;
}) {
  const chain = ChainId[chainId];
  const cyberProfileProxy = ProfileNFT__factory.connect(
    DeployedContracts[chain].Cyber.CyberProfileProxy,
    signer,
  );

  const params: DataTypes.CreateProfileParamsStruct = {
    to: await signer.getAddress(),
    handle,
    avatar: imageURI ?? "",
    metadata: "",
    operator: ZERO_ADDRESS,
  };
  const preData = EMPTY_BYTES;
  const postData = EMPTY_BYTES;

  const tx = await cyberProfileProxy.createProfile(params, preData, postData);
  const result = await tx.wait();
  const targetEvents = result.events?.filter(e => e.event === "CreateProfile");

  if (!targetEvents || targetEvents.length === 0 || !targetEvents[0].args) {
    throw new Error("Filter ProfileCreated event failed");
  }

  return targetEvents[0].args[1] as BigNumber;
}

export const getCyberProfiles = async ({
  chainId,
  account,
}: {
  chainId: ChainId;
  account: string;
}) => {
  const response = await axios.get(
    `${ApiConfig.CyberEventsTracker}${chainId}/profiles-info/${account}`,
  );
  if (response.data.error) {
    throw new Error(`getCyberProfiles failed, ${response.data.error}`);
  }
  const profileIds: string[] = response.data.message.map(
    (profileInfo: any) => profileInfo.profile_id as string,
  );
  return profileIds;
};

export async function getHandleByCyberProfileId({
  chainId,
  profileId,
  signerOrProvider,
}: {
  chainId: ChainId;
  profileId: BigNumberish;
  signerOrProvider?: Signer | Provider;
}) {
  const chain = ChainId[chainId];
  if (chain !== "BSCTestnet") {
    throw new Error("Unsupported Chain");
  }

  const cyberProfileProxy = ProfileNFT__factory.connect(
    DeployedContracts[chain].Cyber.CyberProfileProxy,
    signerOrProvider ??
      new ethers.providers.JsonRpcProvider(RpcUrlConfig[chain]),
  );

  const handle = await cyberProfileProxy.getHandleByProfileId(profileId);
  return handle;
}

export async function getCyberProfileIdByHandle({
  chainId,
  handle,
  signerOrProvider,
}: {
  chainId: ChainId;
  handle: string;
  signerOrProvider?: Signer | Provider;
}) {
  const chain = ChainId[chainId];
  if (chain !== "BSCTestnet") {
    throw new Error("Unsupported Chain");
  }

  const cyberProfileProxy = ProfileNFT__factory.connect(
    DeployedContracts[chain].Cyber.CyberProfileProxy,
    signerOrProvider ??
      new ethers.providers.JsonRpcProvider(RpcUrlConfig[chain]),
  );

  const profileId = await cyberProfileProxy.getProfileIdByHandle(handle);
  return profileId;
}

export const getCollectPaidMwData = async ({
  chainId,
  profileId,
  essenceId,
}: {
  chainId: ChainId;
  profileId: BigNumberish;
  essenceId: BigNumberish;
}) => {
  const response = await axios.get(
    `${ApiConfig.CyberEventsTracker}${chainId}/collect-info/${profileId}/${essenceId}`,
  );
  if (response.data.error) {
    throw new Error(`getCollectPaidMwData failed, ${response.data.error}`);
  }
  return {
    currency: response.data.message.currency,
    amount: response.data.message.amount,
  };
};

export async function _buildCyberPostSig({
  chain,
  wallet,
  profileId,
  name,
  symbol,
  essenceTokenURI,
  essenceMw,
  transferable,
  initData,
  nonce,
}: {
  chain: Chain;
  wallet: Wallet;
  profileId: BigNumberish;
  name: string;
  symbol: string;
  essenceTokenURI: string;
  essenceMw: string;
  transferable: boolean;
  initData: string;
  nonce: BigNumberish;
}) {
  const deadline = oneDayLater();

  const msgParams = {
    types: {
      registerEssenceWithSig: [
        { name: "profileId", type: "uint256" },
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "essenceTokenURI", type: "string" },
        { name: "essenceMw", type: "address" },
        { name: "transferable", type: "bool" },
        { name: "initData", type: "bytes" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    domain: {
      name: CYBER_DOMAIN_NAME,
      version: CYBER_DOMAIN_VERSION,
      chainId: await wallet.getChainId(),
      verifyingContract: DeployedContracts[chain].Cyber.CyberProfileProxy,
    },
    value: {
      profileId,
      name,
      symbol,
      essenceTokenURI,
      essenceMw,
      transferable,
      initData: initData,
      nonce: nonce,
      deadline,
    },
  };

  const { v, r, s } = await getSigByWallet(wallet, msgParams);

  const sig: Omit<EIP712Signature, "signer"> = {
    v,
    s,
    r,
    deadline,
  };
  return sig;
}

export async function _buildCyberCollectSig({
  chain,
  wallet,
  profileId,
  collector,
  essenceId,
  preData,
  postData,
  nonce,
}: {
  chain: Chain;
  wallet: Wallet;
  profileId: BigNumberish;
  collector: string;
  essenceId: BigNumberish;
  preData: string;
  postData: string;
  nonce: BigNumberish;
}) {
  const deadline = oneDayLater();

  const msgParams = {
    types: {
      collectWithSig: [
        { name: "collector", type: "address" },
        { name: "profileId", type: "uint256" },
        { name: "essenceId", type: "uint256" },
        { name: "data", type: "bytes" },
        { name: "postDatas", type: "bytes" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    domain: {
      name: CYBER_DOMAIN_NAME,
      version: CYBER_DOMAIN_VERSION,
      chainId: await wallet.getChainId(),
      verifyingContract: DeployedContracts[chain].Cyber.CyberProfileProxy,
    },
    value: {
      collector,
      profileId,
      essenceId,
      data: preData,
      postDatas: postData,
      nonce: nonce,
      deadline,
    },
  };

  const { v, r, s } = await getSigByWallet(wallet, msgParams);

  const sig: Omit<EIP712Signature, "signer"> = {
    v,
    s,
    r,
    deadline,
  };
  return sig;
}
