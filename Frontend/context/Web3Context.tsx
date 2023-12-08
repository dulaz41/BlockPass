import { createContext, useContext, useEffect, useState } from 'react';
import {
  checkConnection,
  connectWeb3,
  switchWeb3Network,
} from '../metamaskFunctions';

const Web3Context: any = createContext({
  client: null,
  connectWallet: null,
  switchNetworks: null,
});
export const useWeb3 = () => {
  return useContext(Web3Context);
};

export default function Web3ContextProvider({ children }: { children: any }) {
  const [client, setClient] = useState(false);

  //switch metamask network here
  async function switchNetworks(network: any) {
    let connection_data: any = await switchWeb3Network(network);
    if (connection_data) {
      setClient({ ...connection_data, ...network });
    }
  }

  //connect to metamask here
  async function connectWallet(network: any) {
    let connection_data = await connectWeb3();
    if (connection_data) {
      switch (connection_data.network) {
        case network.chainId:
          setClient({ ...connection_data, ...network });
          break;

        default:
          switchNetworks(network.chainId);
          break;
      }
    }
  }

  function handleNetworkChanged() {
    checkConnection(setClient);
  }

  useEffect(() => {
    checkConnection(setClient);
    if (window) {
      const { ethereum }: any = window;
      ethereum?.on('chainChanged', handleNetworkChanged);
    }

    return () => {
      //@ts-ignore
      window?.ethereum?.removeListener('chainChanged', handleNetworkChanged);
    };
  }, []);

  return (
    <Web3Context.Provider value={{ client, connectWallet, switchNetworks }}>
      {children}
    </Web3Context.Provider>
  );
}
