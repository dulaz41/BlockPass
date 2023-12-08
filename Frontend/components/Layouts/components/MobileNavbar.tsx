import React from 'react';
import { MdClose } from 'react-icons/md';
import { useRouter } from 'next/router';
import Link from 'next/link';

type Props = {};

const MobileNavbar = ({
  openMenu,
  setOpenMenu,
}: {
  openMenu: any;
  setOpenMenu: any;
}) => {
  const router = useRouter();
  // handle close
  const handleClose = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setOpenMenu((current: any) => !current);
  };
  return (
    <div
      className={
        openMenu
          ? 'lg:hidden fixed left-0 top-0 w-full h-screen bg-orange/20 z-80 ease-in-out duration-700'
          : 'lg:hidden fixed -left-[100%] top-0 w-full h-screen bg-sm8/60 z-80 ease-in-out duration-900'
      }
      onClick={handleClose}
    >
      <div
        className={
          openMenu
            ? 'fixed top-0 left-0 h-screen bg-gradient-to-r from-primary to-primary/90 shadow-xl shadow-orange w-[70%]  md:w-[50%] ease-in duration-900 z-80 pt-3 px-3'
            : 'fixed -left-[100%] top-0 ease-in duration-700 bg-gradient-to-r from-primary to-primary/90 shadow-xl shadow-orange w-[75%] md:w-[55%] h-screen z-80 pt-3 px-3'
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-end'>
          <div
            onClick={handleClose}
            className='flex items-center justify-center rounded-full w-7 h-7 bg-white'
          >
            <MdClose className='w-6 h-6 text-orange' />
          </div>
        </div>
        {/* the side bar tools */}
        <div className='flex flex-col text-lg text-white space-y-8 font-semibold'>
          <Link href='/'>Home</Link>
          <Link href='/events'>All Events</Link>
          <Link href='/create'>Create Event</Link>
          <Link href='/gallery'>Gallery</Link>
          <Link href='/my_tickets'>My Tickets</Link>
          {/* <Link href='/dashboard'>Dashboard</Link> */}
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
