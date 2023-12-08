import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';

function LoadingSpinner() {
  return (
    <Center>
      <Spinner size={'xl'} />
    </Center>
  );
}

export default LoadingSpinner;
