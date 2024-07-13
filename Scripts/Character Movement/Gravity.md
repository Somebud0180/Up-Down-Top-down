## Gravity & Movement Code
This includes gravity (Up, Down, Top-down), and movement code. Gravity without the other modes available at the bottom. For jumping, check out [Jump](Jump.md)

Trimmed Down:
- [Without top-down rotation](#for-top-down-mode-without-rotation)
- [Without top-down](#for-gravity-code-without-top-down)
- [Gravity downwards only](#for-gravity-code-solely-in-downward-direction)

### Pre-requisites
- Your player in the map, or a way to spawn the player
- 4 Character Textures (Since all gravity modes are included, samples are given in the code)
  - Normal
  - Upside down
  - Top-down horizontal 
  - Top-down vertical
 
### Variables

**downCollision**: A variable containing the tile below the player, used to check for collision in gravityPull().

**upCollision**: A variable containing the tile above the player, used to check for collision in gravityPull().

**rotation**: A variable used to track player facing, used in top-down mode.

**currentPlayer**: A variable used to track player texture, values are:
|     Value     | Corresponds to                    |
|:-------------:|:--------------------------------: |
| playerDown    | gravity down                      |
| playerUp      | gravity up                        |
| playerTop     | top-down mode facing vertically   |
| playerTopSide | top-down mode facing horizontally |

### Functions
**characterInit()**: A function used to rerun setLegend when character texture changes.

### Controls
| Key | Action                  |
|:---:|:----------------------: |
|  W  | to move up (top-down)   |
|  A  | to move down (top-down) |
|  S  | to move left            |
|  D  | to move right           |
|  I  | to move up              |
|  K  | to move up              |


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

// let intervalName = setInterval(code, delay) Where delay is measured in milliseconds
let gravityLoopInterval = setInterval(gravityPull, 400); // Set interval for gravity calculation
```

## Trimming Down
### For top-down mode without rotation
- Remove rotation variable
- Remove playerTopSide texture

#### Controls
| Key | Action                  |
|:---:|:----------------------: |
|  W  | to move up (top-down)   |
|  A  | to move down (top-down) |
|  S  | to move left            |
|  D  | to move right           |
|  I  | to move up              |
|  K  | to move up              |

``` js
// Declare Sprites
const player = "p";

// Set Defaults
let currentPlayer = playerDown;
let gravity = "down";

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

// Controls
onInput("w", () => {
  if (gravity == "top") {
    getFirst(player).y -= 1; // Moves player up
    characterInit();
  }
});

onInput("s", () => {
  if (gravity == "top") {
    getFirst(player).y += 1; // Moves player down
    characterInit();
  }
});

onInput("a", () => {
    getFirst(player).x -= 1; // Moves player left
    characterInit();
  }
});

onInput("d", () => {
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
      currentPlayer = playerTop;
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

// let intervalName = setInterval(code, delay) Where delay is measured in milliseconds
let gravityLoopInterval = setInterval(gravityPull, 400); // Set interval for gravity calculation
```

### For gravity code without top-down
- Remove rotation variable
- Remove top-down texture
- Remove gravity "top" variables

#### Controls
| Key | Action                  |
|:---:|:----------------------: |
|  S  | to move left            |
|  D  | to move right           |
|  I  | to jump                 |
|  K  | to jump                 |

``` js
// Declare Sprites
const player = "p";

// Set Defaults
let currentPlayer = playerDown;
let gravity = "down";
let rotation = "horizontal";
let jumpHeight = 0; // Check jumpUp()
let ableToJump = 0; // Check jumpUp()

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

// Controls
onInput("w", () => {
  getFirst(player).y -= 1; // Moves player up
});

onInput("s", () => {});

onInput("a", () => {
  getFirst(player).x -= 1; // Moves player left
  characterInit();
});

onInput("d", () => {
  getFirst(player).x += 1; // Moves player right
  characterInit();
});

onInput("i", () => {});

onInput("k", () => {});

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

// let intervalName = setInterval(code, delay) Where delay is measured in milliseconds
let gravityLoopInterval = setInterval(gravityPull, 400); // Set interval for gravity calculation
```

### For gravity code solely in downward direction
- Make player texture static
- Remove rotation variable
- Remove gravity variable
- Remove characterInit(), you may call setTextures() instead or move it away from function.

#### Controls
| Key | Action        |
|:---:|:------------: |
|  W  | to move up    |
|  S  | to move left  |
|  D  | to move right |

``` js
// Declare Sprites
const player = "p";

const playerTexture = bitmap`
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

// Set sprites
setLegend(
    [player, playerTexture],
    // Insert your sprites here
);

// Controls
onInput("w", () => {
  getFirst(player).y -= 1; // Moves player up
});

onInput("s", () => {
});

onInput("a", () => {
  getFirst(player).x -= 1; // Moves player left
});

onInput("d", () => {
  getFirst(player).x += 1; // Moves player right
});

onInput("i", () => {});

onInput("k", () => {});

onInput("j", () => {});

onInput("l", () => {});

// Gravity Code
function gravityPull() {
  let playerCoord = getFirst(player);
  let downCollision = getTile(playerCoord.x, playerCoord.y + 1);
  // Collision check
  if (downCollision.length != 0) {
    // Checks if gravity down and if there is a block above the player
    isMoving = 0;
  } else {
    isMoving += 1; // Jumping feels better requiring two iterations than longer intervals
  }

  // Apply Gravity
  if (isMoving > 1) {
      // If gravity is down and there is no block below, lower the player y
      getFirst(player).y++;
      if (getFirst(player).y == height() - 1) {
        // Check if player is at the bottom of the map, can be used to reset
    }
  }
}

// Set Interval Code
// let intervalName = setInterval(code, delay) Where delay is measured in milliseconds
let gravityLoopInterval = setInterval(gravityPull, 400); // Set interval for gravity calculation
```
