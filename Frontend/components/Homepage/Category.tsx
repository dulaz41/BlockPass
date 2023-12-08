import { Box, SimpleGrid } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { categories } from '../../mockData';

type Props = {};

const Category = (props: Props) => {
  return (
    <div className='px-4 py-10 lg:px-0 md:max-w-[90%] lg:max-w-[80%] xl:max-w-[65%] mx-auto space-y-4'>
      <h2 className='text-center font-bold py-4'>Choose Different Category</h2>
      <SimpleGrid columns={[1, 2, 3, 4]} spacing='8'>
        {categories?.map((category) => (
          <Box
            as={Link}
            href={`/category/${category.name}`}
            textAlign={'center'}
            key={category.id}
            bgImg={'/images/category/' + category.catImage}
            bgPos='center'
            bgSize={'cover'}
            py={20}
            px='8'
            color='white'
            fontWeight={'bold'}
            bgColor='rgba(0,0,0,0.5)'
            bgBlendMode='darken'
            rounded='xl'
            shadow='base'
          >
            {category.catTitle}
          </Box>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default Category;
