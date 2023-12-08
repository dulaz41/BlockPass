import Link from 'next/link';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import { TiThMenu } from 'react-icons/ti';
import { MdClose } from 'react-icons/md';
import { useState } from 'react';
import MobileNavbar from './MobileNavbar';
import ConnectButton from '../../web3/ConnectButton';
import DashBoardLink from './DashBoardLink';

type Props = {};
const Header = (props: Props) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <Box justifyContent={'space-between'}>
      <Flex
        px={'10'}
        alignItems='center'
        className='justify-between flex flex-row items-start xl:items-center sticky top-0 py-3 border-b border-[#f3f4f6]'
      >
        <Link href='/'>
          <h2 className='flex-1 text-sm cursor-pointer '>
            <span className='text-primary font-semibold'>Block</span>
            <span className='text-orange font-semibold'>Pass</span>
          </h2>
        </Link>
        <div className='flex flex-row space-x-3'>
          <div className='hidden md:flex items-center sm:space-x-4 space-x-5'>
            <Link href='/'>Home</Link>
            <Link href='/events'>All Events</Link>
            <Link href='/create'>Create Event</Link>
            <Link href='/gallery'>Gallery</Link>
            <Link href='/my_tickets'>My tickets</Link>
            {/* <DashBoardLink /> */}
          </div>

          <ConnectButton />
          <Box className='md:hidden sm:block duration-300 ease-in text-orange'>
            <IconButton
              pt='2'
              aria-label='mobile-nav'
              variant='flushed'
              fontSize={'30px'}
              onClick={() => setOpenMenu((current) => !current)}
              icon={openMenu ? <MdClose /> : <TiThMenu />}
            />
          </Box>
        </div>
      </Flex>
      {/* mobile nav */}
      <MobileNavbar openMenu={openMenu} setOpenMenu={setOpenMenu} />
    </Box>
  );
};

export default Header;
