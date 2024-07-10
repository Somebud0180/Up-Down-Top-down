/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: 
@author: 
@tags: []
@addedOn: 2024-00-00
*/

const player = "p"
const background = "z"
const block = "b"
const magicBlock = "m"
const flagDown = "f"
const flagUp = "i"
let gravityBlockDown = "d"
let gravityBlockUp = "u"
let isMoving = 0
let jumpHeight = 0
let lastClickTime = 0
let playerCoord = getFirst(player)
let belowTile = getTile(0, 0)
let lowerTile = getTile(0, 0)
let spawnWidth = 0

// Resources
const playerDown = bitmap`
................
................
................
................
................
.......00.......
......0220......
......0000......
................
......0000......
...0002222000...
....02222220....
.....022220.....
.....022220.....
......0220......
.......00.......`
const playerUp = bitmap`
.......00.......
......0220......
.....022220.....
.....022220.....
....02222220....
...0002222000...
......0000......
................
......0000......
......0220......
.......00.......
................
................
................
................
................`
const playerTop = bitmap`
................
................
................
................
.......00.......
......0220......
..LLL022220LLL..
.L110222222011L.
.L110222222011L.
..LLL022220LLL..
......0220......
.......00.......
................
................
................
................`
const playerTopSide = bitmap`
................
.......LL.......
......L11L......
......L11L......
......L00L......
......0220......
.....022220.....
....02222220....
....02222220....
.....022220.....
......0220......
......L00L......
......L11L......
......L11L......
.......LL.......
................`

