import { Box, Button, Stack, Text } from '@chakra-ui/react';
import axios from 'axios';
import { BigNumber } from 'ethers';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const EventsComponent = ({ event }: { event: any }) => {
  const [data, setData] = useState({
    id: '',
    title: '',
    category: '',
    desc: '',
    seats: '',
    startdate: 0,
    enddate: 0,
    time: '0',
    information: '',
    image: '',
    price: '0',
    chainId: '0',
  });

  const eventId = BigNumber.from(event['blockPassId']).toNumber();
  const fetchMetadata = useCallback(async () => {
    try {
      const url = 'https://ipfs.io/ipfs/' + event['metadata'];
      
      // Using the fetch API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });
  
      // Check if the request was successful (status code in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the response JSON
      const data = await response.json();
  
      // Update the state with the fetched data
      setData(data);
    } catch (error) {
      console.error(error);
  
      // Handle different types of errors
      if (error.message === 'Network request failed') {
        toast.error('Error fetching metadata - network issue');
      } else {
        toast.error('Error fetching metadata');
      }
    }
  }, [event]);


  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  return (
    <Stack
      spacing='4'
      h='240px'
      textAlign={'center'}
      key={BigNumber.from(event['blockPassId']).toNumber()}
      bgImg={data.image}
      bgPos='center'
      bgSize={'cover'}
      px='2'
      color='white'
      fontWeight={'bold'}
      bgColor='rgba(0,0,0,0.6)'
      bgBlendMode='darken'
      py='5'
      justifyContent={'center'}
      rounded='xl'
    >
      <Text as='h2' fontSize='lg' textTransform={'uppercase'}>
        {data.title}
      </Text>
      <Box lineHeight={0.8}>
        <Text as='small' fontSize={'xs'}>
          {data.desc}
        </Text>
      </Box>
      <Link
        href={`/events/${eventId}?chain=${
          data.chainId ? data.chainId : '4002'
        }`}
      >
        <Button colorScheme='twitter' size='sm' alignSelf={'center'} py='3'>
          Book Now!
        </Button>
      </Link>
    </Stack>
  );
};

export default EventsComponent;
