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
  GetAllFujiEvents: null,
});
export const useApp = () => {
  return useContext(AppContext);
};

export default function AppContextProvider({ children }: { children: any }) {
  const [error, setError] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  const GetAllEvents = useCallback(async () => {
    let fujiEvents: any[] = await GetAllChainEvents(NETWORKS.fuji_testnet);
    let mumbaiEvents: any[] = await GetAllChainEvents(NETWORKS.polygon_mumbai);

    let newArr: any[] = [];
    if (fujiEvents) {
      newArr = [...fujiEvents];
    }
    if (mumbaiEvents) {
      newArr = newArr.concat(mumbaiEvents);
    }

    console.log(fujiEvents, 'Fuji');
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
      let d = await ct.allBlockPassList();
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
