import blockpass from "./blockpass.json";

export type NetData = {
  ca: string;
  abi: any;
  chainId: number;
  title: string;
  rpc: string;
};

export const NETWORKS: {
  polygon_mumbai: NetData;
  fuji_testnet: NetData;
} = {
  polygon_mumbai: {
    ca: "",
    abi: "",
    chainId: 80001,
    title: "Mumbai",
    rpc: "https://rpc-mumbai.maticvigil.com",
  },
  fuji_testnet: {
    ca: "0xB1953b253dACd29e81b0574Fd1994AD1f4076A92",
    abi: blockpass,
    chainId: 43113,
    title: "Fuji C Chain",
    rpc: "https://api.avax-test.network/ext/C/rpc",
  },
};
