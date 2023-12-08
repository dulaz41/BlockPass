import React, { ReactNode } from 'react';
import Head from 'next/head';
import { Box } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';

type Props = {
  children?: ReactNode;
  title?: string;
};

const MainLayout = ({
  children,
  title = 'This is the default title',
}: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
    <Header />

    <Box minH={'50vh'}>{children}</Box>
    <Footer />
  </div>
);

export default MainLayout;