let backgroundTexture = bitmap`
1171171171171177
1711711711711117
7117117117111111
1171171171111111
1711711711111117
7117117111111171
1171171111111711
1711711111117117
7117111111171171
1171111111711711
1711111117117117
7111111171171171
1111111711711711
1111117117117117
7111171171171171
7711711711711711`
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
0000000000000000`
let blockTexture = bitmap`
0000000000000000
0202222222222220
0200000000000020
0200000000000020
0200222222220020
0200000000020020
0200200000020020
0200200770020020
0200200770020020
0200200000020020
0200200000020020
0200222222020020
0200000000000020
0200000000000000
0222222222222220
0000000000000000`
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
................`
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
................`
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
..CC............`
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
................`

const levels = [
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
]

const stepSFX = tune`
37.5,
37.5: G4~37.5,
37.5: C4/37.5 + D4/37.5 + G4-37.5,
1087.5`
const jumpSFX = tune`
375: B4^375 + C5^375 + D5^375 + A4~375 + G4~375,
11625`
const doubleJumpSFX = tune`
714.2857142857143,
714.2857142857143: B4~714.2857142857143 + C5~714.2857142857143 + D5^714.2857142857143 + E5^714.2857142857143 + F5^714.2857142857143,
21428.57142857143`
const gravityChangeSFX = tune`
185.1851851851852: C5-185.1851851851852,
185.1851851851852: D5-185.1851851851852,
5555.555555555556`
const finishSFX = tune`
240: A5~240,
240: B5~240,
240: A5~240,
6960`

// Game Default States
let level = 0
let spawnX = 0 // Static
let spawnY = 0 // Now automated
let currentPlayer = playerDown
let gravity = "down"
let rotation = "horizontal"

// Set Level
function setTextures() {
  setLegend(
    [player, currentPlayer],
    [background, backgroundTexture],
    [block, blockTexture],
    [magicBlock, magicBlockTexture],
    [flagDown, flagDownTexture],
    [flagUp, flagUpTexture],
    [gravityBlockDown, gravityBlockDownTexture],
    [gravityBlockUp, gravityBlockUpTexture],
  )
}

setTextures()

setSolids([player, block])

setMap(levels[level])
// setBackground(backgroundTexture) NOT WORKING

setPushables({
  [player]: []
})

spawn()

// Controls
onInput("k", jumpUp)
onInput("i", jumpUp)

onInput("a", () => {
  rotation = "horizontal"
  getFirst(player).x -= 1
  playTune(stepSFX)
  characterInit()
})

onInput("d", () => {
  rotation = "horizontal"
  getFirst(player).x += 1
  playTune(stepSFX)
  characterInit()
})

onInput("w", () => {
  if (gravity == "top") {
    rotation = "vertical"
    getFirst(player).y -= 1
    playTune(stepSFX)
    characterInit()
  }
})

onInput("s", () => {
  if (gravity == "top") {
    rotation = "vertical"
    getFirst(player).y += 1
    playTune(stepSFX)
    characterInit()
  }
})

// Tile interaction checks
afterInput(() => {
  let playerCoord = getFirst(player)
  // console.log(playerCoord)
  let surroundingTiles = [
    getTile(playerCoord.x, playerCoord.y + 1)[0], // Tile below player
    getTile(playerCoord.x + 1, playerCoord.y)[0], // Tile to the right of player
    getTile(playerCoord.x - 1, playerCoord.y)[0], // Tile to the left of playerd
  ]

  let flagFound = surroundingTiles.some(tile => tile && (tile.type === flagDown || tile.type === flagUp))

  if (flagFound) {
    level++
    if (level == 2) {
      gravity = "top"
    }
    spawn()
    playTune(finishSFX, 1)
    characterInit()
  }
})

// Game Logic
// Dynamic Spawn Finding Code
function spawnFind() {
  spawnHeight = height() - 1
  while (spawnY == 0) {
    for (spawnHeight >= 0; spawnHeight--;) {
      console.log("Finding spawn...")
      if (getTile(spawnX, spawnHeight).length === 0) {
        spawnY = spawnHeight;
        console.log("Air found at " + spawnY)
        break; // exit the loop if air block is found
      }
    }
  }
}

//Spawn Code
function spawn() {
  clearText()
  setMap(levels[level])
  spawnFind()
  addSprite(spawnX, spawnY, player)
}

// Reset Code
function reset() {
  clearText()
  setMap(levels[level])
  addSprite(spawnX, spawnY, player)
}

// Jump Code
function jumpUp() {
  if (gravity == "down") {
    belowTile = getTile(playerCoord.x, playerCoord.y + 1)
    lowerTile = getTile(playerCoord.x, playerCoord.y + 2)
  } else if (gravity == "top") {
    belowTile = getTile(playerCoord.x, playerCoord.y - 1)
    lowerTile = getTile(playerCoord.x, playerCoord.y - 2)
  }
  if ((lowerTile.length == 0 && belowTile.length != 0 && gravity != "top") || (lowerTile.length != 0 && belowTile.length == 0 && gravity != "top")) {
    if (gravity == "down") {
      jumpHeight += 1
    } else if (gravity == "up") {
      jumpHeight -= 1
    }
    playTune(jumpSFX)
  }
}


// Jump Velocity Code
function jumpPull() {
  while (jumpHeight < 0) {
    getFirst(player).y++
    jumpHeight++
  }
  while (jumpHeight > 0) {
    getFirst(player).y--
    jumpHeight--
  }
}

// Gravity Code
function gravityPull() {
  playerCoord = getFirst(player)
  let downCollision = getTile(playerCoord.x, playerCoord.y + 1)
  let upCollision = getTile(playerCoord.x, playerCoord.y - 1)
  // Collision check
  if (gravity == "down" && downCollision.length != 0) {
    isMoving = 0
  } else if (gravity == "up" && upCollision.length != 0) {
    isMoving = 0
  } else {
    isMoving += 1
  }

  // Apply Gravity
  if (isMoving > 1) {
    if (gravity == "down" && downCollision == 0) {
      getFirst(player).y++
      if (getFirst(player).y == height() - 1) {
        reset()
      }
    } else if (gravity == "up" && upCollision == 0) {
      getFirst(player).y--
      if (getFirst(player).y == 0) {
        reset()
      }
    }
  }
}

// Gravity Block Code
function gravityBlockDetection() {
  playerCoord = getFirst(player)
  let verticalTiles = [
    getTile(playerCoord.x, playerCoord.y + 1)[0],
    getTile(playerCoord.x, playerCoord.y - 1)[0],
  ]

  if (verticalTiles.some(tile => tile && (tile.type === gravityBlockDown))) {
    playTune(gravityChangeSFX)
    gravity = "down"
    characterInit()
  } else if (verticalTiles.some(tile => tile && (tile.type === gravityBlockUp))) {
    playTune(gravityChangeSFX)
    gravity = "up"
    characterInit()
  }
}

// Character Update Code
function characterInit() {
  if (gravity == "down") {
    currentPlayer = playerDown
  } else if (gravity == "up") {
    currentPlayer = playerUp
  } else if (gravity == "top") {
    if (rotation == "vertical") {
      currentPlayer = playerTop
    } else if (rotation == "horizontal") {
      currentPlayer = playerTopSide
    }
  }
  setTextures()
}

const gravityDetectionInterval = setInterval(gravityBlockDetection, 500)
const gravityLoopInterval = setInterval(gravityPull, 300)
const jumpLoopInterval = setInterval(jumpPull, 100)
