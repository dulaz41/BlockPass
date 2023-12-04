// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockPass is Ownable, ERC721URIStorage {
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

    uint256 private blockPass_count = 0;

    // Arrays to store lists of block passes and mappings for quick access
    BlockPassDetails[] public blockPassList;
    mapping(uint256 => BlockPassDetails) public getPassById;
    mapping(address => BlockPassDetails[]) public bookedPassByUser;
    mapping(address => uint256[]) public userNftTokens;
    mapping(address => BlockPassDetails[]) public blockPassCreatedByOrganizer;

    // Events emitted on successful operations
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

    // Constructor initializes the contract
    constructor(
        address initialOwner
    ) Ownable(initialOwner) ERC721("Block Pass", "BP") {
        tokenId.increment();
    }

    /**
     * @dev Allows a user to purchase a block pass.
     * @param _blockPassId The ID of the block pass to be purchased.
     */
    function purchasePass(uint256 _blockPassId) public payable {
        BlockPassDetails storage _pass = getPassById[_blockPassId];
        require(msg.value >= _pass.passPrice);
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
     * @dev Allows an organizer to create a new block pass.
     * @param _max_pass_count The maximum number of passes available for the new block pass.
     * @param _startTime The start time of the block pass.
     * @param _salesEndTime The end time of sales for the block pass.
     * @param _passPrice The price for each block pass.
     * @param _metadata Additional metadata for the block pass.
     * @param _category The category of the block pass.
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
        blockPassCreatedByOrganizer[msg.sender].push(_pass);

        // Increment block pass count and emit event for the creation of a new block pass
        blockPass_count++;
        emit blockPassCreated(
            _pass.organizer,
            block.timestamp,
            _pass.blockPassId
        );
    }

    /**
     * @dev Allows an organizer to update the timing of a block pass.
     * @param _blockPassId The ID of the block pass to be updated.
     * @param _newStartTime The new start time for the block pass.
     * @param _newSalesEndTime The new end time for sales of the block pass.
     */
    function updatePassTiming(
        uint256 _blockPassId,
        uint256 _newStartTime,
        uint256 _newSalesEndTime
    ) external {
        // Update the timing of the specified block pass
        BlockPassDetails storage _pass = getPassById[_blockPassId];
        _pass.startTime = block.timestamp + _newStartTime;
        _pass.salesEndTime = block.timestamp + _newSalesEndTime;
    }

    /**
     * @dev Allows the contract owner to withdraw funds from the contract.
     */
    function withdraw() public onlyOwner {
        // Transfer contract balance to the owner
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
     * @dev Retrieves the block passes created by a specific organizer.
     * @param _organizer The address of the organizer.
     * @return An array of block passes created by the organizer.
     */
    function organizerBlockPasses(
        address _organizer
    ) public view returns (BlockPassDetails[] memory) {
        return blockPassCreatedByOrganizer[_organizer];
    }

    /**
     * @dev Retrieves the total number of block passes in the contract.
     * @return The total number of block passes.
     */
    function totalNumberOfBlockPassList() public view returns (uint) {
        return blockPassList.length;
    }

    /**
     * @dev Retrieves an array of all block passes in the contract.
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
     * @dev Retrieves the number of passes sold for a specific block pass.
     * @param _blockPassId The ID of the block pass.
     * @return The number of passes sold for the block pass.
     */
    function passesSoldForBlockPass(
        uint256 _blockPassId
    ) public view returns (uint) {
        return getPassById[_blockPassId].passesSold;
    }

    /**
     * @dev Checks if a specific block pass has ended.
     * @param _blockPassId The ID of the block pass.
     * @return A boolean indicating whether the block pass has ended.
     */
    function isBlockPassOver(uint _blockPassId) public view returns (bool) {
        return getPassById[_blockPassId].bpEnded;
    }

    /**
     * @dev Retrieves an array of block passes belonging to a specific category.
     * @param _category The category of block passes to retrieve.
     * @return An array of block passes in the specified category.
     */
    function getByCategory(
        string memory _category
    ) public view returns (BlockPassDetails[] memory) {
        uint i = 0;
        uint arrayCount = 0;
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

    /**
     * @dev Allows an organizer to remove a block pass they created.
     * @param _blockPassId The ID of the block pass to be removed.
     */
    function removeBlockPass(uint _blockPassId) external {
        uint i = 0;
        uint envIndex = 0;
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
            uint index = i;
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

        for (uint index = envIndex; index < blockPassList.length - 1; index++) {
            blockPassList[index] = blockPassList[index + 1];
        }
        blockPassList.pop();

        // Remove from getPassById mapping
        delete getPassById[_blockPassId];
    }

    /**
     * @dev Allows the contract owner to remove a block pass.
     * @param _blockPassId The ID of the block pass to be removed.
     */
    function removeBlockPassAdmin(uint256 _blockPassId) external onlyOwner {
        uint envIndex = 0;
        // Remove from general blockPassList array

        for (; envIndex < blockPassList.length - 1; envIndex++) {
            BlockPassDetails memory _pass = blockPassList[envIndex];
            if (_pass.blockPassId == _blockPassId) {
                break;
            }
        }

        for (uint index = envIndex; index < blockPassList.length - 1; index++) {
            blockPassList[index] = blockPassList[index + 1];
        }
        blockPassList.pop();
    }
}
