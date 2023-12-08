import React from 'react';
import Link from 'next/link';
import {
  Button,
  Center,
  HStack,
  Text,
} from '@chakra-ui/react';

type Props = {};

const Banner = (props: Props) => {
  return (
    <Center
      flexDir={'column'}
      textAlign={'center'}
      backgroundColor={'#1F3578'}
      // backgroundColor={'blackAlpha.800'}
      minHeight='80vh'
      bgImg={'/images/bannerbackground.png'}
      bgRepeat='no-repeat'
      bgSize={'cover'}
      bgBlendMode='overlay'
      color='white'
    >
      <Text as='h1' fontSize='4xl' fontWeight='semibold'>
      Unlock the future of NFT events with BlockPass <br />
        <Text rounded='lg' px='3' color='#f24726' as='span'>
        where decentralization meets unforgettable experiences!
        </Text>{' '}
      </Text>
      <br />
      <Text fontSize='lg'>
        BlockPass is the first and best Web3 event management system <br />
      </Text>
      <HStack gap='5' my='10'>
        <Button
          as={Link}
          href='/create'
          bg='#f24726'
          size='lg'
          colorScheme={'orange'}
          rounded='lg'
        >
          Create an event
        </Button>
        <Button
          as={Link}
          href='#howitworks'
          colorScheme={'blue'}
          _hover={{ bg: 'blackAlpha.900' }}
          color='white'
          variant='flushed'
          size='lg'
          rounded='lg'
        >
          Learn more
        </Button>
      </HStack>
    </Center>
  );
};

export default Banner;
