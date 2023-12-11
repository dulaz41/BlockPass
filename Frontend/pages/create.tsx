import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import CreateEventForm from "../components/CreateEvent/CreateEventForm";
import { useWeb3 } from "../context/Web3Context";
import { getSignedContract } from "../metamaskFunctions";

function Create() {
  const [metaHash, setMetaHash] = useState(false);
  const { client }: any = useWeb3();

  const submitEventToBlockChain = async (hash: string, data: any) => {
    try {
      let ctx = getSignedContract(client.network);

      let res = await ctx?.createNewPass(
        data.seats,
        data.startdate,
        data.enddate,
        data.price,
        hash,
        data.category
      );
      toast.success("Event submitted to blockchain, transaction in progress");
      return "Done";
    } catch (error) {
      console.log(error);

      toast.error("error while adding to blockchain");
      return false;
    }
  };
  const submitMetadata = async (metadata: any) => {
    let data = JSON.stringify({
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name: metadata.title,
      },
      pinataContent: {
        ...metadata,
        description: metadata.desc,
        name: metadata.title,
        attributes: [
          { trait_type: "Event Category", value: metadata.category },
        ],
      },
    });
    try {
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
          pinata_secret_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_SECRET}`,
          "Content-Type": "application/json",
        },
      });
      let hash = resFile.data.IpfsHash;

      setMetaHash(hash);
      return submitEventToBlockChain(hash, metadata);
    } catch (error) {
      return toast.error("Error occurred while uploading metadata");
    }
  };
  return (
    <>
      <CreateEventForm submitMetadata={submitMetadata} />
    </>
  );
}

export default Create;
