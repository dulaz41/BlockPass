import { Center, Icon, SimpleGrid, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { FaExclamation } from 'react-icons/fa';
import EventsComponent from '../Events/EventsComponent';

const Events = ({ events }: { events: any[] }) => {
  return (
    <div className=' w-full px-2 lg:px-0 md:max-w-[90%] lg:max-w-[80%] xl:max-w-[65%] mx-auto mt-4'>
      <div className='flex items-center justify-between px-1 py-5'>
        {/* <p className='capitalize font-bold text-sm md:text-base text-black'></p> */}
        <Text as='h2' fontSize='2xl'>
          Popular Events
        </Text>
        <Link href='/' passHref>
          <p className='capitalize'>View all</p>
        </Link>
      </div>
      <SimpleGrid columns={[1, 2, 3]} spacing='5'>
        {events?.map((event, idx) => (
          <div key={idx + 'lo'} className='w-[95%] mx-auto'>
            <EventsComponent event={event} />
          </div>
        ))}
      </SimpleGrid>
      {events && events.length === 0 && (
        <Center flexDir='column' p='5' gap='3'>
          <Icon as={FaExclamation} fontSize='30px' />
          <Text fontSize='lg'>No events yet, check back later</Text>
        </Center>
      )}
    </div>
  );
};

export default Events;
