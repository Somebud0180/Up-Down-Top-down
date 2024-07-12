## Movement Code (As is)

### Variables
**gameState**: A variable used to track between the main menu and in-game, 0 and 1 respectively. Allows the buttons to be used in and out of the game.

**rotation**: A variable used to track player facing, used in top-down mode.

**pingError**: A variable used to tell a background function to play the errorSFX. Prevents the error sound from playing more than once a second.

### Functions
**characterInit()**: A function used to rerun setLegend when character texture changes.

**jumpUp()**: A function used to check for jump limit and jump height. Made as a function so that two buttons to act as a jump button.

**mainMenu()**: A function used to spawn the main menu.

**pointerContinue()**: A function used to advance in the menu.

**pointerUp()**: A function used to move the pointer up in the menu.

**pointerDown()**: A function used to move the pointer down in the menu.

``` js
// Controls
onInput("w", () => {
  if (gameState == 0) {
    pointerUp();
  } else if (gameState == 1) {
    if (gravity == "top") {
      rotation = "vertical";
      getFirst(player).y -= 1; // Moves player up
      playTune(stepSFX);
      characterInit();
    }
  }
});

onInput("s", () => {
  if (gameState == 0) {
    pointerDown();
  } else if (gameState == 1) {
    if (gravity == "top") {
      rotation = "vertical";
      getFirst(player).y += 1; // Moves player down
      playTune(stepSFX);
      characterInit();
    }
  }
});

onInput("a", () => {
  if (gameState == 0) {
    pointerUp();
  } else if (gameState == 1) {
    rotation = "horizontal";
    getFirst(player).x -= 1; // Moves player left
    playTune(stepSFX);
    characterInit();
  }
});

onInput("d", () => {
  if (gameState == 0) {
    pointerDown();
  } else if (gameState == 1) {
    rotation = "horizontal";
    getFirst(player).x += 1; // Moves player right
    playTune(stepSFX);
    characterInit();
  }
});

onInput("i", () => {
  if (gameState == 1) {
    jumpUp();
  }
});

onInput("k", () => {
  if (gameState == 0) {
    pointerContinue("k");
    pointerBack();
  } else if (gameState == 1) {
    jumpUp();
  }
});

onInput("j", () => {
  if (gameState == 1 && level != levels.length - 1) {
    // Make sure no one opens the menu during end
    mainMenu();
  }
});

onInput("l", () => {
  if (gameState == 0) {
    pointerContinue();
  } else if (gameState == 1) {
    if (level > 0 && level < levels.length - 2) {
      // Check if current level is between the first and second to the last. Set as 2 in the original as the final 3 were considered special.
      nextLevel();
    } else {
      pingError = true;
    }
  }
});
```
