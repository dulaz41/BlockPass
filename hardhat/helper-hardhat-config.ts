export interface NetworkConfigItem {
    //ethUsdPriceFeed?: string
    blockConfirmations?: number
    name?: string
    priceFeedRouter?: string
    ROUTER?: string
    TUSD?: string
}

export interface NetworkConfigInfo {
    [key: string]: NetworkConfigItem
}

export const networkConfig: NetworkConfigInfo = {
    localhost: {},
    hardhat: {},
    sepolia: {
        blockConfirmations: 6,
    },
    goerli: {
        blockConfirmations: 6,
    },
    optimism_Goerli: {
        blockConfirmations: 6,
    },
    avalanche_Fuji: {
        blockConfirmations: 6,
    },
    //80001
    mumbai: {
        blockConfirmations: 6,
    },
}

export const ROUTER: string = "0x70499c328e1e2a3c41108bd3730f6670a44595d1" //Mumbai = 0x70499c328e1e2a3c41108bd3730f6670a44595d1
export const LINK: string = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB" //Mumbai = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
export const VRF_WRAPPER: string = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889" // Mumbai = 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889
export const PRICE_FEED: string = "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada" // Mumbai = 0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
