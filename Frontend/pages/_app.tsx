import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { Toaster } from 'react-hot-toast';
import AppContextProvider from '../context/AppContext';
import Web3ContextProvider from '../context/Web3Context';

// import '../scripts/wdyr';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <Web3ContextProvider>
        <ChakraProvider>
          <Toaster position='top-right' />
          <CSSReset />
          <Component {...pageProps} />
        </ChakraProvider>
      </Web3ContextProvider>
    </AppContextProvider>
  );
}
export default MyApp;
