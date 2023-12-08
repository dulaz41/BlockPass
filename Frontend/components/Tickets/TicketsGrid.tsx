import { Box, HStack, Image, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import axios from 'axios';
import { BigNumber } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useWeb3 } from '../../context/Web3Context';
import { getSignedContract } from '../../metamaskFunctions';

function TicketsGrid({ nft }: any) {
  return (
    <SimpleGrid columns={[1, 2, 3]} spacing='5' pb='20'>
      {nft?.map((ticket: any) => {
        return <Ticket key={BigNumber.from(ticket).toNumber()} data={ticket} />;
      })}
    </SimpleGrid>
  );
}

export default TicketsGrid;

const Ticket = ({ data }: any) => {
  const { client }: any = useWeb3();

  const [NFTData, setNFTData] = useState<any>(null);

  const fetchMetadata = async (uri: any) => {
    try {
      let { data } = await axios.get(
        //@ts-ignore
        'https://gateway.pinata.cloud/ipfs/' + uri
      );
      setNFTData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date: any) => {
    if (NFTData) {
      let d = new Date(date);
      return d.toDateString();
    }
  };

  const getNFTHash = useCallback(
    async (data: any) => {
      let res = await getSignedContract(client.network)?.tokenURI(
        BigNumber.from(data).toNumber()
      );
      fetchMetadata(res);
    },
    [client.network]
  );

  useEffect(() => {
    getNFTHash(data);
  }, [data, getNFTHash]);

  return (
    <Stack rounded='lg' bg='white' shadow={'lg'} pos='relative'>
      {NFTData && (
        <>
          <Box
            bg='white'
            color='gray.800'
            pos='absolute'
            top='20px'
            left='10px'
            px='2'
            py='1'
            rounded='lg'
            shadow='lg'
            fontWeight={'bold'}
          >
            ${NFTData && NFTData.price}
          </Box>
          <Box h={['150px', '150px', '180px', '200px']}>
            <Image
              h='full'
              w='full'
              objectFit={'cover'}
              src={NFTData && NFTData.image}
              alt={NFTData && NFTData.title}
              rounded='lg'
            />
          </Box>
          <HStack p='5' spacing='4' alignItems={'flex-start'}>
            <Box
              w='20%'
              fontSize='small'
              fontWeight={'bold'}
              textAlign='center'
            >
              {NFTData && formatDate(NFTData.startdate)}
            </Box>
            <Stack spacing='4'>
              <Text fontWeight='semibold' as='h3' fontSize={'small'}>
                {NFTData && NFTData.title}
              </Text>
              <Text>{NFTData && NFTData.desc}</Text>
            </Stack>
          </HStack>
        </>
      )}
    </Stack>
  );
};
