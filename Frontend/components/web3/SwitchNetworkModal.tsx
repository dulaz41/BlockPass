import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Box,
  Stack,
  HStack,
} from '@chakra-ui/react';
import { HiSwitchHorizontal } from 'react-icons/hi';
import { NETWORKS as SUPPORTED_NETWORKS } from '../../config/networks';
import { useWeb3 } from '../../context/Web3Context';
function SwitchNetworkModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: any;
}) {
  const { switchNetworks }: any = useWeb3();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Network Error</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize='lg'>
              Supported networks are :<br />
              <Stack spacing='2' py='5'>
                {Object.values(SUPPORTED_NETWORKS).map((n: any, i: any) => {
                  return (
                    <HStack gap='5' key={i + 'nt'}>
                      <Text as='b' fontSize='xl'>
                        {n.title}
                      </Text>
                      <Button
                        onClick={() => switchNetworks(n.chainId)}
                        leftIcon={<HiSwitchHorizontal />}
                      >
                        Switch
                      </Button>
                    </HStack>
                  );
                })}
              </Stack>
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SwitchNetworkModal;
