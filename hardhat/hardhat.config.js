require("@nomicfoundation/hardhat-toolbox")

require("dotenv").config()
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan")

const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHEREUM_SEPOLIA_RPC_URL = process.env.ETHEREUM_SEPOLIA_RPC_URL
const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL
const OPTIMISM_GOERLI_RPC_URL = process.env.OPTIMISM_GOERLI_RPC_URL
const ARBITRUM_TESTNET_RPC_URL = process.env.ARBITRUM_TESTNET_RPC_URL
const AVALANCHE_FUJI_RPC_URL = process.env.AVALANCHE_FUJI_RPC_URL

module.exports = {
    defaultNetwork: "ethereumSepolia",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        ethereumSepolia: {
            url:
                ETHEREUM_SEPOLIA_RPC_URL !== undefined
                    ? ETHEREUM_SEPOLIA_RPC_URL
                    : "",
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            chainId: 11155111,
        },
        polygonMumbai: {
            url:
                POLYGON_MUMBAI_RPC_URL !== undefined
                    ? POLYGON_MUMBAI_RPC_URL
                    : "",
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            chainId: 80001,
        },
        optimismGoerli: {
            url:
                OPTIMISM_GOERLI_RPC_URL !== undefined
                    ? OPTIMISM_GOERLI_RPC_URL
                    : "",
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            chainId: 420,
        },
        arbitrumTestnet: {
            url:
                ARBITRUM_TESTNET_RPC_URL !== undefined
                    ? ARBITRUM_TESTNET_RPC_URL
                    : "",
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            chainId: 421613,
        },
        avalancheFuji: {
            url:
                AVALANCHE_FUJI_RPC_URL !== undefined
                    ? AVALANCHE_FUJI_RPC_URL
                    : "",
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            chainId: 43113,
        },
    },

    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },

    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "ETH",
    },

    etherscan: {
        apiKey: {
            polygonMumbai: POLYGONSCAN_API_KEY,
            sepolia: ETHERSCAN_API_KEY,
        },
    },

    namedAccounts: {
        deployer: {
            default: 0,
        },
        users: {
            default: 0,
        },
    },
}
