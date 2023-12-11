// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./PriceConverter.sol";

/**
 * @title BlockPass
 * @dev The main smart contract for creating and managing block passes.
 */
contract BlockPass is
    ERC721URIStorage,
    VRFV2WrapperConsumerBase,
    ConfirmedOwner
{
    using PriceConverter for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private tokenId;

    // Struct to store details of each block pass
    struct BlockPassDetails {
        address organizer;
        string metadata;
        string category;
        uint256 blockPassId;
        uint256 passesSold;
        uint256 max_passes;
        uint256 passPrice;
        uint256 startTime;
        uint256 salesEndTime;
        bool bpEnded;
    }

    struct RequestStatus {
        uint256 paid;
        bool fulfilled;
        uint256[] randomWords;
    }

    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 2;
    uint256 private blockPass_count = 0;

    // Arrays
    uint256[] public requestIds;
    uint256 public lastRequestId;
    AggregatorV3Interface public s_priceFeed;
    BlockPassDetails[] public blockPassList;

    mapping(uint256 => RequestStatus) public requestStatuses;
    mapping(uint256 => BlockPassDetails) public getPassById;
    mapping(address => BlockPassDetails[]) public bookedPassByUser;
    mapping(address => uint256[]) public userNftTokens;
    mapping(address => BlockPassDetails[]) public bpCreatedByOrganizer;

    // Events
    event blockPassCreated(
        address indexed organizer,
        uint256 indexed creationTime,
        uint256 blockPassId
    );
    event passBooked(
        address indexed buyer,
        uint256 tokenId,
        uint256 blockPassId
    );
    event limitedEditionPassPurchased(
        address indexed buyer,
        uint256 tokenId,
        uint256 blockPassId
    );

    event RequestSent(uint256 requestId, uint32 numWords);

    event RequestFulfilled(
        uint256 requestId,
        uint256[] randomWords,
        uint256 payment
    );

    // Constructor initializes the contract
    constructor(
        address _linkAddress,
        address _wrapperAddress,
        address priceFeedAddress
    )
        ERC721("Block Pass", "BP")
        ConfirmedOwner(msg.sender)
        VRFV2WrapperConsumerBase(_linkAddress, _wrapperAddress)
    {
        tokenId.increment();
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    /**
     * @dev Allows a user to purchase a block pass.
     * @param _blockPassId The ID of the block pass to be purchased.
     */
    function purchasePass(uint256 _blockPassId) public payable {
        BlockPassDetails storage _pass = getPassById[_blockPassId];
        require(msg.value.getPriceConverter(s_priceFeed) >= _pass.passPrice);
        require(block.timestamp <= _pass.salesEndTime, "Sales ended");
        require(_pass.passesSold < _pass.max_passes, "Sold out");

        // Mint a new NFT representing the purchased block pass
        string memory tokenURI = string(abi.encodePacked(_pass.metadata));
        _safeMint(msg.sender, tokenId.current());
        _setTokenURI(tokenId.current(), tokenURI);

        // Calculate fees and transfer funds to the organizer
        uint256 fee = (msg.value * 10) / 1000;
        uint256 amountToOrganizer = msg.value - fee;
        (bool success, ) = payable(_pass.organizer).call{
            value: amountToOrganizer
        }("");
        require(success);

        // Update block pass details and user records
        _pass.passesSold++;
        bookedPassByUser[msg.sender].push(_pass);
        userNftTokens[msg.sender].push(tokenId.current());

        // Emit event for the booked block pass
        emit passBooked(msg.sender, tokenId.current(), _pass.blockPassId);
        tokenId.increment();
    }

    /**
     * @dev Allows a user to purchase a Limited Edition blockpass ticket.
     * @param _blockPassId The ID of the block pass to be purchased.
     */
    function purchaseLimitedEditionPass(uint256 _blockPassId) public payable {
        uint256 requestId = requestRandomPassId();
        BlockPassDetails storage _pass = getPassById[_blockPassId];

        require(msg.value.getPriceConverter(s_priceFeed) >= _pass.passPrice);
        require(block.timestamp <= _pass.salesEndTime, "Sales ended");
        require(_pass.passesSold < _pass.max_passes, "Sold out");
        require(
            requestStatuses[requestId].fulfilled,
            "Random number not generated yet"
        );

        // Use the random number to determine if the user gets a limited edition pass
        uint256 randomNumber = requestStatuses[requestId].randomWords[0];
        bool isLimitedEdition = (randomNumber % 2 == 0);

        // Mint a new NFT representing the purchased blockpass ticket
        string memory tokenURI = string(abi.encodePacked(_pass.metadata));
        _safeMint(msg.sender, tokenId.current());
        _setTokenURI(tokenId.current(), tokenURI);

        // Calculate fees and transfer funds to the organizer
        uint256 fee = (msg.value * 10) / 1000;
        uint256 amountToOrganizer = msg.value - fee;
        (bool success, ) = payable(_pass.organizer).call{
            value: amountToOrganizer
        }("");
        require(success);

        // Update blockpass details and user records
        _pass.passesSold++;
        bookedPassByUser[msg.sender].push(_pass);
        userNftTokens[msg.sender].push(tokenId.current());

        emit passBooked(msg.sender, tokenId.current(), _pass.blockPassId);

        if (isLimitedEdition) {
            emit limitedEditionPassPurchased(
                msg.sender,
                tokenId.current(),
                _pass.blockPassId
            );
        }

        tokenId.increment();
    }

    /**
     * @dev Allows an organizer to create a new blockpass.
     * @param _max_pass_count The maximum number of passes available for the new blockpass ticket.
     * @param _startTime The start time of the blockpass.
     * @param _salesEndTime The end time of sales for the blockpass.
     * @param _passPrice The price for each block pass.
     * @param _metadata Additional metadata for the blockpass.
     * @param _category The category of the blockpass.
     */
    function createNewPass(
        uint256 _max_pass_count,
        uint256 _startTime,
        uint256 _salesEndTime,
        uint256 _passPrice,
        string memory _metadata,
        string memory _category
    ) external {
        // Create a new block pass with the provided details
        BlockPassDetails memory _pass = BlockPassDetails({
            organizer: msg.sender,
            blockPassId: blockPass_count,
            startTime: _startTime,
            max_passes: _max_pass_count,
            passPrice: _passPrice,
            passesSold: 0,
            metadata: _metadata,
            category: _category,
            salesEndTime: block.timestamp + _salesEndTime,
            bpEnded: false
        });

        // Update mappings and arrays with the new block pass
        getPassById[blockPass_count] = _pass;
        blockPassList.push(_pass);
        bpCreatedByOrganizer[msg.sender].push(_pass);

        // Increment block pass count and emit event for the creation of a new block pass
        blockPass_count++;
        emit blockPassCreated(
            _pass.organizer,
            block.timestamp,
            _pass.blockPassId
        );
    }

    function requestRandomPassId() public returns (uint256 requestId) {
        requestId = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords
        );
        requestStatuses[requestId] = RequestStatus(
            VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
            false,
            new uint256[](0)
        );
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(requestStatuses[_requestId].paid > 0, "request not found");
        requestStatuses[_requestId].fulfilled = true;
        requestStatuses[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(
            _requestId,
            _randomWords,
            requestStatuses[_requestId].paid
        );
    }

    function getRequestStatus(
        uint256 _requestId
    )
        external
        view
        returns (uint256 paid, bool fulfilled, uint256[] memory randomWords)
    {
        require(requestStatuses[_requestId].paid > 0, "request not found");
        RequestStatus memory request = requestStatuses[_requestId];
        return (request.paid, request.fulfilled, request.randomWords);
    }

    /**
     * @dev Allows the contract owner to withdraw funds from the contract.
     */
    function withdraw() public onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}(
            ""
        );
        require(success);
    }

    // GETTERS

    /**
     * @dev Retrieves the NFT tokens owned by a specific user.
     * @param _user The address of the user.
     * @return An array of NFT token IDs owned by the user.
     */
    function getUserTokens(
        address _user
    ) public view returns (uint256[] memory) {
        return userNftTokens[_user];
    }

    /**
     * @dev Retrieves the block passes booked by a specific user.
     * @param _user The address of the user.
     * @return An array of block passes booked by the user.
     */
    function blockPassesBookedByUser(
        address _user
    ) public view returns (BlockPassDetails[] memory) {
        return bookedPassByUser[_user];
    }

    /**
     * @dev Retrieves an array of all blockpasses in the contract.
     * @return An array of block passes.
     */
    function allBlockPassList()
        public
        view
        returns (BlockPassDetails[] memory)
    {
        return blockPassList;
    }

    /**
     * @dev Retrieves an array of block passes belonging to a specific category.
     * @param _category The category of block passes to retrieve.
     * @return An array of block passes in the specified category.
     */
    function getByCategory(
        string memory _category
    ) public view returns (BlockPassDetails[] memory) {
        uint256 i = 0;
        uint256 arrayCount = 0;
        BlockPassDetails[] memory blockPassCategory = new BlockPassDetails[](
            blockPassList.length
        );

        // Iterate through all block passes and filter by category
        for (; i < blockPassList.length; i++) {
            BlockPassDetails memory currentBlockPass = blockPassList[i];

            if (
                keccak256(abi.encodePacked(currentBlockPass.category)) ==
                keccak256(abi.encodePacked(_category))
            ) {
                blockPassCategory[arrayCount] = currentBlockPass;
                arrayCount++;
            }
        }

        return blockPassCategory;
    }
}
