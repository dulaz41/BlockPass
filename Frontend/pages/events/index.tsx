import { Box, Center, Icon, SimpleGrid, Text } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import React from 'react';
import { FaExclamation } from 'react-icons/fa';
import EventsComponent from '../../components/Events/EventsComponent';
import WrapContent from '../../components/Layouts/components/WrapContent';
import MainLayout from '../../components/Layouts/MainLayout';
import { useApp } from '../../context/AppContext';

function Events() {
  const { events }: any = useApp();

  return (
    <MainLayout title='All events on BlockPass'>
      <WrapContent>
        <Box py='5'>
          <Text px='2' fontSize='xl' as='h1' className='capitalize py-5'>
            ALL EVENTS {events && events.length !== 0 && '-' + events.length}
          </Text>
          <SimpleGrid columns={[1, 2, 3]} spacing='5'>
            {events &&
              events.length !== 0 &&
              events.map((event: any, idx: number) => (
                <div key={idx + 'kk'}>
                  <EventsComponent event={event} />
                </div>
              ))}
          </SimpleGrid>
          {events && events.length === 0 && (
            <Center flexDir='column' p='5' gap='3'>
              <Icon as={FaExclamation} fontSize='80px' />
              <Text fontSize='xl'>Wow, Such empty!</Text>
            </Center>
          )}
        </Box>
      </WrapContent>
    </MainLayout>
  );
}

export default Events;
