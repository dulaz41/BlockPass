import { Box, Button } from '@chakra-ui/react';
import React from 'react';
import { NETWORKS as SUPPORTED_NETWORKS } from '../../config/networks';
import SwitchNetworkModal from './SwitchNetworkModal';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';
import { useWeb3 } from '../../context/Web3Context';

function ConnectButton() {
  const { connectWallet, client, loading }: any = useWeb3();

  function Close() {
    return null;
  }

  const handleClick = (network: any) => {
    connectWallet(network);
  };
  function GetSupportedNetworks() {
    let temparr: any[] = [];
    Object.keys(SUPPORTED_NETWORKS).forEach((key) =>
      //@ts-ignore
      temparr.push(SUPPORTED_NETWORKS[key].chainId)
    );
    return temparr;
  }

  return (
    <>
      <Menu>
        <MenuButton
          my='2'
          rounded='lg'
          display={['none', 'flex']}
          size={['xs', 'sm', 'md', 'md']}
          colorScheme={client ? 'green' : 'twitter'}
          as={Button}
          rightIcon={<FaChevronDown />}
        >
          {client ? client?.address.substr(0, 8) + '...' : 'Connect'}
        </MenuButton>
        <MenuList>
          {Object.values(SUPPORTED_NETWORKS).map((n: any, i: any) => {
            return (
              <MenuItem onClick={() => handleClick(n)} key={i + 'nt'}>
                {n.title}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>

      {!loading && client && client.network !== undefined && (
        <SwitchNetworkModal
          onClose={Close}
          isOpen={!GetSupportedNetworks().includes(client.network)}
        />
      )}
    </>
  );
}

export default ConnectButton;
