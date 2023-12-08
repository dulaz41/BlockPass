import { Box, HStack, Image, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { FiMapPin } from 'react-icons/fi';
import { mockTickets } from '../../mockData';

function GalleryGrid() {
  return (
    <SimpleGrid columns={[1, 2, 3]} spacing='5' pb='20'>
      {mockTickets?.map((gallery) => (
        <GalleryItem key={gallery.id} data={gallery} />
      ))}
    </SimpleGrid>
  );
}

export default GalleryGrid;

const GalleryItem = ({ data }: any) => {
  return (
    <Stack rounded='lg' bg='white' shadow={'lg'}>
      <Box h={['180px', '180px', '180px', '200px']}>
        <Image
          h='full'
          w='full'
          objectFit={'cover'}
          src={data.image}
          alt={data.title}
          rounded='lg'
        />
      </Box>
      <HStack p='4' spacing='4' alignItems={'flex-start'}>
        <Stack spacing='4'>
          <Text fontWeight='semibold' as='h3' fontSize={'small'}>
            {data.title}
          </Text>
          <HStack>
            <Box color='#f24726'>
              <FiMapPin />
            </Box>
            <Text as='small' fontWeight='bold' fontSize='xs'>
              {data.location}
            </Text>
          </HStack>
        </Stack>
      </HStack>
    </Stack>
  );
};
