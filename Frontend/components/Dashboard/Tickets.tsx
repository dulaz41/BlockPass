import { Box, Center, Icon, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { FaExclamation } from 'react-icons/fa';
import { useWeb3 } from '../../context/Web3Context';
import { getSignedContract } from '../../metamaskFunctions';
import LoadingSpinner from '../Alerts/LoadingSpinner';
import NoWalletAlert from '../Alerts/NoWalletAlert';
import TicketsGrid from '../Tickets/TicketsGrid';
// Replace with your Alchemy API key:
const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const baseURL = `https://polygon-mumbai.g.alchemy.com/v2/${apiKey}`;
const axiosURL = `${baseURL}`;

function MyTickets() {
  const { client }: any = useWeb3();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNFTS = useCallback(async () => {
    if (!client) return;
    setLoading(true);
    try {
      let ct = await getSignedContract(client.network);
      if (!ct) return;

      let token = await ct.usersTokens(client.address);
      setData(token);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    if (client) {
      getNFTS();
    }
  }, [client, getNFTS]);

  return (
    <>
      <Box py='5'>
        <Text px='2' fontSize='lg' as='h2' className='capitalize py-5' mb='-4'>
          Ticket NFT&apos;s :
        </Text>
        <Text as='span' pl='3' fontStyle={'italic'}>
          To view NFT&apos; on other networks, switch connected network
        </Text>
      </Box>
      {!client && <NoWalletAlert />}
      {client && !loading && data.length > 0 && <TicketsGrid nft={data} />}
      {!loading && data && data.length === 0 && (
        <Center flexDir='column' p='5' gap='3'>
          <Icon as={FaExclamation} fontSize='30px' />
          <Text fontSize='lg'>You haven&apos;t booked any events yet!</Text>
        </Center>
      )}
      {loading && <LoadingSpinner />}
    </>
  );
}

export default MyTickets;
