import { ethers } from 'ethers';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { NetData, NETWORKS } from '../config/networks';
import { FIND_NETWORK } from '../metamaskFunctions';

const AppContext: any = createContext({
  events: null,
  GetAllMaticEvents: null,
  GetAllFilecoinEvents: null,
});
export const useApp = () => {
  return useContext(AppContext);
};

export default function AppContextProvider({ children }: { children: any }) {
  const [error, setError] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  const GetAllEvents = useCallback(async () => {
    let filecoinEvents: any[] = await GetAllChainEvents(NETWORKS.fil_testnet);
    let mumbaiEvents: any[] = await GetAllChainEvents(NETWORKS.polygon_mumbai);
    let fantomEvents: any[] = await GetAllChainEvents(NETWORKS.ftm_testnet);

    let newArr: any[] = [];
    if (filecoinEvents) {
      newArr = [...filecoinEvents];
    }
    if (mumbaiEvents) {
      newArr = newArr.concat(mumbaiEvents);
    }
    if (fantomEvents) {
      newArr = newArr.concat(fantomEvents);
    }

    console.log(filecoinEvents, 'filecoin');
    console.log(fantomEvents, 'fantomcoin');
    console.log(mumbaiEvents, 'mumbai');

    return setEvents(newArr);
  }, []);

  async function GetAllChainEvents(network_chain: NetData) {
    try {
      const provider = new ethers.providers.StaticJsonRpcProvider(
        network_chain.rpc
      );
      let network = FIND_NETWORK(network_chain.chainId); //chain id
      const ct = new ethers.Contract(network.ca, network.abi, provider);
      let d = await ct.allEvents();
      return d;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    GetAllEvents();
  }, [GetAllEvents]);

  return (
    <AppContext.Provider value={{ events, GetAllChainEvents, GetAllEvents }}>
      {children}
    </AppContext.Provider>
  );
}
