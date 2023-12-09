import { Box, Divider, Icon, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { getSignedContract } from '../metamaskFunctions';
import { useWeb3 } from '../context/Web3Context';
import MainLayout from '../components/Layouts/MainLayout';
import WrapContent from '../components/Layouts/components/WrapContent';
import MyTickets from '../components/Dashboard/Tickets';
import MyEvents from '../components/Dashboard/Events';

// Replace with your Alchemy API key:
const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const baseURL = `https://polygon-mumbai.g.alchemy.com/v2/${apiKey}`;
const axiosURL = `${baseURL}`;

function Dashboard() {
  const { client }: any = useWeb3();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNFTS = useCallback(async () => {
    if (!client) return;
    setLoading(true);
    try {
      let ct = await getSignedContract(client.network);
      let token = await ct?.usersTokens(client.address);
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
    <MainLayout title='My tickets on BlockPass'>
      <WrapContent>
        <Box py='5'>
          <Text
            px='2'
            fontSize='2xl'
            as='h1'
            fontWeight='bold'
            className='capitalize py-5'
            mb='-3'
          >
            Dashboard
          </Text>
          <Text as='span' pl='2'>
            Here you can manage events and NFT&apos;s you own. You may only
            delete unbooked events;
          </Text>
        </Box>
        <MyEvents />
        <Box pt='10'>
          <Divider />
        </Box>
        <MyTickets />
      </WrapContent>
    </MainLayout>
  );
}

export default Dashboard;
