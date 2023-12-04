# BlockPass: An NFT ticketing system for events

## Pseudocode:

1. **Initialization:**

   - Initialize the contract with OpenZeppelin ERC721 and Ownable features.
   - Define a Counter for managing token IDs.

2. **Struct Definition:**

   - Define a struct `BlockPassDetails` to store information about each block pass.

3. **Variable Declarations:**

   - Declare variables to store the total count of block passes, block pass list, and various mappings.

4. **Event Definitions:**

   - Define events to emit when a block pass is created or booked.

5. **Constructor:**

   - Implement the constructor to set up the ERC721 contract.

6. **purchasePass Function:**

   - Allow users to purchase a block pass.
     - Check if the sent value is sufficient.
     - Check if the sales period is ongoing.
     - Check if passes are still available.
     - Mint a new NFT representing the purchased block pass.
     - Transfer funds to the organizer after deducting fees.
     - Update pass details and user records.
     - Emit the passBooked event.

7. **createNewPass Function:**

   - Allow organizers to create a new block pass.
     - Create a new BlockPassDetails struct with provided details.
     - Update mappings and arrays with the new block pass.
     - Increment the block pass count.
     - Emit the blockPassCreated event.

8. **updatePassTiming Function:**

   - Allow organizers to update the timing of a block pass.

9. **withdraw Function:**

   - Allow the contract owner to withdraw funds.

10. **Getters Functions:**

    - Implement functions to retrieve user tokens, booked passes, organizer's passes, total pass count, all passes, passes sold for a pass, check if a pass is over, and get passes by category.

11. **removeBlockPass Function:**

    - Allow organizers to remove a block pass they created.
      - Check authorization and ensure no passes are sold.
      - Remove the pass from arrays and mappings.

12. **removeEventAdmin Function:**
    - Allow the contract owner to remove a block pass.

## Algorithms:

<br>

`purchasePass:`

1.  <strong>function purchasePass(\_blockPassId):</strong>
2.                   _pass = getPassById[_blockPassId]
3.                   require(msg.value >= _pass.passPrice, "Insufficient funds")
4.                   require(block.timestamp <= _pass.salesEndTime, "Sales ended")
5.                   require(_pass.passesSold < _pass.max_passes, "Sold out")
6.                   tokenURI = concatenate(_pass.metadata)
7.                   mintToken(msg.sender, tokenId.current(), tokenURI)
8.                   fee = (msg.value * 10) / 1000
9.                   amountToOrganizer = msg.value - fee
10.                 transferFunds(_pass.organizer, amountToOrganizer)
11.                 _pass.passesSold++
12.                 updateBookedPassRecords(msg.sender, _pass)
13.                 emit passBooked(msg.sender, tokenId.current(), _pass.blockPassId)
14.                 tokenId.increment()

<br>

`createNewPass:`

1.  <strong>function createNewPass(\_max_pass_count, \_startTime, \_salesEndTime, \_passPrice, \_metadata, \_category):</strong>
2.               _pass = BlockPassDetails(organizer: msg.sender, blockPassId: blockPass_count, startTime: _startTime, max_passes: _max_pass_count, passPrice: _passPrice, passesSold: 0, metadata: _metadata, category: _category, salesEndTime: block.timestamp + _salesEndTime, bpEnded: false)
3.               updateMappingsAndArrays(_pass)
4.               incrementBlockPassCount()
5.               emit blockPassCreated(_pass.organizer, block.timestamp, _pass.blockPassId)

<br>

`updatePassTiming:`

1.  <strong>function updatePassTiming(\_blockPassId, \_newStartTime, \_newSalesEndTime):</strong>
2.        _pass = getPassById[_blockPassId]
3.        _pass.startTime = block.timestamp + _newStartTime
4.        _pass.salesEndTime = block.timestamp + _newSalesEndTime
