import { Wallet, BigNumberish, BytesLike, ethers, BigNumber } from "ethers";
import { gql, GraphQLClient } from "graphql-request";
import { LENS_DOMAIN_NAME, LENS_DOMAIN_VERSION } from "../constants";
import { Chain, ChainId, EIP712Signature } from "../types";
import { DeployedContracts, ApiConfig, RpcUrlConfig } from "../../config";
import { getChainByChainId, oneDayLater } from "../../utils";
import { getSigByWallet } from "./signature";

function getLensGqlClient(chainId: ChainId) {
  if (chainId === ChainId.PolygonMumbai) {
    return new GraphQLClient(ApiConfig.LensV2Mumbai);
  } else {
    throw new Error("Unsupported network");
  }
}

export async function getLensProfiles({
  chainId,
  account,
}: {
  chainId: ChainId;
  account: string;
}) {
  const lensGqlClient = getLensGqlClient(chainId);

  const query = gql`
    query Profiles($request: ProfilesRequest!) {
      profiles(request: $request) {
        items {
          id
        }
      }
    }
  `;
  const result: any = await lensGqlClient.request(query, {
    request: {
      where: {
        ownedBy: [account],
      },
    },
  });

  const profileIds = result.profiles.items.map((item: any) => {
    return item.id;
  });

  return profileIds as string[];
}

export async function createLensProfile({
  chainId,
  handle,
  to,
}: {
  chainId: ChainId;
  handle: string;
  to: string;
}) {
  if (chainId !== ChainId.PolygonMumbai) {
    throw new Error("Unsupported network");
  }
  const PROFILE_CREATED_EVENT_HASH =
    "0xf642d82f9bf073e3403d88853e8ee1a91d4fff05e11bcdf593f09ce442c6b247";

  const lensGqlClient = getLensGqlClient(chainId);

  const query = gql`
    mutation CreateProfileWithHandle(
      $request: CreateProfileWithHandleRequest!
    ) {
      createProfileWithHandle(request: $request) {
        ... on RelaySuccess {
          txHash
        }
        ... on CreateProfileWithHandleErrorResult {
          reason
        }
      }
    }
  `;

  const result: any = await lensGqlClient.request(query, {
    request: {
      to,
      handle,
    },
  });

  const txHash = result.createProfileWithHandle.txHash;

  const chain = getChainByChainId(chainId);
  const provider = new ethers.providers.JsonRpcProvider(RpcUrlConfig[chain]);
  let txRes;
  try {
    while (!txRes) {
      txRes = await provider.getTransactionReceipt(txHash);
    }
  } catch (e) {
    throw new Error(`getTransactionReceipt failed for txHash ${txHash}, ${e}`);
  }
  let profileId: string | undefined;
  txRes.logs.map(log => {
    if (log.topics[0] === PROFILE_CREATED_EVENT_HASH) {
      profileId = log.topics[1];
    }
  });
  if (profileId) {
    return BigNumber.from(profileId).toHexString();
  } else {
    throw new Error("Filter ProfileCreated event failed");
  }
}

export async function getLensProfileIdByHandle({
  chainId,
  handle,
}: {
  chainId: ChainId;
  handle: string;
}) {
  const lensGqlClient = getLensGqlClient(chainId);

  const query = gql`
    query Profiles($request: ProfilesRequest!) {
      profiles(request: $request) {
        items {
          id
        }
      }
    }
  `;
  const result: any = await lensGqlClient.request(query, {
    request: {
      where: {
        handles: [handle],
      },
    },
  });

  if (result.profiles.items.length !== 0) {
    return result.profiles.items[0].id as string;
  }
}

export async function getHandleByLensProfileId({
  chainId,
  profileId,
}: {
  chainId: ChainId;
  profileId: BigNumberish;
}) {
  const lensGqlClient = getLensGqlClient(chainId);

  const query = gql`
    query Profiles($request: ProfilesRequest!) {
      profiles(request: $request) {
        items {
          handle {
            fullHandle
          }
        }
      }
    }
  `;
  const result: any = await lensGqlClient.request(query, {
    request: {
      where: {
        profileIds: [profileId.toString()],
      },
    },
  });

  if (result.profiles.items.length !== 0) {
    return result.profiles.items[0].handle?.fullHandle as string;
  }
}

export async function _buildLensPostSig({
  chain,
  wallet,
  profileId,
  contentURI,
  actionModules,
  actionModulesInitDatas,
  referenceModule,
  referenceModuleInitData,
  nonce,
}: {
  chain: Chain;
  wallet: Wallet;
  profileId: BigNumberish;
  contentURI: string;
  actionModules: string[];
  actionModulesInitDatas: BytesLike[];
  referenceModule: string;
  referenceModuleInitData: BytesLike;
  nonce: number;
}) {
  const deadline = oneDayLater();

  const msgParams = {
    types: {
      Post: [
        { name: "profileId", type: "uint256" },
        { name: "contentURI", type: "string" },
        { name: "actionModules", type: "address[]" },
        { name: "actionModulesInitDatas", type: "bytes[]" },
        { name: "referenceModule", type: "address" },
        { name: "referenceModuleInitData", type: "bytes" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    domain: {
      name: LENS_DOMAIN_NAME,
      version: LENS_DOMAIN_VERSION,
      chainId: await wallet.getChainId(),
      verifyingContract: DeployedContracts[chain].Lens.LensHubProxy,
    },
    value: {
      profileId,
      contentURI,
      actionModules,
      actionModulesInitDatas,
      referenceModule,
      referenceModuleInitData,
      nonce,
      deadline,
    },
  };

  const { v, r, s } = await getSigByWallet(wallet, msgParams);

  const sig: EIP712Signature = {
    signer: await wallet.getAddress(),
    v,
    s,
    r,
    deadline,
  };
  return sig;
}

export async function _buildLensCollectSig({
  chain,
  wallet,
  publicationActedProfileId,
  publicationActedId,
  actorProfileId,
  referrerProfileIds,
  referrerPubIds,
  actionModuleAddress,
  actionModuleData,
  nonce,
}: {
  chain: Chain;
  wallet: Wallet;
  publicationActedProfileId: BigNumberish;
  publicationActedId: BigNumberish;
  actorProfileId: BigNumberish;
  referrerProfileIds: BigNumberish[];
  referrerPubIds: BigNumberish[];
  actionModuleAddress: string;
  actionModuleData: BytesLike;
  nonce: number;
}) {
  const deadline = oneDayLater();

  const msgParams = {
    types: {
      Act: [
        { name: "publicationActedProfileId", type: "uint256" },
        { name: "publicationActedId", type: "uint256" },
        { name: "actorProfileId", type: "uint256" },
        { name: "referrerProfileIds", type: "uint256[]" },
        { name: "referrerPubIds", type: "uint256[]" },
        { name: "actionModuleAddress", type: "address" },
        { name: "actionModuleData", type: "bytes" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    domain: {
      name: LENS_DOMAIN_NAME,
      version: LENS_DOMAIN_VERSION,
      chainId: await wallet.getChainId(),
      verifyingContract: DeployedContracts[chain].Lens.LensHubProxy,
    },
    value: {
      publicationActedProfileId,
      publicationActedId,
      actorProfileId,
      referrerProfileIds,
      referrerPubIds,
      actionModuleAddress,
      actionModuleData,
      nonce,
      deadline,
    },
  };

  const { v, r, s } = await getSigByWallet(wallet, msgParams);

  const signature: EIP712Signature = {
    signer: await wallet.getAddress(),
    v,
    s,
    r,
    deadline,
  };
  return signature;
}
