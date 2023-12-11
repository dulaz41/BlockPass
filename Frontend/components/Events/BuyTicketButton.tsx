import { Box, Button, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { getSignedContract } from "../../metamaskFunctions";
import { useWeb3 } from "../../context/Web3Context";
import { NETWORKS } from "../../config/networks";

function BuyTicketButton({ id, price, chain }: any) {
  const [loading, setLoading] = useState(false);
  const { client, switchNetworks }: any = useWeb3();
  async function buyTicket() {
    if (!client)
      return toast.error("Wallet not connected", { position: "top-center" });

    setLoading(true);

    try {
      let res = await getSignedContract(client.network)?.purchasePass(id, {
        value: ethers.utils.parseEther("0.1"),
      });
      alert("Booked, check your NFT ticket in your wallet");
    } catch (error) {
      console.log(error);

      toast.error("Error booking the ticket");
    }

    setLoading(false);
  }

  function WHICH_NETWORK() {
    return client.network === NETWORKS.fil_testnet.chainId ? (
      <b>Filecoin </b>
    ) : client.network === NETWORKS.ftm_testnet.chainId ? (
      <b>Fantom </b>
    ) : (
      <b>Mumbai </b>
    );
  }

  function FIND_NETWORK() {
    const current_network: any = Object.values(NETWORKS).filter(
      (entry: any) => {
        return entry.chainId === chain;
      }
    );
    if (current_network && current_network.length > 0) {
      return <b>{current_network[0].title} </b>;
    } else {
      return <b></b>;
    }
  }

  return (
    <Box>
      <Button
        isLoading={loading}
        bg="#f24726"
        onClick={buyTicket}
        colorScheme="orange"
        color="white"
        size="lg"
        disabled={client.network !== chain}
      >
        Buy Ticket
      </Button>

      {client && client.network !== chain && (
        <Text>
          You are connected to {WHICH_NETWORK()}
          network.
          <br />
          Switch to {FIND_NETWORK()}
          to buy tickets for this event
          <br />
          <Button
            my="3"
            colorScheme="green"
            onClick={() => switchNetworks(chain)}
          >
            Switch
          </Button>
        </Text>
      )}
    </Box>
  );
}

export default BuyTicketButton;
