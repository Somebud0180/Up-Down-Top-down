## Gravity & Movement Code (as is)
This includes top-down mode. For jumping, visit (placeholderJumpLink)

### Pre-requisites
- A way to spawn your player
- 4 Character Textures (Samples are given in the code)
  - Normal
  - Upside down
  - Top-down horizontal
  - Top-down vertical 

### Controls
| Key | Action        |
|:---:|:-------------:|
|  W  | to move up    |
|  A  | to move down  |
|  S  | to move left  |
|  D  | to move right |
|  I  | to move up    |
|  J  | to move up    |


``` js
// Declare Sprites
const player = "p";

// Set Defaults
let currentPlayer = playerDown;
let gravity = "down";
let rotation = "horizontal";

// Textures
const playerDown = bitmap`
................
................
................
................
.......22.......
......2222......
......2222......
................
......2222......
...2222222222...
....22222222....
.....222222.....
.....222222.....
......2222......
.......22.......
................`;
const playerUp = bitmap`
................
.......22.......
......2222......
.....222222.....
.....222222.....
....22222222....
...2222222222...
......2222......
................
......2222......
......2222......
.......22.......
................
................
................
................`;
const playerTop = bitmap`
................
................
................
................
.......11.......
......1221......
..LLL122221LLL..
.L221222222122L.
.L221222222122L.
..LLL122221LLL..
......1221......
.......11.......
................
................
................
................`;
const playerTopSide = bitmap`
................
.......LL.......
......L22L......
......L22L......
......L11L......
......1221......
.....122221.....
....12222221....
....12222221....
.....122221.....
......1221......
......L11L......
......L22L......
......L22L......
.......LL.......
................`;

// Controls
onInput("w", () => {
  if (gravity == "top") {
    rotation = "vertical";
    getFirst(player).y -= 1; // Moves player up
    characterInit();
  }
});

onInput("s", () => {
  if (gravity == "top") {
    rotation = "vertical";
    getFirst(player).y += 1; // Moves player down
    characterInit();
  }
});

onInput("a", () => {
    rotation = "horizontal";
    getFirst(player).x -= 1; // Moves player left
    characterInit();
  }
});

onInput("d", () => {
  rotation = "horizontal";
  getFirst(player).x += 1; // Moves player right
  characterInit();
});

onInput("i", () => {
  getFirst(player).y -= 1; // Moves player up
});

onInput("k", () => {
  getFirst(player).y -= 1; // Moves player up
});

onInput("j", () => {});

onInput("l", () => {});

// Gravity Code
function gravityPull() {
  let playerCoord = getFirst(player);
  let downCollision = getTile(playerCoord.x, playerCoord.y + 1);
  let upCollision = getTile(playerCoord.x, playerCoord.y - 1);
  // Collision check
  if (gravity == "down" && downCollision.length != 0) {
    // Checks if gravity up and if there is a block above the player
    isMoving = 0;
  } else if (gravity == "up" && upCollision.length != 0) {
    // Checks if gravity up and if there is a block above the player
    isMoving = 0;
  } else {
    isMoving += 1; // Jumping feels better requiring two iterations than longer intervals
  }

  // Apply Gravity
  if (isMoving > 1) {
    if (gravity == "down") {
      // If gravity is down and there is no block below, lower the player y
      getFirst(player).y++;
      if (getFirst(player).y == height() - 1) {
        // Check if player is at the bottom of the map, can be used to reset
      }
    } else if (gravity == "up") {
      // If gravity is up and there is no block above, increase the player y
      getFirst(player).y--;
      if (getFirst(player).y == 0) {
        // Check if player is at the bottom of the map, can be used to reset
      }
    }
  }
}

// Character Update Code
function characterInit() {
  // Checks for character gravity and applies the corresponding texture
  if (gravity == "down") {
    currentPlayer = playerDown;
  } else if (gravity == "up") {
    currentPlayer = playerUp;
  } else if (gravity == "top") {
    if (rotation == "vertical") {
      currentPlayer = playerTop;
    } else if (rotation == "horizontal") {
      currentPlayer = playerTopSide;
    }
  }
  setTextures();
}

// Texture Update Code
function setTextures() {
  setLegend(
    [player, currentPlayer],
    // Insert yours here
  );
}

// Set Interval Code
function updateGameIntervals() {
  // let intervalName = setInterval(code, delay) Where delay is measured in milliseconds
  let gravityLoopInterval = setInterval(gravityPull, 400); // Set interval for gravity calculation
}
```
