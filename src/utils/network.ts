import { Connector } from "@meteor-web3/connector";
import { RPC } from "../data-token/configs";
import { ChainId } from "../types";

export async function switchNetwork({
  connector,
  chainId
}: {
  connector: Connector;
  chainId: number;
}) {
  const provider = connector.getProvider();
  const chainIdHex = `0x${chainId.toString(16)}`;
  try {
    await connector.getProvider().request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }]
    });
  } catch (error: any) {
    if (error.code === 4902) {
      // if (chainIdHex === "0x89") {
      //   await provider.request?.({
      //     method: "wallet_addEthereumChain",
      //     params: [
      //       {
      //         chainId: "0x89",
      //         chainName: "Polygon Mainnet",
      //         rpcUrls: RPC[ChainId.Polygon],
      //         nativeCurrency: {
      //           name: "MATIC",
      //           symbol: "MATIC",
      //           decimals: 18
      //         },
      //         blockExplorerUrls: ["https://polygonscan.com"]
      //       }
      //     ]
      //   });
      // } else
      if (chainIdHex === "0x13881") {
        await provider.request?.({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x13881",
              chainName: "Mumbai",
              rpcUrls: RPC[ChainId.PolygonMumbai],
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18
              },
              blockExplorerUrls: ["https://mumbai.polygonscan.com"]
            }
          ]
        });
      } else {
        throw new Error(
          "Unrecognized chain ID. Try adding the chain from https://chainlist.org"
        );
      }
    } else {
      throw error;
    }
  }
}
