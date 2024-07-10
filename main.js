/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: 
@author: 
@tags: []
@addedOn: 2024-00-00
*/

const player = "p";
const background = "z";
const arrow = "a";
const block = "b";
const magicBlock = "m";
const flagDown = "f";
const flagUp = "i";
let gravityBlockDown = "d";
let gravityBlockUp = "u";
let isMoving = 0;
let jumpHeight = 0;
let lastClickTime = 0;
let playerCoord;
let belowTile;
let lowerTile;

let gravityDetectionInterval;
let gravityLoopInterval;
let jumpLoopInterval;

// Resources
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

let backgroundTexture = bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`;
let arrowTexture = bitmap`
........22......
........222.....
........2222....
........22222...
.2222222222222..
.22222222222222.
.22222222222222.
.2222222222222..
........22222...
........2222....
........222.....
........22......
................
................
................
................`
let magicBlockTexture = bitmap`
0000000000000000
0202222222222220
0200000000000020
0200000000000020
0200222222220020
0200000000020020
0200200000020020
0200200550020020
0200200550020020
0200200000020020
0200200000020020
0200222222020020
0200000000000020
0200000000000000
0222222222222220
0000000000000000`;
let blockTexture = bitmap`
0022222222222222
2002222222222222
2200000000000022
2200000000000022
2200222222220022
2200000000020022
2200200000020022
2200200770020022
2200200770020022
2200200000020022
2200200000020022
2200222222020022
2200000000000002
2200000000000000
2222222222222220
2222222222222222`;
let gravityBlockDownTexture = bitmap`
................
......7777......
......7777......
......7777......
......7777......
......7777......
....77777777....
.....777777.....
......7777......
...77..77..77...
...77......77...
...77......77...
.777777..777777.
..7777....7777..
...77......77...
................`;
let gravityBlockUpTexture = bitmap`
................
...99......99...
..9999....9999..
.999999..999999.
...99......99...
...99......99...
...99..99..99...
......9999......
.....999999.....
....99999999....
......9999......
......9999......
......9999......
......9999......
......9999......
................`;
let flagDownTexture = bitmap`
................
................
..CCDDDD...DDD..
..CCDDDDDDDDDD..
..CCDDDDDDDDDD..
..CCDDDDDDDDDD..
..CCDDDDDDDDDD..
..CCDDDDDDDDDD..
..CCDDDDDDDDDD..
..CC...DDDDD....
..CC............
..CC............
..CC............
..CC............
..CC............
..CC............`;
let flagUpTexture = bitmap`
............CC..
............CC..
............CC..
............CC..
............CC..
............CC..
....DDDDD...CC..
..DDDDDDDDDDCC..
..DDDDDDDDDDCC..
..DDDDDDDDDDCC..
..DDDDDDDDDDCC..
..DDDDDDDDDDCC..
..DDDDDDDDDDCC..
..DDD...DDDDCC..
................
................`;

const levels = [
  map`
b.mmmmmmmmmmm.b
d.mu.......dm.d
..m.........m..
..m.........m..
..mmmmmmmmmmm..
...............
...............
...............
...........u...
...........b...
u.bb..b.b.b...f
b.............b`,
  map`
...............
...............
..............f
............bbb
..........b....
...............
........b......
.......b.......
.....b.........
..b.b..........
bb.............
...............`,
  map`
............bbb
........bb....i
..b............
..d............
...............
...............
...............
...............
...............
.u..u..........
bb..b..........
...............`,
  map`
bbbbbbbbbbbbbbb
b......b......f
bbb.bbbb.bb.bbb
b...b..b..b...b
b.b....bbbbb..b
b.bbbb.b...bb.b
b..b.bbb.b..b.b
b.bb...b.bb.b.b
b....b.b......b
bbbb.b.bb.bbb.b
.....b....b...b
bbbbbbbbbbbbbbb`,
];

const errorSFX = tune`
500: D4-500,
500: C4-500,
15000`;
const stepSFX = tune`
37.5,
37.5: G4~37.5,
37.5: C4/37.5 + D4/37.5 + G4-37.5,
1087.5`;
const jumpSFX = tune`
375: B4^375 + C5^375 + D5^375 + A4~375 + G4~375,
11625`;
const doubleJumpSFX = tune`
714.2857142857143,
714.2857142857143: B4~714.2857142857143 + C5~714.2857142857143 + D5^714.2857142857143 + E5^714.2857142857143 + F5^714.2857142857143,
21428.57142857143`;
const gravityChangeSFX = tune`
185.1851851851852: C5-185.1851851851852,
185.1851851851852: D5-185.1851851851852,
5555.555555555556`;
const finishSFX = tune`
240: A5~240,
240: B5~240,
240: A5~240,
6960`;

// Texts (Looks more clean here)
let mainMenuTitle = `
  Up  Down
  
  Top-Down
