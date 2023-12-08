import { Box, Center, Icon, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import { FaExclamation } from 'react-icons/fa';
import { NETWORKS } from '../../config/networks';
import { useWeb3 } from '../../context/Web3Context';
import LoadingSpinner from '../Alerts/LoadingSpinner';
import NoWalletAlert from '../Alerts/NoWalletAlert';
// Replace with your Alchemy API key:
const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const baseURL = `https://polygon-mumbai.g.alchemy.com/v2/${apiKey}`;
const axiosURL = `${baseURL}`;

function MyEvents() {
  const { client }: any = useWeb3();
  const [events, setEvents] = useState<{ loading: boolean; events: any[] }>({
    loading: true,
    events: [],
  });

  const fetchEvents = useCallback(async () => {
    let Mrpc: string = 'https://polygon-mumbai.g.alchemy.com/v2/' + apiKey;
    let Frpc: string = 'https://api.hyperspace.node.glif.io/rpc/v1';

    const Mprovider = new ethers.providers.JsonRpcProvider(Mrpc);
    let Mca = NETWORKS.polygon_mumbai.ca;
    let Mabi = NETWORKS.polygon_mumbai.abi;

    const Fprovider = new ethers.providers.JsonRpcProvider(Frpc);
    let Fca = NETWORKS.fil_testnet.ca;
    let Fabi = NETWORKS.fil_testnet.abi;

    const Mct = new ethers.Contract(Mca, Mabi, Mprovider);
    const Fct = new ethers.Contract(Fca, Fabi, Fprovider);
    try {
      let Mevents = await Mct.bookedEvents(client.address, 1);
      let Fevents = await Fct.bookedEvents(client.address, 1);

      return setEvents(() => {
        return { loading: false, events: [...Mevents, ...Fevents] };
      });
    } catch (error) {
      return setEvents((prev) => {
        return { loading: false, events: prev.events };
      });
    }
  }, [client.address]);

  useEffect(() => {
    if (client) {
      fetchEvents();
    }
  }, [client, fetchEvents]);

  return (
    <>
      {!client && <NoWalletAlert />}

      {/* {client && !events.loading && events.events.length > 0 && <TicketsGrid nft={events.events} />} */}
      {!events.loading && events.events && events.events.length === 0 && (
        <Center flexDir='column' p='5' gap='3'>
          <Icon as={FaExclamation} fontSize='30px' />
          <Text fontSize='lg'>You haven&apos;t created any events yet!</Text>
        </Center>
      )}
      {events.loading && <LoadingSpinner />}
    </>
  );
}

export default MyEvents;
