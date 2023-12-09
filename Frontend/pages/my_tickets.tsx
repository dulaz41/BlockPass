import { Box, Center, Icon, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { FaExclamation } from 'react-icons/fa';
import { getSignedContract } from '../metamaskFunctions';
import { useWeb3 } from '../context/Web3Context';
import MainLayout from '../components/Layouts/MainLayout';
import WrapContent from '../components/Layouts/components/WrapContent';
import NoWalletAlert from '../components/Alerts/NoWalletAlert';
import TicketsGrid from '../components/Tickets/TicketsGrid';
import LoadingSpinner from '../components/Alerts/LoadingSpinner';

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
      if (ct) {
        let token = await ct.usersTokens(client.address);
        setData(token);
        setLoading(false);
        return;
      }
      setData([]);
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
    <MainLayout title='My tickets on BlockPass'>
      <WrapContent>
        <Box py='5'>
          <Text px='2' fontSize='xl' as='h1' className='capitalize py-5'>
            MY TICKETS
          </Text>
          <Text as='span' pl='3' fontStyle={'italic'}>
            To view NFT on other networks, switch connected network
          </Text>
        </Box>
        {!client && <NoWalletAlert />}
        {client && !loading && data.length > 0 && <TicketsGrid nft={data} />}
        {!loading && data && data.length === 0 && (
          <Center flexDir='column' p='5' gap='3'>
            <Icon as={FaExclamation} fontSize='30px' />
            <Text fontSize='lg'>Wow, So much empty!</Text>
          </Center>
        )}
        {loading && <LoadingSpinner />}
      </WrapContent>
    </MainLayout>
  );
}

export default MyTickets;
