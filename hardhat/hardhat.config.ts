// @ts-nocheck

import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-ethers"
import "hardhat-gas-reporter"
import "dotenv/config"
import "solidity-coverage"
import "hardhat-deploy"
import "hardhat-contract-sizer"
import { HardhatUserConfig } from "hardhat/config"

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const SEPOLIA_RPC_URL =
    process.env.SEPOLIA_RPC_URL ||
    "https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "privateKey"
const GOERLI_URL = process.env.GOERLI_URL
const POLYGON_URL = process.env.POLYGON_URL
const CONFLUX_ESPACE_URL = process.env.CONFLUX_ESPACE_URL
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY
const OPTIMISM_GOERLI_API_KEY = process.env.OPTIMISM_GOERLI_API_KEY
const ARBITRUM_GOERLI_API_KEY = process.env.ARBITRUM_GOERLI_API_KEY
const SCROLL_SEPOLIA_RPC_URL = process.env.SCROLL_SEPOLIA_RPC_URL
const SCROLLSCAN_API_KEY = process.env.SCROLLSCAN_API_KEY
const OPTIMISM_GOERLI_RPC_URL = process.env.OPTIMISM_GOERLI_RPC_URL
const AVALANCHE_FUJI_RPC_URL = process.env.AVALANCHE_FUJI_RPC_URL
const ARBITRUM_GOERLI_RPC_URL = process.env.ARBITRUM_GOERLI_RPC_URL

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            allowUnlimitedContractSize: true,
        },
        localhost: {
            chainId: 31337,
            allowUnlimitedContractSize: true,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
        },
        goerli: {
            url: GOERLI_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
        },
        mumbai: {
            url: POLYGON_URL,
            accounts: [PRIVATE_KEY],
            chainId: 80001,
        },
        conflux_eSpace: {
            url: CONFLUX_ESPACE_URL,
            accounts: [PRIVATE_KEY],
            chainId: 71,
        },
        scrollSepolia: {
            url:
                SCROLL_SEPOLIA_RPC_URL !== undefined
                    ? SCROLL_SEPOLIA_RPC_URL
                    : "",
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            chainId: 534351,
        },
        optimism_Goerli: {
            url:
                OPTIMISM_GOERLI_RPC_URL !== undefined
                    ? OPTIMISM_GOERLI_RPC_URL
                    : "",
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            chainId: 420,
        },
        avalanche_Fuji: {
            url:
                AVALANCHE_FUJI_RPC_URL !== undefined
                    ? AVALANCHE_FUJI_RPC_URL
                    : "",
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            chainId: 43113,
        },
        arbitrum_Goerli: {
            url:
                ARBITRUM_GOERLI_RPC_URL !== undefined
                    ? ARBITRUM_GOERLI_RPC_URL
                    : "",
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            chainId: 421613,
        },
    },
    solidity: {
        compilers: [
            { version: "0.8.20" },
            { version: "0.8.9" },
            { version: "0.6.6" },
        ],
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
                details: {
                    yul: false,
                },
            },
        },
    },
    viaIR: true,
    etherscan: {
        apiKey: {
            goerli: ETHERSCAN_API_KEY,
            polygonMumbai: POLYGONSCAN_API_KEY,
            sepolia: ETHERSCAN_API_KEY,
            scrollSepolia: SCROLLSCAN_API_KEY,
            optimisticGoerli: OPTIMISM_GOERLI_API_KEY,
        },
        customChains: [
            {
                network: "avalancheFujiTestnet",
                chainId: 43113,
                urls: {
                    apiURL: "https://testnet.snowtrace.io/api",
                    browserURL: "https://testnet.snowtrace.io/",
                },
            },
        ],
    },

    contractSizer: {
        alphaSort: true,
        disambiguatePaths: false,
        runOnCompile: true,
        strict: true,
        only: [":ERC20$"],
    },

    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
    mocha: {
        timeout: 200000, // 200 seconds max for running tests
    },
}

export default config
