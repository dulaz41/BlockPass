// import mumbaiABI from './evema.json'
// import filABI from './evemafil.json'

export type NetData = {


    ca: string
    abi: any
    chainId: number,
    title: string,
    rpc: string

}


export const NETWORKS: {
    polygon_mumbai: NetData,
    fuji_testnet: NetData,
} = {
    polygon_mumbai: {
        ca: "",
        abi: '',
        chainId: 80001,
        title: 'Mumbai',
        rpc: 'https://rpc-mumbai.maticvigil.com'
    },
    fuji_testnet: {
        ca: "",
        abi: '',
        chainId: 43113,
        title: 'Fuji C Chain',
        rpc: 'https://api.avax-test.network/ext/C/rpc'

    }

}

