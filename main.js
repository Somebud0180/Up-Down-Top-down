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
const flagDown = "f"
const flagUp = "i"
let gravityBlockDown = "d"
let gravityBlockUp = "u"
let isMoving = 0
let jumpHeight = 0
let lastClickTime = 0
let playerCoord = getFirst(player)

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
.........
.........
........f
.......bb
.....b...
p.b.b....
bb.......`,
  map`
....bbbbb
........i
.........
.........
p...u....
bbbbb....`,
  map`
bbbbbbbbbbb
p.........b
bb.bbbbbb.b
b...b.b...b
bbb...b...b
b.bbb.bbbbb
b.........b
bbbbbbbbb.b`,
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
const finishSFX = tune`
240: A5~240,
240: B5~240,
240: A5~240,
6960`

// Game Default States
let level = 0
let currentPlayer = playerDown
let gravity = "down"
let rotation = "horizontal"

// Set Level
setLegend(
  [player, currentPlayer],
  [background, backgroundTexture],
  [block, blockTexture],
  [flagDown, flagDownTexture],
  [flagUp, flagUpTexture],
  [gravityBlockDown, gravityBlockDownTexture],
  [gravityBlockUp, gravityBlockUpTexture],
)

setSolids([player, block])

setMap(levels[level])
setBackground(backgroundTexture)

setPushables({
  [player]: []
})

// Controls
onInput("i", () => {
  if (jumpHeight < 3 && gravity != "top") {
    const currentTime = performance.now();
    if (currentTime - lastClickTime < 400) {
      if (gravity == "down") {
        jumpHeight += 1
      } else if (gravity = "up") {
        jumpHeight -= 1
      }
      playTune(doubleJumpSFX)
    } else {
      if (gravity == "down") {
        jumpHeight += 1
      } else if (gravity == "up") {
        jumpHeight -= 1
      }
      playTune(jumpSFX)
    }
    lastClickTime = currentTime;
  }
})

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
  let surroundingTiles = [
    getTile(playerCoord.x, playerCoord.y + 1)[0], // Tile below player
    getTile(playerCoord.x + 1, playerCoord.y)[0], // Tile to the right of player
    getTile(playerCoord.x - 1, playerCoord.y)[0], // Tile to the left of player
  ]
  
  let flagFound = surroundingTiles.some(tile => tile && (tile.type === flagDown || tile.type === flagUp))

  if (flagFound) {
    level++
    if (level == 2) {
      gravity = "top"
    }
    setMap(levels[level])
    playTune(finishSFX, 1)
    characterInit()
  }
})

// Game Logic
// Jump Code
function jumpUp() {
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
  if (gravity == "down" && downCollision.length != 0) {
    isMoving = 0
  } else if (gravity == "up" && upCollision.length != 0) {
    isMoving = 0
  } else {
    isMoving += 1
  }
  if (isMoving > 1) {
    if (gravity == "down" && downCollision == 0) {
      getFirst(player).y++
    } else if (gravity == "up" && upCollision == 0) {
      getFirst(player).y--
    }
  }
}

function gravityBlockDetection() {
  playerCoord = getFirst(player)
  let verticalTiles = [
    getTile(playerCoord.x, playerCoord.y + 1)[0],
    getTile(playerCoord.x, playerCoord.y - 1)[0],
  ]
  
  if (verticalTiles.some(tile => tile && (tile.type === gravityBlockDown))) {
    gravity = "down"
    characterInit()
  } else if (verticalTiles.some(tile => tile && (tile.type === gravityBlockUp))) {
    gravity = "up"
    characterInit()
  }
}

function characterInit() {
  if (gravity == "down") {
    currentPlayer = playerDown
  } else if (gravity == "up") {
    currentPlayer = playerUp
  } else if (gravity == "top") {
    console.log(rotation)
    if (rotation == "vertical") {
      currentPlayer = playerTop
    } else if (rotation == "horizontal") {
      currentPlayer = playerTopSide
    }
  }
  setLegend(
    [player, currentPlayer],
    [block, blockTexture],
    [flagDown, flagDownTexture],
    [flagUp, flagUpTexture],
    [gravityBlockDown, gravityBlockDownTexture],
    [gravityBlockUp, gravityBlockUpTexture],
  )
}

const gravityDetectionInterval = setInterval(gravityBlockDetection, 1000)
const gravityLoopInterval = setInterval(gravityPull, 300)
const jumpLoopInterval = setInterval(jumpUp, 200)
