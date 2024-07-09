/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: 
@author: 
@tags: []
@addedOn: 2024-00-00
*/

const player = "p"
const block = "b"
const flagD = "f"
const flagU = "i"
let gravity = "down"
let isMoving = 0
let jumpHeight = 0
let lastClickTime = 0

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
let currentPlayer = playerDown

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
let flagDown = bitmap`
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
let flagUp = bitmap`
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


let level = 0
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
p........
bbbbb....`
]

const step = tune`
37.5,
37.5: G4~37.5,
37.5: C4/37.5 + D4/37.5 + G4-37.5,
1087.5`
const jump = tune`
375: B4^375 + C5^375 + D5^375 + A4~375 + G4~375,
11625`
const doubleJump = tune`
714.2857142857143,
714.2857142857143: B4~714.2857142857143 + C5~714.2857142857143 + D5^714.2857142857143 + E5^714.2857142857143 + F5^714.2857142857143,
21428.57142857143`
const finishSFX = tune`
240: A5~240,
240: B5~240,
240: A5~240,
6960`

// Set Level
setLegend(
  [player, currentPlayer],
  [block, blockTexture],
  [flagD, flagDown],
  [flagU, flagUp],
)

setSolids([player, block, flagD, flagU])

setMap(levels[level])

setPushables({
  [player]: []
})

// Controls
onInput("i", () => {
  if (jumpHeight < 3) {
    const currentTime = performance.now();
    if (currentTime - lastClickTime < 400) {
      if (gravity == "down") {
       jumpHeight += 1
      } else if (gravity = "up") {
       jumpHeight -= 1
      }
      playTune(doubleJump)
    } else {
      if (gravity == "down") {
        jumpHeight += 1
      } else if (gravity == "up") {
        jumpHeight -= 1
      }
      playTune(jump)
    }
    lastClickTime = currentTime;
  }
})

onInput("a", () => {
  getFirst(player).x -= 1
  playTune(step)
})

onInput("d", () => {
  getFirst(player).x += 1
  playTune(step)
})

onInput("w", () => {
  gravity = "up"
})

onInput("s", () => {
  gravity = "down"
})

afterInput(() => {
  let playerCoord = getFirst(player)
  let currentTile = getTile(playerCoord.x, playerCoord.y + 1)[0]
  if(currentTile.type == flagD || currentTile.type == flagU) {
    level++
    setMap(levels[level])
    playTune(finishSFX, 1)
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
  let playerCoord = getFirst(player)
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

// Background Loops
function gravityLoop() {
  gravityPull()
  if (gravity == "down") {
    currentPlayer = playerDown
  } else if (gravity == "up") {
    currentPlayer = playerUp
  }
  setLegend(
    [player, currentPlayer],
    [block, blockTexture],
    [flagD, flagDown],
    [flagU, flagUp],
  )
}

function jumpLoop() {
  jumpUp()
}

const gravityLoopInterval = setInterval(gravityLoop, 300)
const jumpLoopInterval = setInterval(jumpLoop, 200)
