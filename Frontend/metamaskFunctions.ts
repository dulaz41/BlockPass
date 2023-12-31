import { NETWORKS as SUPPORTED_NETWORKS } from "./config/networks";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
//constants
const matic_chain_id = 80001;
const fuji_chain_id = 43113;

function FIND_NETWORK(chain: number | string) {
  const current_network: any = Object.values(SUPPORTED_NETWORKS).filter(
    (entry: any) => {
      return entry.chainId === chain;
    }
  );
  return current_network[0];
}

const switchWeb3Network = async (network: string) => {
  const { avalanche }: any = window;
  const accounts = await avalanche.request({ method: "eth_accounts" });

  try {
    await avalanche.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${Number(network).toString(16)}` }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902 || switchError.code === 32603) {
      let selected_chain = Object.values(networks).filter((entry: any) => {
        return entry.chainId === `0x${Number(network).toString(16)}`;
      });
      try {
        await avalanche.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...selected_chain[0],
            },
          ],
        });
      } catch (addError) {
        toast.error("cannot add or switch networks, please add manually");
        return null;
      }
    }

    if (switchError.code === 4001) {
      toast.error("cannot add or switch networks, please accept request");
      return null;
    }
  }

  return {
    isConnected: true,
    address: accounts[0],
    network: network,
  };
};

const checkConnection = async (setClient: any) => {
  try {
    const { avalanche }: any = window;

    if (avalanche || avalanche.isAvalanche) {
      const accounts = await avalanche.request({ method: "eth_accounts" });
      let chainId = parseInt(avalanche.chainId);
      const current_network: any = FIND_NETWORK(chainId);

      if (accounts.length > 0) {
        return setClient({
          isConnected: true,
          address: accounts[0],
          network: parseInt(avalanche.chainId),
          ...current_network,
        });
      }
      return false;
    } else {
      return toast.error("Install Core Wallet to use this app");
    }
  } catch (error: any) {
    toast.error("Install Core Wallet to use this app", {
      position: "top-right",
    });
  }
};

const connectWeb3 = async () => {
  try {
    const { avalanche }: any = window;

    if (!avalanche || !avalanche.isAvalanche) {
      toast.error("Please install Core Wallet");
      return;
    }
    const provider = new ethers.providers.Web3Provider(avalanche);
    const accounts = await provider.send("eth_requestAccounts", []);
    let network_details = await provider.getNetwork();

    return {
      isConnected: true,
      address: accounts[0],
      network: network_details.chainId,
    };
  } catch (error: any) {
    error.code === 4001 &&
      toast.error("Please accept connection request", {
        position: "top-right",
      });
  }
};

// const getSignedMaticContract = () => {
//     const { avalanche }: any = window;
//     const provider = new ethers.providers.Web3Provider(avalanche);
//     const signer = provider.getSigner();
//     // @ts-ignore
//     let ca = NETWORKS.polygon_mumbai.ca;
//     // @ts-ignore
//     let abi = NETWORKS.polygon_mumbai.abi;
//     const ct = new ethers.Contract(ca, abi, provider);
//     let signed = ct.connect(signer);
//     return signed;
// };
const getSignedContract = (chainId: any) => {
  if (!chainId) return null;
  // const current_network: any = Object.values(SUPPORTED_NETWORKS).filter((entry: any) => {
  //     return entry.chainId === chainId
  // })

  const current_network: any = FIND_NETWORK(chainId);
  const { avalanche }: any = window;
  const provider = new ethers.providers.Web3Provider(avalanche);
  const signer = provider.getSigner();

  // @ts-ignore
  let ca = current_network.ca;
  // @ts-ignore
  let abi = current_network.abi;

  const ct = new ethers.Contract(ca, abi, provider);
  let signed = ct.connect(signer);

  return signed;
};

const networks = {
  fuji: {
    chainId: `0x${Number(fuji_chain_id).toString(16)}`,
    chainName: "Fuji C-Chain",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax-test.network/ext/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io"],
  },
  polygon: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
};

export {
  checkConnection,
  connectWeb3,
  getSignedContract,
  fuji_chain_id,
  matic_chain_id,
  networks,
  switchWeb3Network,
  FIND_NETWORK,
};
