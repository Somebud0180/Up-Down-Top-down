## Darkness Effect
Known in the game as displayBlocksInRange()

### Pre-requisites
- Top-down mode (Either with the Gravity or Jump code)

### Usage 
If you'd rather make this an interval, you can remove displayBlocksInRange() from afterInput and after setMap

After loading a level, run the following
``` js
allBlocks = getAll(block); // Grabs all blocks in the map and saves them.
displayBlocksInRange(); // Make sure the player is in the map when this is runned
```

All the code
``` js
let allBlocks; // Declare this outside the function

// setMap() here
allBlocks = getAll(block); // Grabs all blocks in the map and saves them.
displayBlocksInRange(); // Make sure the player is in the map when this is runned

afterInput(() => {
  // Updates the visible and invisible blocks when moving
  displayBlocksInRange();
});

function displayBlocksInRange() {
  if (gravity == "top") {
    if (getFirst(player)) {
      // Get the player's coordinates
      playerCoord = getFirst(player);
      let playerX = playerCoord.x;
      let playerY = playerCoord.y;

      // Define the range around the player (5 grids in each direction)
      const range = 3;

      for (let blockSprite of allBlocks) {
        let blockX = blockSprite.x;
        let blockY = blockSprite.y;
        addSprite(blockX, blockY, block);
      }

      for (let blockSprite of allBlocks) {
        let blockX = blockSprite.x;
        let blockY = blockSprite.y;

        // Calculate the distance between the block and the player
        const distance = Math.abs(blockX - playerX) + Math.abs(blockY - playerY);

        // Check if the block is within the specified range around the player
        if (distance <= range) {
          if (!getTile(blockX, blockY)) {
            // If block is within range, add it to the game
            addSprite(blockX, blockY, blockSprite.type);
          }
        } else {
          if (getTile(blockX, blockY)) {
            // If block exceeds the range, remove it from the game
            clearTile(blockX, blockY);
          }
        }
      }
    }
  }
}


```
