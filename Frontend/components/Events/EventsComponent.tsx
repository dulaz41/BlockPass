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

  const eventId = BigNumber.from(event['eventId']).toNumber();
  const fetchMetadata = useCallback(async () => {
    const url = 'https://gateway.pinata.cloud/ipfs/' + event['metadata'];
    try {
      let { data } = await axios.get(url, {
        headers: {
          Accept: 'text/plain',
        },
      });

      setData(data);
    } catch (error) {
      console.log(error);
      toast.error('error occurred');
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
      key={BigNumber.from(event['eventId']).toNumber()}
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
