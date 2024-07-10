/*
@title: Up, Down, Top-down
@author: Somebud0180
@tags: ["platformer"]
@addedOn: 2024-00-00
*/

const player = "p";
const background = "z";
const textBackground = "y";
const leftTextBackground = "x";
const arrow = "q";
const block = "b";
const magicBlock = "v";
const flagDown = "o";
const flagUp = "c";
const gravityBlockDown = "m";
const gravityBlockUp = "n";

const buttonW = "w";
const buttonA = "a";
const buttonS = "s";
const buttonD = "d";
const buttonI = "i";
const buttonK = "k";
const buttonJ = "j";
const buttonL = "l";

let isMoving = 0;
let jumpHeight = 0;
let lastClickTime = 0;
let currentPointer = "";
let pointerX = 2;
let pointerY = 6;
let playerCoord;
let belowTile;
let lowerTile;
let pointerChangeInterval;
let blockDetectionInterval;
let gravityLoopInterval;
let jumpLoopInterval;

// Resources

const buttonDefaultTexture = bitmap`
................
................
................
................
......2222......
.....222222.....
....22222222....
....22222222....
....22222222....
....22222222....
.....222222.....
......2222......
................
................
................
................`;
const buttonWTexture = bitmap`
................
.......22.......
......2222......
................
.....222222.....
....22022222....
....22022222....
....22022222....
....22022222....
....22022222....
....22000022....
.....222222.....
................
................
................
................`;
const buttonATexture = bitmap`
................
................
................
................
.....222222.....
....22022222....
....22022222....
....22022222....
....22022222....
....22022222....
....22000022....
.....222222.....
................
......2222......
.......22.......
................`;
const buttonSTexture = bitmap`
................
................
................
................
.....222222.....
....22022222....
..2.22022222....
.22.22022222....
.22.22022222....
..2.22022222....
....22000022....
.....222222.....
................
................
................
................`;
const buttonDTexture = bitmap`
................
................
................
................
.....222222.....
....22022222....
....22022222.2..
....22022222.22.
....22022222.22.
....22022222.2..
....22000022....
.....222222.....
................
................
................
................`;
const buttonITexture = bitmap`
................
.......22.......
......2222......
................
.....222222.....
....22000222....
....22022022....
....22000222....
....22022022....
....22022022....
....22022022....
.....222222.....
................
................
................
................`;
const buttonKTexture = bitmap`
................
................
................
................
.....222222.....
....22000222....
....22022022....
....22000222....
....22022022....
....22022022....
....22022022....
.....222222.....
................
......2222......
.......22.......
................`;
const buttonJTexture = bitmap`
................
................
................
................
.....222222.....
....22000222....
..2.22022022....
.22.22000222....
.22.22022022....
..2.22022022....
....22022022....
.....222222.....
................
................
................
................`;
const buttonLTexture = bitmap`
................
................
................
................
.....222222.....
....22000222....
....22022022.2..
....22000222.22.
....22022022.22.
....22022022.2..
....22022022....
.....222222.....
................
................
................
................`;

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
................`;
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
b.vvvvvvvvvvv.b
m.vn.......mv.m
..v.........v..
..v.........v..
..vvvvvvvvvvv..
...............
...............
...............
...........n...
...........b...
n.bb.b.b.bb...o
b.............b`,
  map`
...............
...............
...............
...w.......i...
..s.d.....j.l..
...a.......k...
...............
...............
...............
...............
...............
...............`,
  map`
...............
...............
..............o
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
...b..b.bb....c
..bb..b........
..mb..b........
......m........
...............
...n...........
...b...........
...b..b........
.n.bn.b........
bb.bb.b........
...b..b........`,
  map`
bbbbbbbbbbbbbbb
b......b......o
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

let backButton = `
Back
----
`;

let tutorial1 = `
Double-click
the jump button 
to get higher
`;

let tutorial2 = `
Jump on 
top of the 
Gravity 
Block to
activate
`;

let errorSpawn = `
  Error: Couldn't 
        
  find empty tile
        
  for player spawn