`;

let mainMenuOptions = `
  Start Game
  ----------
  
  Guide
`;

let errorSpawn = `
  Error: Couldn't 
        
  find empty tile
        
  for player spawn
`;

let deathText = `
  You died!
`;

// Game Default States
let inGame = 0;
let arrowOption = 0
let level = 0;
let spawnX = 0; // Static
let spawnY = 0; // Now automated
let spawnHeight = 0;
let currentPlayer = playerDown;
let gravity = "down";
let rotation = "horizontal";

// Main Menu starts here
function mainMenu() {
  setTextures()
  setMap(levels[level]);
  setBackground(background)
  addText(mainMenuTitle, {
    x: 4,
    y: 1,
    color: color`2`
  })
  addText(mainMenuOptions, {
    x: 3,
    y: 7,
    color: color`2`
  })
  addSprite(2, 6, arrow)

}

mainMenu()

// Set Level
function initializeGame() {
  setTextures();
  setSolids([player, block]);
  setPushables({
    [player]: [], });
  setBackground(background)
  setMap(levels[level]);

  spawn(); // Start Game
}

// Controls
onInput("k", () => {
  if (inGame == 1) {
    jumpUp()
  }
});

onInput("i", () => {
  if (inGame == 1) {
    jumpUp()
  }
});

onInput("a", () => {
  if (inGame == 1) {
    rotation = "horizontal";
    getFirst(player).x -= 1;
    playTune(stepSFX);
    characterInit();
  }
});

onInput("d", () => {
  if (inGame == 1) {
    rotation = "horizontal";
    getFirst(player).x += 1;
    playTune(stepSFX);
    characterInit();
  }
});

onInput("w", () => {
  if (inGame == 0) {
    arrowUp()
  } else if (inGame == 1) {
    if (gravity == "top") {
      rotation = "vertical";
      getFirst(player).y -= 1;
      playTune(stepSFX);
      characterInit();
    }
  }
});

onInput("s", () => {
  if (inGame == 0) {
    arrowDown()
  } else if (inGame == 1) {
    if (gravity == "top") {
      rotation = "vertical";
      getFirst(player).y += 1;
      playTune(stepSFX);
      characterInit();
    }
  }
});

// Tile interaction checks
afterInput(() => {
  if (inGame == 1) {
    let playerCoord = getFirst(player);
    // console.log("Player checking")
    let surroundingTiles = [
      getTile(playerCoord.x, playerCoord.y + 1)[0], // Tile below player
      getTile(playerCoord.x + 1, playerCoord.y)[0], // Tile to the right of player
      getTile(playerCoord.x - 1, playerCoord.y)[0], // Tile to the left of playerd
    ];

    let flagFound = surroundingTiles.some(
      (tile) => tile && (tile.type === flagDown || tile.type === flagUp),
    );

    if (flagFound) {
      playTune(finishSFX, 1);
      level++;
      spawn();
    }
  }
});

// Game Logic
// Main Menu Arrow Code
// Arrow Down
function arrowDown() {
  if (arrowOption == 0) {
    getFirst(arrow).y += 2
    arrowOption++
  } else {
    playTune(errorSFX)
  }
}

function arrowUp() {
  if (arrowOption == 1) {
    getFirst(arrow).y -= 2
    arrowOption--
  } else {
    playTune(errorSFX)
  }
}

// Texture Update Code
function setTextures() {
  setLegend(
    [player, currentPlayer],
    [arrow, arrowTexture],
    [background, backgroundTexture],
    [block, blockTexture],
    [magicBlock, magicBlockTexture],
    [flagDown, flagDownTexture],
    [flagUp, flagUpTexture],
    [gravityBlockDown, gravityBlockDownTexture],
    [gravityBlockUp, gravityBlockUpTexture],
  );
}

// Special Map Check
function mapCheck() {
  if (level == 3) {
    gravity = "top";
  }
}

// Dynamic Spawn Finding Code
function spawnFind() {
  spawnY = 0;
  spawnHeight = height() - 1;
  while (spawnY == 0) {
    for (spawnHeight >= 0; spawnHeight--;) {
      console.log("Finding spawn...");
      if (getTile(spawnX, spawnHeight).length === 0 && spawnHeight > 1) {
        spawnY = spawnHeight;
        console.log("Air found at " + spawnY);
        break; // Exit the loop if air block is found
      } else if (spawnHeight < 2) {
        addText(errorSpawn, {
          x: -6,
          y: 5,
          color: color`3`,
        });
        setTimeout(() => {
          console.log("Error: Couldn't find empty tile for player spawn");
          level--;
          spawn();
        }, 5000);
        return; // Break the loop if no empty tile is found
      }
    }
  }
}

//Spawn Code
function spawn() {
  clearText(); // Cleans stuff before it
  characterInit();
  setMap(levels[level]);
  mapCheck();
  spawnFind();
  addSprite(spawnX, spawnY, player);
  inGame = 1;
  handleGameIntervals()
}

// Reset Code
function reset() {
  inGame = 2;
  handleGameIntervals()
  getFirst(player).remove();
  addText(deathText, -5, 2, color`0`);
  setTimeout(() => spawn(), 3000);
}

// Jump Code
function jumpUp() {
  playerCoord = getFirst(player);
  if (gravity == "down") {
    belowTile = getTile(playerCoord.x, playerCoord.y + 1);
    lowerTile = getTile(playerCoord.x, playerCoord.y + 2);
  } else if (gravity == "top") {
    belowTile = getTile(playerCoord.x, playerCoord.y - 1);
    lowerTile = getTile(playerCoord.x, playerCoord.y - 2);
  }
  if (
    (lowerTile.length == 0 && belowTile.length != 0 && gravity != "top") ||
    (lowerTile.length != 0 && belowTile.length == 0 && gravity != "top")
  ) {
    if (gravity == "down") {
      jumpHeight += 1;
    } else if (gravity == "up") {
      jumpHeight -= 1;
    }
    playTune(jumpSFX);
  }
}

// Jump Velocity Code
function jumpPull() {
  while (jumpHeight < 0) {
    getFirst(player).y++;
    jumpHeight++;
  }
  while (jumpHeight > 0) {
    getFirst(player).y--;
    jumpHeight--;
  }
}

// Gravity Code
function gravityPull() {
  playerCoord = getFirst(player);
  let downCollision = getTile(playerCoord.x, playerCoord.y + 1);
  let upCollision = getTile(playerCoord.x, playerCoord.y - 1);
  // Collision check
  if (gravity == "down" && downCollision.length != 0) {
    isMoving = 0;
  } else if (gravity == "up" && upCollision.length != 0) {
    isMoving = 0;
  } else {
    isMoving += 1;
  }

  // Apply Gravity
  if (isMoving > 1) {
    if (gravity == "down" && downCollision == 0) {
      getFirst(player).y++;
      if (getFirst(player).y == height() - 1) {
        reset();
      }
    } else if (gravity == "up" && upCollision == 0) {
      getFirst(player).y--;
      if (getFirst(player).y == 0) {
        reset();
      }
    }
  }
}

// Gravity Block Code
function gravityBlockDetection() {
  playerCoord = getFirst(player);
  let verticalTiles = [
    getTile(playerCoord.x, playerCoord.y + 1)[0],
    getTile(playerCoord.x, playerCoord.y - 1)[0],
  ];

  if (verticalTiles.some((tile) => tile && tile.type === gravityBlockDown)) {
    playTune(gravityChangeSFX);
    gravity = "down";
    characterInit();
  } else if (
    verticalTiles.some((tile) => tile && tile.type === gravityBlockUp)
  ) {
    playTune(gravityChangeSFX);
    gravity = "up";
    characterInit();
  }
}

// Character Update Code
function characterInit() {
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

function handleGameIntervals() {
  if (inGame == 1) {
    // Clear any existing intervals (Idk why this makes errors go away)
    clearInterval(gravityDetectionInterval);
    clearInterval(gravityLoopInterval);
    clearInterval(jumpLoopInterval);

    // Set new intervals
    gravityDetectionInterval = setInterval(gravityBlockDetection, 500);
    gravityLoopInterval = setInterval(gravityPull, 300);
    jumpLoopInterval = setInterval(jumpPull, 100);
  } else {
    // Clear intervals if game is not active
    clearInterval(gravityDetectionInterval);
    clearInterval(gravityLoopInterval);
    clearInterval(jumpLoopInterval);
  }
}
