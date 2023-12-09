import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { BigNumber, ethers } from 'ethers';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCashCoin } from 'react-icons/bs';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
import ProgressiveImage from 'react-progressive-graceful-image';
import BuyTicketButton from '../../components/Events/BuyTicketButton';
import WrapContent from '../../components/Layouts/components/WrapContent';
import MainLayout from '../../components/Layouts/MainLayout';
import { NETWORKS } from '../../config/networks';
import { FIND_NETWORK } from '../../metamaskFunctions';

export const formatDate = (date: any) => {
  let d = new Date(BigNumber.from(date).toNumber());
  return d.toDateString();
};
function SingleEvent(props: any) {
  let title = 'Event details';
  const [event, setEvent] = useState(null);
  const [data, setData] = useState({
    id: '',
    title: 'loading ...',
    category: '',
    desc: '',
    seats: '',
    startdate: 0,
    enddate: 0,
    time: '0',
    information: '',
    location: '',
    image: '',
    price: '0',
  });
  let { query } = useRouter();

  const fetchMetadata = useCallback(async (d: any) => {
    try {
      let { data } = await axios.get(
        //@ts-ignore
        'https://gateway.pinata.cloud/ipfs/' + d['metadata']
      );
      setData(data);
    } catch (error) {
      console.log(error);
      toast.error('error occurred');
    }
  }, []);

  const fetchItem = useCallback(async () => {
    //default to mumbai
    let rpc: string = 'https://rpc-mumbai.maticvigil.com';

    //check filecoin
    if (query.chain === '43113') {
      rpc = 'https://api.avax-test.network/ext/C/rpc';
    }


    const current_network: any = FIND_NETWORK(Number(query.chain));

    const provider = new ethers.providers.JsonRpcProvider(rpc);
    // @ts-ignore
    let ca = current_network.ca;
    // @ts-ignore
    let abi = current_network.abi;
    const ct = new ethers.Contract(ca, abi, provider);
    let d = await ct.getEventByIds(query.eventId);
    setEvent(d);
    fetchMetadata(d);
  }, [query, fetchMetadata]);

  useEffect(() => {
    if (query && query.chain) {
      fetchItem();
    }
  }, [fetchItem, query]);

  return (
    <MainLayout title={data.title}>
      <WrapContent>
        <Box py='5'>
          <Flex gap='10' flexDir={['column', 'column', 'row', 'row']}>
            <Stack spacing='5' w={['full', 'full', '35%', '30%']}>
              <Box>
                <Heading
                  color='blue.800'
                  fontSize={['lg', '2xl', '2xl', '4xl']}
                >
                  {data.title}
                </Heading>
                <HStack py='1'>
                  <Box color='#f24726'>
                    <FiMapPin />
                  </Box>
                  <Text as='small' fontWeight='bold' fontSize='xs'>
                    {data.location ? data.location : 'No location yet'}
                  </Text>
                </HStack>
              </Box>
              <SimpleGrid columns={[1, 2, 2, 2]} spacing='5'>
                <Box>
                  <HStack py='1'>
                    <Box color='#f24726' fontSize='xs'>
                      <FiCalendar />
                    </Box>
                    <Text as='small' fontWeight='bold' fontSize='xs'>
                      Start date
                    </Text>
                  </HStack>
                  <Text fontSize='xl'>
                    {event && formatDate(event['startTime'])}
                  </Text>
                </Box>
                <Box>
                  <HStack py='1'>
                    <Box color='#f24726' fontSize='xs'>
                      <FiCalendar />
                    </Box>
                    <Text as='small' fontWeight='bold' fontSize='xs'>
                      End date
                    </Text>
                  </HStack>
                  <Text fontSize='xl'>
                    {event && formatDate(event['endSales'])}
                  </Text>
                </Box>
              </SimpleGrid>
              <HStack gap='5'>
                <BuyTicketButton
                  chain={Number(query.chain)}
                  id={event ? event['eventId'] : null}
                  price={data.price}
                />
                <Box>
                  <HStack py='1'>
                    <Box color='#f24726' fontSize='xs'>
                      <BsCashCoin />
                    </Box>
                    <Text as='small' fontWeight='bold' fontSize='xs'>
                      Cost
                    </Text>
                  </HStack>
                  <Text fontSize='xl'>${data.price}</Text>
                </Box>
              </HStack>
            </Stack>

            {/* end of left side */}
            <Stack spacing='5' w={['full', 'full', '60%', '65%']}>
              <Box h='300px' pos='relative' zIndex='-1'>
                <Badge
                  p='2'
                  pos='absolute'
                  top='10px'
                  left='0'
                  colorScheme='green'
                  rounded='0'
                >
                  {data.category}
                </Badge>
                <ProgressiveImage src={data.image} placeholder='tiny-image.jpg'>
                  {(src, loading) => {
                    return loading ? (
                      <Image
                        pos='relative'
                        zIndex='-1'
                        alt={''}
                        className='progressive-image'
                        src={'/images/placeholder.png'}
                        h='100%'
                        w='full'
                        objectFit={'cover'}
                      />
                    ) : (
                      <Image
                        pos='relative'
                        zIndex='-1'
                        alt={data.title}
                        className='progressive-image'
                        src={src}
                        h='100%'
                        w='full'
                        objectFit={'cover'}
                      />
                    );
                  }}
                </ProgressiveImage>
              </Box>
              <Box>
                <Text fontSize='xl' as='h1' className='capitalize py-5'>
                  Description
                </Text>

                {data.information}
              </Box>
            </Stack>
          </Flex>
        </Box>
      </WrapContent>
    </MainLayout>
  );
}

export default SingleEvent;
