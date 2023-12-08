import Link from 'next/link';
import React from 'react';
import { useWeb3 } from '../../../context/Web3Context';

function DashBoardLink() {
  const { client }: any = useWeb3();
  return <>{client && <Link href='/dashboard'>Dashboard</Link>}</>;
}

export default DashBoardLink;
