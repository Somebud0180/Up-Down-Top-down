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
const textBackground = "y";
const leftTextBackground = "x";
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

const buttonL = bitmap`
0000000000000000
0000222222220000
0002222222222000
0022222222222200
0222222222222220
0222022222202220
0222022222200220
0222022222200020
0222022222200020
0222022222200220
0222000022202220
0222222222222220
0022222222222200
0002222222222000
0000222222220000
0000000000000000`;

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

const arrowTexture = bitmap`
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
const backgroundTexture = bitmap`
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
const textBackgroundTexture = bitmap`
................
3333333333333333
33LL333LLLL3LLL3
3LLLL3LLLLL3LLL3
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL`;
const leftTextBackgroundTexture = bitmap`
................
.......333333333
.......33L3LLLLL
.......3LLLLLLLL
.......LLLLLLLLL
.......LLLLLLLLL
.......LLLLLLLLL
.......LLLLLLLLL
.......LLLLLLLLL
.......LLLLLLLLL
.......LLLLLLLLL
.......LLLLLLLLL
.......LLLLLLLLL
.......LLLLLLLLL
.......LLLLLLLLL
.......LLLLLLLLL`;
const magicBlockTexture = bitmap`
LLLLLLLLLLLLLLLL
L00LLLLLLLLLLLLL
L0000000000000LL
LL000000000000LL
LL000000000000LL
LL000077770000LL
LL000777777000LL
LL000775577000LL
LL000775577000LL
LL000777777000LL
LL000077770000LL
LL000000000000LL
LL000000000000LL
LL0000000000000L
LLLLLLLLLLLLL00L
LLLLLLLLLLLLLLLL`;
const blockTexture = bitmap`
LLLLLLLLLLLLLLLL
L00LLLLLLLLLLLLL
L0000000000000LL
LL000000000000LL
LL000000000000LL
LL000077770000LL
LL000777777000LL
LL000777777000LL
LL000777777000LL
LL000777777000LL
LL000077770000LL
LL000000000000LL
LL000000000000LL
LL0000000000000L
LLLLLLLLLLLLL00L
LLLLLLLLLLLLLLLL`;
const gravityBlockDownTexture = bitmap`
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
const gravityBlockUpTexture = bitmap`
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
const flagDownTexture = bitmap`
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
const flagUpTexture = bitmap`
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
u.bb.b.b.bb...f
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
...b..b.....bbb
...b..b.bb....i
..bb..b........
..db..b........
......u........
...............
...u...........
...b...........
...b..b........
.u.bu.b........
bb.bb.b........
...b..b........`,
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
150: D4^150 + C4/150,
150: C4~150,
4500`;
const stepSFX = tune`
50: C4^50 + C5^50,
1550`;
const jumpSFX = tune`
428.57142857142856: F4~428.57142857142856 + G4~428.57142857142856,
13285.714285714284`;
const gravityChangeSFX = tune`
125: D4~125 + C4^125,
125: E4^125,
125: F4~125 + G4~125,
125: G4~125,
3500`;
const deathSFX = tune`
37.5: B4^37.5,
37.5: B4~37.5,
37.5: B4^37.5,
37.5: B4~37.5,
37.5: B4^37.5,
1012.5`;
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
  -----
`;

let tutorial1 = `
Double-click
the jump button 
to get higher
`

let tutorial2 = `
Jump on 
top of the 
Gravity 
Block to
activate
`

let errorSpawn = `
  Error: Couldn't 
        
  find empty tile
        
  for player spawn
`;

let deathText = `You died!`;

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
mainMenu()

// Set Level
function initializeGame() {
  setTextures();
  setSolids([player, block]);
  // setPushables([player]: []});
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

onInput("l", () => {
  if (inGame == 0) {
    arrowContinue()
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

////////////////////////////
//Main Menu Code
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
function arrowContinue() {
  if (arrowOption == 0) {
    initializeGame()
  } else if (arrowOption == 1) {
    playTune(errorSFX)
  }
}

////////////////////////////
// Game Logic
// Texture Update Code
function setTextures() {
  setLegend(
    [player, currentPlayer],
    [arrow, arrowTexture],
    [background, backgroundTexture],
    [textBackground, textBackgroundTexture],
    [leftTextBackground, leftTextBackgroundTexture],
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
  if (level == 1) {
    addText(tutorial1, {x: 1, y: 0, color: color`1`});
  } else if (level == 2) {
    addText(tutorial2, {x: 10, y: 8, color: color`1`});
  } else if ( level ==3) {
    gravity = "top";
  } else{
    gravity = "down";
  }
};

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
  mapCheck();
  characterInit();
  setMap(levels[level]);
  spawnFind();
  addSprite(spawnX, spawnY, player);
  inGame = 1;
  handleGameIntervals()
}

// Reset Code
function reset() {
  playTune(deathSFX)
  addSprite(4, 5, leftTextBackground) // Makes the text centre
  for (let i = 5; i <= 10; i++) {
    // Adds background to text to make it readable
    addSprite(i, 5, textBackground)
  }
  addText(deathText, {
          x: 6,
          y: 7,
          color: color`2`,
        });
  inGame = 2;
  handleGameIntervals()
  getFirst(player).remove();
  setTimeout(() => spawn(), 3000);
}

// Jump Code
function jumpUp() {
  playerCoord = getFirst(player);
  if (gravity == "down") {
    belowTile = getTile(playerCoord.x, playerCoord.y + 1);
    lowerTile = getTile(playerCoord.x, playerCoord.y + 2);
  } else if (gravity == "up") {
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
    isMoving += 1; // Jumping feels better requiring two iterations than longer intervals
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
    gravityDetectionInterval = setInterval(gravityBlockDetection, 400);
    gravityLoopInterval = setInterval(gravityPull, 300);
    jumpLoopInterval = setInterval(jumpPull, 100);
  } else {
    // Clear intervals if game is not active
    clearInterval(gravityDetectionInterval);
    clearInterval(gravityLoopInterval);
    clearInterval(jumpLoopInterval);
  }
}
