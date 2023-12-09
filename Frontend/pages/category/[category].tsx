import { Box, Center, Icon, SimpleGrid, Text } from '@chakra-ui/react';
import { BigNumber, ethers } from 'ethers';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { FaExclamation } from 'react-icons/fa';
import LoadingSpinner from '../../components/Alerts/LoadingSpinner';
import EventsComponent from '../../components/Events/EventsComponent';
import WrapContent from '../../components/Layouts/components/WrapContent';
import MainLayout from '../../components/Layouts/MainLayout';
import { NETWORKS } from '../../config/networks';

function SingleCategory() {
  const { category } = useRouter().query;

  const [events, setEvents] = useState<{ loading: boolean; events: any[] }>({
    loading: true,
    events: [],
  });

  const fetchItem = useCallback(async () => {
    let Mrpc: string = 'https://rpc-mumbai.maticvigil.com';
    let Frpc: string = 'https://api.avax-test.network/ext/C/rpc';

    const Mprovider = new ethers.providers.JsonRpcProvider(Mrpc);
    let Mca = NETWORKS.polygon_mumbai.ca;
    let Mabi = NETWORKS.polygon_mumbai.abi;

    const Fprovider = new ethers.providers.JsonRpcProvider(Frpc);
    let Fca = NETWORKS.fuji_testnet.ca;
    let Fabi = NETWORKS.fuji_testnet.abi;


    try {
      const Mct = new ethers.Contract(Mca, Mabi, Mprovider);
      const Fct = new ethers.Contract(Fca, Fabi, Fprovider);
      let Mevents = await Mct.getByCategory(category);
      let Fevents = await Fct.getByCategory(category);

      return setEvents(() => {
        return { loading: false, events: [...Mevents, ...Fevents] };
      });
    } catch (error) {
      console.log(error);

      return setEvents((prev) => {
        return { loading: false, events: prev.events };
      });
    }
  }, [category]);

  useEffect(() => {
    if (category) {
      fetchItem();
    }
  }, [fetchItem, category]);

  return (
    <MainLayout title={`Viewing events for ${category}`}>
      <WrapContent>
        <Box py='5'>
          <Text px='2' fontSize='xl' as='h1' className='capitalize py-5'>
            {category} Events
          </Text>
        </Box>
        <SimpleGrid columns={[1, 2, 3]} spacing='5'>
          {!events.loading &&
            events.events.length !== 0 &&
            events.events.map((event: any) => {
              if (event.category.trim() !== '') {
                return (
                  <div key={BigNumber.from(event.eventId).toNumber()}>
                    <EventsComponent event={event} />
                  </div>
                );
              }
            })}
        </SimpleGrid>
        {events.loading && <LoadingSpinner />}
        {!events.loading && events.events.length === 0 && (
          <Center flexDir='column' p='5' gap='3'>
            <Icon color='red' as={FaExclamation} fontSize='80px' />
            <Text fontSize='xl'>No events found for {category} category.</Text>
          </Center>
        )}
      </WrapContent>
    </MainLayout>
  );
}

export default SingleCategory;
