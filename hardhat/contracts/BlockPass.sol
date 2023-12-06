// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./PriceConverter.sol";

/**
 * @title BlockPass
 * @dev The main smart contract for creating and managing blockpasses Tickets.
 */
contract BlockPass is Ownable, ERC721URIStorage, VRFV2WrapperConsumerBase {
    using Counters for Counters.Counter;
    Counters.Counter private tokenId;

    // Struct to store details of each blockpass
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
    BlockPassDetails[] public blockPassList;

    mapping(uint256 => RequestStatus) public requestStatuses;
    mapping(uint256 => BlockPassDetails) public getPassById;
    mapping(address => BlockPassDetails[]) public bookedPassByUser;
    mapping(address => uint256[]) public userNftTokens;
    mapping(address => BlockPassDetails[]) public blockPassCreatedByOrganizer;

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

    // Constructor initializes the contract
    constructor(
        address initialOwner,
        address _linkAddress,
        address _wrapperAddress
    )
        Ownable(initialOwner)
        ERC721("blockpass", "BP")
        VRFV2WrapperConsumerBase(_linkAddress, _wrapperAddress)
    {
        tokenId.increment();
    }

    /**
     * @dev Allows a user to purchase a blockpass.
     * @param _blockPassId The ID of the blockpass to be purchased.
     */
    function purchasePass(uint256 _blockPassId) public payable {
        BlockPassDetails storage _pass = getPassById[_blockPassId];
        require(msg.value >= _pass.passPrice);
        require(block.timestamp <= _pass.salesEndTime, "Sales ended");
        require(_pass.passesSold < _pass.max_passes, "Sold out");

        // Mint a new NFT representing the purchased blockpass
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

        // Emit event for the booked blockpass
        emit passBooked(msg.sender, tokenId.current(), _pass.blockPassId);
        tokenId.increment();
    }

    /**
     * @dev Allows a user to purchase a Limited Edition blockpass ticket.
     * @param _blockPassId The ID of the blockpass to be purchased.
     */
    function purchaseLimitedEditionPass(uint256 _blockPassId) public payable {
        uint256 requestId = requestRandomEventId();
        BlockPassDetails storage _pass = getPassById[_blockPassId];

        require(msg.value >= _pass.passPrice);
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
     * @param _passPrice The price for each blockpass.
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
        // Create a new blockpass with the provided details
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

        // Update mappings and arrays with the new blockpass
        getPassById[blockPass_count] = _pass;
        blockPassList.push(_pass);
        blockPassCreatedByOrganizer[msg.sender].push(_pass);

        // Increment blockpass count and emit event for the creation of a new blockpass
        blockPass_count++;
        emit blockPassCreated(
            _pass.organizer,
            block.timestamp,
            _pass.blockPassId
        );
    }

    /**
     * @dev Allows an organizer to update the timing of a blockpass.
     * @param _blockPassId The ID of the blockpass to be updated.
     * @param _newStartTime The new start time for the blockpass.
     * @param _newSalesEndTime The new end time for sales of the blockpass.
     */
    function updatePassTiming(
        uint256 _blockPassId,
        uint256 _newStartTime,
        uint256 _newSalesEndTime
    ) external {
        // Update the timing of the specified blockpass
        BlockPassDetails storage _pass = getPassById[_blockPassId];
        _pass.startTime = block.timestamp + _newStartTime;
        _pass.salesEndTime = block.timestamp + _newSalesEndTime;
    }

    function requestRandomEventId() public returns (uint256 requestId) {
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
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(requestStatuses[_requestId].paid > 0, "request not found");
        requestStatuses[_requestId].fulfilled = true;
        requestStatuses[_requestId].randomWords = _randomWords;
        uint256 passId = uint256(keccak256(abi.encodePacked(_randomWords)));
        BlockPassDetails memory _pass = getPassById[passId];
        _pass.blockPassId = _randomWords[0] % 1000;
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
     * @dev Retrieves the blockpasses booked by a specific user.
     * @param _user The address of the user.
     * @return An array of blockpasses booked by the user.
     */
    function blockPassesBookedByUser(
        address _user
    ) public view returns (BlockPassDetails[] memory) {
        return bookedPassByUser[_user];
    }

    /**
     * @dev Retrieves the blockpasses created by a specific organizer.
     * @param _organizer The address of the organizer.
     * @return An array of blockpasses created by the organizer.
     */
    function organizerBlockPasses(
        address _organizer
    ) public view returns (BlockPassDetails[] memory) {
        return blockPassCreatedByOrganizer[_organizer];
    }

    /**
     * @dev Retrieves the total number of blockpasses in the contract.
     * @return The total number of blockpasses.
     */
    function totalNumberOfBlockPassList() public view returns (uint256) {
        return blockPassList.length;
    }

    /**
     * @dev Retrieves an array of all blockpasses in the contract.
     * @return An array of blockpasses.
     */
    function allBlockPassList()
        public
        view
        returns (BlockPassDetails[] memory)
    {
        return blockPassList;
    }

    /**
     * @dev Retrieves the number of passes sold for a specific blockpass.
     * @param _blockPassId The ID of the blockpass.
     * @return The number of passes sold for the blockpass.
     */
    function passesSoldForBlockPass(
        uint256 _blockPassId
    ) public view returns (uint256) {
        return getPassById[_blockPassId].passesSold;
    }

    /**
     * @dev Checks if a specific blockpass has ended.
     * @param _blockPassId The ID of the blockpass.
     * @return A boolean indicating whether the blockpass has ended.
     */
    function isBlockPassOver(uint256 _blockPassId) public view returns (bool) {
        return getPassById[_blockPassId].bpEnded;
    }

    /**
     * @dev Retrieves an array of blockpasses belonging to a specific category.
     * @param _category The category of blockpasses to retrieve.
     * @return An array of blockpasses in the specified category.
     */
    function getByCategory(
        string memory _category
    ) public view returns (BlockPassDetails[] memory) {
        uint256 i = 0;
        uint256 arrayCount = 0;
        BlockPassDetails[] memory blockPassCategory = new BlockPassDetails[](
            blockPassList.length
        );

        // Iterate through all blockpasses and filter by category
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

    /**
     * @dev Allows an organizer to remove a blockpass they created.
     * @param _blockPassId The ID of the blockpass to be removed.
     */
    function removeBlockPass(uint256 _blockPassId) external {
        uint256 i = 0;
        uint256 envIndex = 0;
        BlockPassDetails storage _pass = getPassById[_blockPassId];
        require(_pass.organizer == msg.sender, "Not Authorized");
        require(_pass.passesSold == 0, "Passes already bought");

        // Remove from blockPassCreatedByOrganizer array
        for (; i < blockPassCreatedByOrganizer[msg.sender].length - 1; i++) {
            BlockPassDetails memory _aPass = blockPassCreatedByOrganizer[
                msg.sender
            ][i];
            if (_aPass.blockPassId == _blockPassId) {
                break;
            }
        }
        for (
            uint256 index = i;
            index < blockPassCreatedByOrganizer[msg.sender].length - 1;
            index++
        ) {
            blockPassCreatedByOrganizer[msg.sender][
                index
            ] = blockPassCreatedByOrganizer[msg.sender][index + 1];
        }
        blockPassCreatedByOrganizer[msg.sender].pop();

        // Remove from general blockPassList array
        for (; envIndex < blockPassList.length - 1; envIndex++) {
            BlockPassDetails memory _anotherEv = blockPassList[envIndex];
            if (_anotherEv.blockPassId == _blockPassId) {
                break;
            }
        }

        for (
            uint256 index = envIndex;
            index < blockPassList.length - 1;
            index++
        ) {
            blockPassList[index] = blockPassList[index + 1];
        }
        blockPassList.pop();

        // Remove from getPassById mapping
        delete getPassById[_blockPassId];
    }

    /**
     * @dev Allows the contract owner to remove a blockpass.
     * @param _blockPassId The ID of the blockpass to be removed.
     */
    function removeBlockPassAdmin(uint256 _blockPassId) external onlyOwner {
        uint256 envIndex = 0;
        // Remove from general blockPassList array

        for (; envIndex < blockPassList.length - 1; envIndex++) {
            BlockPassDetails memory _pass = blockPassList[envIndex];
            if (_pass.blockPassId == _blockPassId) {
                break;
            }
        }

        for (
            uint256 index = envIndex;
            index < blockPassList.length - 1;
            index++
        ) {
            blockPassList[index] = blockPassList[index + 1];
        }
        blockPassList.pop();
    }
}
