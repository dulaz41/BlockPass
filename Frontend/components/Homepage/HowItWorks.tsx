import React from 'react';
import { MdOutlinePersonOutline, MdWorkOutline } from 'react-icons/md';
import { AiOutlineSave } from 'react-icons/ai';
import { Box, Link, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import WrapContent from '../Layouts/components/WrapContent';

const HowItWorks = () => {
  return (
    <Box id='howitworks' pt='30px'>
      <WrapContent>
        <Stack px='5' m='auto' alignItems={'center'} py='10'>
          <Text as='h1' fontSize='3xl' fontWeight='bold'>
            How it works
          </Text>
          <Text
            fontSize='lg'
            className='text-center  text-gray-400 w-[80%] lg:w-[60%]'
          >
            Connect Wallet - Pay - Go! - It&apos;s that simple!
          </Text>
          <SimpleGrid columns={[1, 1, 3]} spacing='5' pt='5'>
            <Box
              rounded='xl'
              className='flex flex-col items-center bg-white drop-shadow-md p-3 md:p-5 h-full space-y-1'
            >
              <Box fontSize='30px' className='bg-orange p-2 rounded-full'>
                <MdOutlinePersonOutline className='text-white' />
              </Box>

              <Text as='h3' fontWeight='bold' fontSize='lg'>
                Connect Wallet
              </Text>

              <Text className='text-md text-center'>
                Firstly you have to connect your wallet to the DAPP
              </Text>
            </Box>
            <Box
              rounded='xl'
              className='flex flex-col items-center bg-white drop-shadow-md p-3 md:p-5 h-full space-y-1'
            >
              <Box fontSize='30px' className='bg-primary p-2 rounded-full'>
                <MdWorkOutline className='text-white' />
              </Box>
              <Link href='/#'>
                <Text as='h3' fontWeight='bold' fontSize='lg'>
                  Search for Event
                </Text>
              </Link>
              <Text className='text-md text-center'>
                Search for an Event in your Area or specific event
              </Text>
            </Box>
            <Box
              rounded='xl'
              className='flex flex-col items-center bg-white drop-shadow-md p-3  md:p-5 h-full space-y-1'
            >
              <Box fontSize='30px' className='bg-[#0CA789] p-2 rounded-full'>
                <AiOutlineSave className='text-white' />
              </Box>

              <Link href='/#'>
                <Text
                  as='h3'
                  fontWeight='bold'
                  textAlign='center'
                  fontSize='lg'
                >
                  Pay and Get NFT Ticket
                </Text>
              </Link>
              <Text className='text-md text-center'>
                Pay for the event you want and get NFT Ticket
              </Text>
            </Box>
          </SimpleGrid>
        </Stack>
      </WrapContent>
    </Box>
  );
};

export default HowItWorks;
