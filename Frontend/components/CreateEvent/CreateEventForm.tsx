import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import React, { useCallback, useRef, useState } from 'react';

import { FaFileUpload } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import uuid from 'react-uuid';
import { categories } from '../../mockData';
import { useApp } from '../../context/AppContext';
import { useWeb3 } from '../../context/Web3Context';
import MainLayout from '../Layouts/MainLayout';
import WrapContent from '../Layouts/components/WrapContent';
import { FIND_NETWORK } from '../../metamaskFunctions';

const pinataSecret: string | undefined =
  process.env.NEXT_PUBLIC_PINATA_API_SECRET;
const pinataKey: string | undefined = process.env.NEXT_PUBLIC_PINATA_API_KEY;

function CreateEventForm({ submitMetadata }: any) {
  const { GetAllEvents }: any = useApp();
  const { client }: any = useWeb3();
  const [uploadData, setUpload] = useState({
    name: '',
    size: 0,
  });
  const [uploadLevel, setUploadLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imgHash, setImgHash] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  /*
  upload image to ipfs
  */
  const onDrop = useCallback(async (files: File[]) => {
    //const byte = files[0].size;
    setUpload({
      name: files[0].name,
      size: files[0].size * 0.001,
    });

    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const resFile = await axios({
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data: formData,
        headers: {
          pinata_api_key: pinataKey!.toString(),
          pinata_secret_api_key: pinataSecret!.toString(),
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress(progressEvent) {
          const { loaded, total }: any = progressEvent;
          const percent = Math.floor((loaded * 100) / total);
          if (barRef.current !== null && barRef.current !== undefined) {
            barRef.current.style.width = `${percent}%`;
            setUploadLevel(percent);
          }
        },
      });

      const IPSFHash = 'https://ipfs.io/ipfs/' + resFile.data.IpfsHash;
      setImgHash(IPSFHash);
    } catch (error) {
      toast.error('Error sending File to IPFS: ');
      console.log(error);
    }
  }, []);

  /*
  END OF upload image to ipfs
  */

  /*
  Submit METADATA to ipfs
  */
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!client) return toast.error('connect wallet first');
    setLoading(true);
    const {
      title,
      desc,
      information,
      category,
      seats,
      startdate,
      time,
      price,
      location,
      enddate,
    } = event.target;
    let SD = new Date(startdate.value);
    let ED = new Date(enddate.value);

    const data = {
      id: uuid(),
      title: title.value,
      category: category.value,
      desc: desc.value,
      seats: seats.value,
      startdate: Number(SD.getTime()),
      enddate: Number(ED.getTime()),
      time: time.value,
      information: information.value,
      image: imgHash,
      location: location.value,
      price: price.value,
      chainId: client.network,
    };

    let ref = await submitMetadata(data);
    if (ref) {
      alert('posted, confirm in wallet!');
      window.document.forms[0].reset();
      if (barRef.current !== null && barRef.current !== undefined) {
        barRef.current.style.width = `${0}%`;
        setUploadLevel(0);
      }
      setUpload({
        name: '',
        size: 0,
      });
      setTimeout(() => {
        GetAllEvents();
      }, 2500);
    }
    setLoading(false);
  };
  /*
 END OF Submit METADATA to ipfs
  */

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <MainLayout title='Create events on BlockPass'>
      <Box bg='gray.50' py='5'>
        <WrapContent>
          <Box>
            <Text fontSize='xl' as='h1' className='capitalize pt-5'>
              Create an event
            </Text>
            <Text fontSize='sm'>
              Your Best Event Place for booking and management
            </Text>
          </Box>
          <Stack spacing='5' as='form' py='5' onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Event Name</FormLabel>
              <Input name='title' placeholder='input event name/title' />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select name='category'>
                {categories?.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.catTitle}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Short Description</FormLabel>
              <Input
                name='desc'
                placeholder='eg event targeted at teens in tech/health industry'
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>More Information</FormLabel>
              <Textarea
                name='information'
                placeholder='eg event targeted at teens in tech/health industry'
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Ticket Price ($)</FormLabel>
              <Input name='price' type='number' placeholder='$50' />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Available Seats</FormLabel>
              <Input name='seats' placeholder='500' />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input name='location' placeholder='Lagos' />
            </FormControl>
            <Flex>
              <FormControl isRequired>
                <FormLabel>Start Date</FormLabel>
                <Input name='startdate' type='date' placeholder='2 Dec 2023' />
              </FormControl>
              <FormControl isRequired marginLeft={'2'}>
                <FormLabel>End Date</FormLabel>
                <Input name='enddate' type='date' placeholder='2 Dec 2023' />
              </FormControl>
            </Flex>
            <FormControl isRequired>
              <FormLabel>Time of Event</FormLabel>
              <Input
                name='time'
                onChange={(e) => console.log(e.target.value)}
                type='time'
                placeholder='1:00pm'
              />
            </FormControl>
            <div>
              <p className='font-[400] text-xs md:text-sm lg:text-base text-[rgba(8, 8, 18, 0.7)] mt-2'>
                Upload banner
              </p>
              <div
                {...getRootProps({
                  className:
                    'flex flex-col justify-center items-center space-y-2 h-32 border border-dashed rounded-[1px] bg-[#F8F9FB] hover:cursor-pointer',
                })}
              >
                <input {...getInputProps()} />
                <span className='text-orange text-3xl'>
                  <FaFileUpload />
                </span>
                <p className='text-[#19191C] font-[400] text-xs md:text-base'>
                  Drop your file(s) here or browse{' '}
                </p>
                <p className='text-[#19191C] font-[400] text-center md:text-left text-xs md:text-base'>
                  PNG, SVG, JPG, GIF, or PDF Ma. file size 800*400px
                </p>
              </div>
              <div className='flex flex-col md:flex-row items-center md:items-start md:space-x-5 p-2 border rounded-[5px] my-7'>
                <span className='text-orange text-3xl hidden md:block'>
                  <FaFileUpload />
                </span>
                <div className='w-[100%]'>
                  <p className='text-[#19191C] font-[400] text-center md:text-left'>
                    {uploadData.name}
                  </p>
                  <p className='font-[400] text-[rgba(8, 8, 18, 0.4)] text-center md:text-left'>
                    {uploadData.size}kb
                  </p>
                  <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 items-center md:space-x-5'>
                    <div className='bar border bg-slate-50 w-full rounded-2xl '>
                      <div
                        className='progress h-[6px] rounded-2xl'
                        ref={barRef}
                      ></div>
                    </div>
                    <div>{uploadLevel}%</div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              colorScheme='purple'
              size='lg'
              type='submit'
              alignSelf={'flex-end'}
              px='10'
              disabled={!imgHash}
              isLoading={loading}
            >
              Create
            </Button>
            <Stack>
              {!imgHash && (
                <Text color='red.500' as='small' textAlign='right'>
                  *Image not uploaded
                </Text>
              )}
              {!client && (
                <Text color='red.500' as='small' textAlign='right'>
                  *wallet not connected
                </Text>
              )}
              {client && imgHash && (
                <Text color='green.500' as='small' textAlign='right'>
                  You are submitting to
                  <b> {FIND_NETWORK(client.network).title}</b>
                </Text>
              )}
            </Stack>
          </Stack>
        </WrapContent>
      </Box>
    </MainLayout>
  );
}

export default CreateEventForm;
