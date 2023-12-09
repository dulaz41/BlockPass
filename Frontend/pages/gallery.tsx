import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import GalleryGrid from '../components/Gallery/GalleryGrid';
import WrapContent from '../components/Layouts/components/WrapContent';
import MainLayout from '../components/Layouts/MainLayout';

function Gallery() {
  return (
    <MainLayout title='My tickets on BlockPass'>
      <WrapContent>
        <Box py='5'>
          <Text px='2' fontSize='xl' as='h1' className='capitalize py-5'>
            EVENTS GALLERY
          </Text>
        </Box>

        <GalleryGrid />
      </WrapContent>
    </MainLayout>
  );
}

export default Gallery;