`;

let deathText = `You died!`;

// Game Default States
let gameMode = 0; // 0 for Main Menu; 1 for In-game; 2 for Death
let modeZero = 1; // 1 for Main Menu; 2 for Guide
let pointerOption = 0;
let backButtonState = "2"; // 1 is Gray (unselected); 2 is White (selected)
let level = 0;
let spawnX = 0; // Static
let spawnY = 0; // Now automated
let spawnHeight = 0;
let currentPlayer = playerDown;
let gravity = "down";
let rotation = "horizontal";

// Main Menu starts here
mainMenu();

// Controls
onInput("k", () => {
  if (gameMode == 1) {
    jumpUp();
  }
});

onInput("i", () => {
  if (gameMode == 1) {
    jumpUp();
  }
});

onInput("l", () => {
  if (gameMode == 0) {
    pointerContinue();
  }
});

onInput("a", () => {
  if (gameMode == 1) {
    rotation = "horizontal";
    getFirst(player).x -= 1;
    playTune(stepSFX);
    characterInit();
  }
});

onInput("d", () => {
  if (gameMode == 1) {
    rotation = "horizontal";
    getFirst(player).x += 1;
    playTune(stepSFX);
    characterInit();
  }
});

onInput("w", () => {
  if (gameMode == 0) {
    pointerUp();
  } else if (gameMode == 1) {
    if (gravity == "top") {
      rotation = "vertical";
      getFirst(player).y -= 1;
      playTune(stepSFX);
      characterInit();
    }
  }
});

onInput("s", () => {
  if (gameMode == 0) {
    pointerDown();
  } else if (gameMode == 1) {
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
  if (gameMode == 1) {
    let playerCoord = getFirst(player);
    // console.log("Player checking")
    let surroundingTiles = [
      getTile(playerCoord.x, playerCoord.y + 1)[0], // Tile below player
      getTile(playerCoord.x + 1, playerCoord.y)[0], // Tile to the right of player
      getTile(playerCoord.x - 1, playerCoord.y)[0], // Tile to the left of playerd
    ];

    let flagFound = surroundingTiles.some(
      (tile) => tile && (tile.type == flagDown || tile.type == flagUp),
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
  pointerX = 2;
  pointerY = 6;
  gameMode = 0;
  modeZero = 1;
  handleGameIntervals();
  clearText();
  setTextures();
  level = 0;
  setMap(levels[level]);
  setBackground(background);
  // Text
  addText(mainMenuTitle, {
    x: 4,
    y: 1,
    color: color`2`,
  });
  addText(mainMenuOptions, {
    x: 3,
    y: 7,
    color: color`2`,
  });
}

function guideMenu() {
  gameMode = 0;
  modeZero = 2;
  handleGameIntervals();
  clearText();
  setTextures();
  level = 1;
  setMap(levels[level]);
  setBackground(background);

  // Text
  addText(backButton, {
    x: 2,
    y: 0,
    color: backButtonState,
  });
}

function pointerChange() {
  if (modeZero == 1) {
    console.log("Pointer modeZero 1");
    if (currentPointer == arrow) {
      clearTile(pointerX, pointerY);
      addSprite(pointerX, pointerY, buttonL);
    } else {
      clearTile(pointerX, pointerY);
      addSprite(pointerX, pointerY, arrow);
    }
    currentPointer = getTile(pointerX, pointerY)[0].type;
  } else if (modeZero == 2) {
    console.log("Pointer modeZero 2");
    if (currentPointer == 1) {
      console.log("Not yet implemented");
    } else {
      currentPointer = 0;
    }
    // Change back button color
    if (pointerOption == 0) {
      console.log("backButtonState " + backButtonState);
      backButtonState = color`2`;
      guideMenu();
    } else {
      console.log("backButtonState " + backButtonState);
      backButtonState = color`1`;
      guideMenu();
    }
  }
}

function pointerDown() {
  if (modeZero == 1) {
    if (pointerOption == 0) {
      clearTile(pointerX, pointerY);
      pointerY += 2;
      pointerOption++;
      pointerChange();
    } else {
      playTune(errorSFX);
    }
  } else if (modeZero == 2) {
    if (pointerOption < 4) {
      pointerOption++;
      pointerChange();
    } else {
      playTune(errorSFX);
    }
  }
}

function pointerUp() {
  if (modeZero == 1) {
    if (pointerOption == 1) {
      clearTile(pointerX, pointerY);
      pointerY -= 2;
      pointerOption--;
      pointerChange();
    } else {
      playTune(errorSFX);
    }
  } else if (modeZero == 2) {
    if (pointerOption > 0) {
      pointerOption--;
      pointerChange();
    } else {
      playTune(errorSFX);
    }
  }
}

function pointerContinue() {
  if (modeZero == 1) {
    if (pointerOption == 0) {
      initializeGame();
    } else if (pointerOption == 1) {
      pointerOption = 0; // Return to first option
      guideMenu();
    }
  } else if (modeZero == 2) {
    if (pointerOption == 0) {
      pointerOption = 0; // Return to first option
      mainMenu();
    }
  }
}
////////////////////////////
// Game Logic

// Special Map Check
function mapCheck() {
  if (level == 2) {
    addText(tutorial1, { x: 1, y: 0, color: color`1` });
    gravity = "down";
  } else if (level == 3) {
    addText(tutorial2, { x: 10, y: 8, color: color`1` });
    gravity = "down";
  } else if (level == 4) {
    gravity = "top";
  } else {
    gravity = "down";
  }
}

// Dynamic Spawn Finding Code
function spawnFind() {
  spawnY = 0;
  spawnHeight = height() - 1;
  while (spawnY == 0) {
    for (spawnHeight >= 0; spawnHeight--;) {
      console.log("Finding spawn...");
      if (getTile(spawnX, spawnHeight).length == 0 && spawnHeight > 1) {
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

// Set Level
function initializeGame() {
  setTextures();
  setSolids([player, block]);
  // setPushables([player]: []});
  setBackground(background);
  setMap(levels[level]);

  spawn(); // Start Game
}

//Spawn Code
function spawn() {
  clearText(); // Cleans stuff before it
  mapCheck();
  characterInit();
  setMap(levels[level]);
  spawnFind();
  addSprite(spawnX, spawnY, player);
  gameMode = 1;
  handleGameIntervals();
}

// Reset Code
function reset() {
  playTune(deathSFX);
  addSprite(4, 5, leftTextBackground); // Makes the text centre
  for (let i = 5; i <= 10; i++) {
    // Adds background to text to make it readable
    addSprite(i, 5, textBackground);
  }
  addText(deathText, {
    x: 6,
    y: 7,
    color: color`2`,
  });
  gameMode = 2;
  handleGameIntervals();
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

  if (verticalTiles.some((tile) => tile && tile.type == gravityBlockDown)) {
    playTune(gravityChangeSFX);
    gravity = "down";
    characterInit();
  } else if (
    verticalTiles.some((tile) => tile && tile.type == gravityBlockUp)
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
    [buttonW, buttonWTexture],
    [buttonA, buttonATexture],
    [buttonS, buttonSTexture],
    [buttonD, buttonDTexture],
    [buttonI, buttonITexture],
    [buttonK, buttonKTexture],
    [buttonJ, buttonJTexture],
    [buttonL, buttonLTexture],
  );
}

function handleGameIntervals() {
  if (gameMode == 1) {
    // Clear any existing intervals
    clearInterval(pointerChangeInterval);
    clearInterval(blockDetectionInterval);
    clearInterval(gravityLoopInterval);
    clearInterval(jumpLoopInterval);

    // Set new intervals
    blockDetectionInterval = setInterval(gravityBlockDetection, 500);
    gravityLoopInterval = setInterval(gravityPull, 300);
    jumpLoopInterval = setInterval(jumpPull, 100);
  } else if (gameMode == 0) {
    // Clear any existing intervals
    clearInterval(pointerChangeInterval);

    // Set interval for pointer texture swap
    pointerChangeInterval = setInterval(pointerChange, 1000);
  } else {
    // Clear intervals if game is not active
    clearInterval(pointerChangeInterval);
    clearInterval(blockDetectionInterval);
    clearInterval(gravityLoopInterval);
    clearInterval(jumpLoopInterval);
  }
}
