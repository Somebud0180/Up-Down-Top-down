## Main Menu Code
This includes a trimmed down version of the guide (without blocks), spawn code, map initialize code, and pointer code. Tested as working when ran without changes (not recommended)

**Warning**: This code very dense and need a lot of tinkering to get it to work with what you might need. I suggest this as a guide to make one suitable for your needs.


### Pre-requisites
- setTextures(), if using characterInit(), replace them in the code
- updateGameIntervals(), given here, setup your intervals there
- Button textures (All required are given here)
- Arrow texture (given here)
- Main Menu and Guide Text (given here)
- A map on level 0 and 1, for the guide and the menu respectively (Sample given here)
- _Most_ items that need configuring are marked with three slashes '///'. I recoomend you still have a look through the code

``` js
const arrow = "q";
const buttonW = "w";
const buttonA = "a";
const buttonS = "s";
const buttonD = "d";
const buttonI = "i";
const buttonK = "k";
const buttonJ = "j";
const buttonL = "l";
let buttonActive = "g";

let currentPointer; // Check pointer functions

/// I recommend you declare intervals here so that they exist outside the if statement
let pointerChangeInterval;
/// Declare your intervals here

// Resources
// Active Textures
const buttonLGlyph = bitmap`
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

// Inactive Textures
const buttonWInactiveGlyph = bitmap`
................
.......11.......
......1111......
................
.....111111.....
....11011111....
....11011111....
....11011111....
....11011111....
....11011111....
....11000011....
.....111111.....
................
................
................
................`;
const buttonAInactiveGlyph = bitmap`
................
................
................
................
.....111111.....
....11011111....
..1.11011111....
.11.11011111....
.11.11011111....
..1.11011111....
....11000011....
.....111111.....
................
................
................
................`;
const buttonSInactiveGlyph = bitmap`
................
................
................
................
.....111111.....
....11011111....
....11011111....
....11011111....
....11011111....
....11011111....
....11000011....
.....111111.....
................
......1111......
.......11.......
................`;
const buttonDInactiveGlyph = bitmap`
................
................
................
................
.....111111.....
....11011111....
....11011111.1..
....11011111.11.
....11011111.11.
....11011111.1..
....11000011....
.....111111.....
................
................
................
................`;
const buttonIInactiveGlyph = bitmap`
................
.......11.......
......1111......
................
.....111111.....
....11000111....
....11011011....
....11000111....
....11011011....
....11011011....
....11011011....
.....111111.....
................
................
................
................`;
const buttonJInactiveGlyph = bitmap`
................
................
................
................
.....111111.....
....11000111....
..1.11011011....
.11.11000111....
.11.11011011....
..1.11011011....
....11011011....
.....111111.....
................
................
................
................`;
const buttonKInactiveGlyph = bitmap`
................
................
................
................
.....111111.....
....11000111....
....11011011....
....11000111....
....11011011....
....11011011....
....11011011....
.....111111.....
................
......1111......
.......11.......
................`;
const buttonLInactiveGlyph = bitmap`
................
................
................
................
.....111111.....
....11000111....
....11011011.1..
....11000111.11.
....11011011.11.
....11011011.1..
....11011011....
.....111111.....
................
................
................
................`;

// Highlight
const buttonHighlightTexture = bitmap`
................
................
................
.....222222.....
....21111112....
...2111111112...
...2111111112...
...2111212112...
...2112121112...
...2111111112...
...2111111112...
....21111112....
.....222222.....
................
................
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

/// Texts (Modify these to your needs)
let currentLevelText;

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

// Guide Texts
let menuGuide = `Press   

to activate`;
// Controls
let upLGuide = `Moves player 
upward in 
Top-down mode`;
let leftLGuide = `Moves player to 
the left`;
let downLGuide = `Moves player 
downward in
Top-down mode`;
let rightLGuide = `Moves player to 
the right`;
let upRGuide = `Makes player jump`;
let leftRGuide = `Returns to menu
(Level is saved)`;
let downRGuide = `Makes player jump,
also acts as the
back button in
the menu`;
let rightRGuide = `Confirm menu
selection, also 
acts as level skip`;

const levels = [
  map`
...............
...............
...............
...w.......i...
..a.d.....j.l..
...s.......k...
...............
...............
...............
.....l.........
...............
...............`, // 0 Guide
  map`
...............
...............
...............
...............
...............
...............
...............
...............
...............
...............
...............
...............`, // 1 Main Menu || Game Map 1
];

// Game Default States
let gameState = 0; // 0 for Main Menu; 1 for In-game
let menuMode = 1; // 1 for Main Menu; 2 for Guide
let pointerOption = 0;
let backButtonState = "2"; // 1 is Gray (unselected); 2 is White (selected)
let level = 1; // 0 for Guide; 1 for Main Menu
let lastLevel = 1; // Tracks level before mainMenu to allow accessing the main menu whilst in game
/// let spawnX = 0; // Required if your map does not contain the player
/// let spawnY = 0; // Required if your map does not contain the player

// Start the main menu
mainMenu();

// Controls
onInput("w", () => {
  if (gameState == 0) {
    pointerUp();
  } else if (gameState == 1) {
    // Insert Character Movement code here
  }
});

onInput("s", () => {
  if (gameState == 0) {
    pointerDown();
  } else if (gameState == 1) {
    // Insert Character Movement code here
  }
});

onInput("a", () => {
  if (gameState == 0) {
    pointerUp();
  } else if (gameState == 1) {
    // Insert Character Movement code here
  }
});

onInput("d", () => {
  if (gameState == 0) {
    pointerDown();
  } else if (gameState == 1) {
    // Insert Character Movement code here
  }
});

onInput("i", () => {
  if (gameState == 1) {
    // Insert Character Movement code here
  }
});

onInput("k", () => {
  if (gameState == 0) {
    pointerContinue("k");
    pointerBack();
  } else if (gameState == 1) {
    // Insert Character Movement code here
  }
});

onInput("j", () => {
  if (gameState == 1) {
    // Check if in-game and allow to open main menu
    mainMenu();
  }
});

onInput("l", () => {
  if (gameState == 0) {
    pointerContinue();
  } else if (gameState == 1) {
    // Insert Character Movement code here
  }
});

// Menu Code
// Sets up the main menu
function mainMenu() {
  pointerX = 2;
  pointerY = 6;
  gameState = 0;
  menuMode = 1;
  pointerOption = 0;
  updateGameIntervals();

  // Check for current level
  /// Set this if as level > 2 if you want to spawn on the next map rather than the menu, also set the else as lastLevel = 2
  if (level > 1) {
    // Check if current level is a in-game level
    lastLevel = level; // Remember last level before mainMenu (if Applicable)
  } else {
    lastLevel = 1;
  }
  currentLevelText = `Current level: ${lastLevel}`; // Grab level and add to text
  clearText();
  setTextures();
  level = 1;
  setMap(levels[level]);
  /// setBackground(background);
  pointerChange(); // Trigger pointer spawning in advance (Rather than wait for interval)

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
  addText(currentLevelText, {
    x: 2,
    y: 15,
    color: color`1`,
  });
}

// Sets up the guide
function guideScreen() {
  gameState = 0;
  menuMode = 2;
  updateGameIntervals();
  clearText();
  setTextures();
  level = 0;
  setMap(levels[level]);
  /// setBackground(background);
  addBack();
  addText(menuGuide, { x: 1, y: 12, color: color`1` });
}

function addBack() {
  clearText();
  addText(backButton, {
    x: 2,
    y: 0,
    color: backButtonState,
  });
}

// Handles pointer blinking and spawning
function pointerChange() {
  if (menuMode == 1) {
    // Point to selected
    if (currentPointer == arrow) {
      clearTile(pointerX, pointerY);
      addSprite(pointerX, pointerY, buttonL);
    } else {
      clearTile(pointerX, pointerY);
      addSprite(pointerX, pointerY, arrow);
    }
    currentPointer = getTile(pointerX, pointerY)[0].type;
  }
}

// Handles pointer selection in guide on-demand
function pointerUpdate() {
  if (pointerOption == 1) {
    if (getTile(5, 9) !== undefined) {
      clearTile(5, 9);
    }
    updateGlyph(buttonW);
  } else if (pointerOption == 2) {
    updateGlyph(buttonA);
  } else if (pointerOption == 3) {
    updateGlyph(buttonS);
  } else if (pointerOption == 4) {
    updateGlyph(buttonD);
  } else if (pointerOption == 5) {
    updateGlyph(buttonI);
  } else if (pointerOption == 6) {
    updateGlyph(buttonJ);
  } else if (pointerOption == 7) {
    updateGlyph(buttonK);
  } else if (pointerOption == 8) {
    updateGlyph(buttonL);
  } else {
    pointerOption = 0;
    updateGlyph();
  }
  // Change back button color
  if (pointerOption == 0) {
    backButtonState = color`2`;
    addBack();
  } else {
    backButtonState = color`1`;
    addBack();
  }
}

// Handles pointer movement (downwards)
function pointerDown() {
  if (menuMode == 1) {
    if (pointerOption == 0) {
      clearTile(pointerX, pointerY);
      pointerY += 2;
      pointerOption++;
      pointerChange();
      /// playTune(menuSFX);
    } else {
      /// playTune(error);
    }
  } else if (menuMode == 2) {
    if (pointerOption < 8) {
      pointerOption++;
      pointerUpdate();
      /// playTune(menuSFX);
    } else {
      /// playTune(error);
    }
  }
}

// Handles pointer movement (upwards)
function pointerUp() {
  if (menuMode == 1) {
    if (pointerOption == 1) {
      clearTile(pointerX, pointerY);
      pointerY -= 2;
      pointerOption--;
      pointerChange();
      /// playTune(menuSFX);
    } else {
      /// playTune(error);
    }
  } else if (menuMode == 2) {
    if (pointerOption > 0) {
      pointerOption--;
      pointerUpdate();
      /// playTune(menuSFX);
    } else {
      /// playTune(error); = true;
    }
  }
}

// Allows pointer to jump back to the first option
function pointerBack() {
  if (menuMode == 1) {
    if (pointerOption == 1) {
      clearTile(pointerX, pointerY);
      pointerY -= 2;
      pointerOption = 0;
      pointerChange();
    } else {
      /// playTune(error);
    }
  } else if (menuMode == 2) {
    if (pointerOption > 0) {
      pointerOption = 0;
      pointerUpdate();
    }
  }
}

// Handles pointer selection and runs/displays them accordingly
function pointerContinue(triggered) {
  if (menuMode == 1) {
    // Main Menu
    if (triggered == "k") {
      // Check if triggered by back button
      if (pointerOption == 0) {
        /// playTune(error);
      }
    } else if (pointerOption == 0) {
      // Start the Game
      initializeGame();
    } else if (pointerOption == 1) {
      // Go to Guide
      pointerOption = 0; // Return to first option
      guideScreen();
    }
  } else if (menuMode == 2) {
    // Guide
    if (triggered == "k") {
      // Check if triggered by back button
      if (pointerOption == 0) {
        mainMenu();
      }
    } else if (pointerOption == 0) {
      pointerOption = 0; // Return to first option
      mainMenu();
    } else if (pointerOption > 0) {
      guideText();
    }
  }
}

// Update current selected item texture to highlight in the guid
function updateGlyph(activeOption) {
  if (pointerOption == 0) {
    buttonActive = "g"; // Reset buttonActive and activeOption when switching from buttons to back
  } else if (pointerOption > 0 && pointerOption < 9) {
    buttonActive = activeOption;
  }
  setTextures();
}

function guideText() {
  if (pointerOption == 1) {
    addBack(); // Clears text and rewrites the back button
    addText(upLGuide, { x: 1, y: 12, color: color`2` });
  } else if (pointerOption == 2) {
    addBack();
    addText(leftLGuide, { x: 1, y: 12, color: color`2` });
  } else if (pointerOption == 3) {
    addBack();
    addText(downLGuide, { x: 1, y: 12, color: color`2` });
  } else if (pointerOption == 4) {
    addBack();
    addText(rightLGuide, { x: 1, y: 12, color: color`2` });
  } else if (pointerOption == 5) {
    addBack();
    addText(upRGuide, { x: 1, y: 12, color: color`2` });
  } else if (pointerOption == 6) {
    addBack();
    addText(leftRGuide, { x: 1, y: 12, color: color`2` });
  } else if (pointerOption == 7) {
    addBack();
    addText(downRGuide, { x: 1, y: 11, color: color`2` });
  } else if (pointerOption == 8) {
    addBack();
    addText(rightRGuide, { x: 1, y: 12, color: color`2` });
  }
}

// Setup the game
function initializeGame() {
  /// setTextures(); // Replace with characterInit() if you use it
  /// setSolids([player, block]);
  /// setBackground(background);
  level = lastLevel; // Restore lastLevel if applicable
  setMap(levels[level]);

  spawn(); // Start Game
}

// Spawn Code
function spawn() {
  clearText(); // Cleans stuff before it
  setMap(levels[level]);
  gameState = 1;
  /// setTextures(); // Replace with characterInit() if you use it
  /// addSprite(spawnX, spawnY, player); // Remove if your map includes the player
}

function setTextures() {
  // This function loads the required textures for each gameState and menuMode
  if (gameState == 0) {
    // Main Menu or Guide check
    if (menuMode == 1) {
      setLegend(
        [arrow, arrowTexture],
        [buttonL, buttonLGlyph],
        /// Add your in game textures here (If visible in the main menu)
      );
    } else if (menuMode == 2) {
      setLegend(
        /// Add your in game textures here (If you will use it in the guide)
        [buttonW, buttonWInactiveGlyph],
        [buttonA, buttonAInactiveGlyph],
        [buttonS, buttonSInactiveGlyph],
        [buttonD, buttonDInactiveGlyph],
        [buttonI, buttonIInactiveGlyph],
        [buttonJ, buttonJInactiveGlyph],
        [buttonK, buttonKInactiveGlyph],
        [buttonL, buttonLInactiveGlyph],
        [buttonActive, buttonHighlightTexture],
      );
    }
  } else if (gameState == 1) {
    setLegend(
      /// Add your in game textures here
    );
  }
}

function updateGameIntervals() {
  if (gameState == 1) {
    // Clear any existing intervals
    clearInterval(pointerChangeInterval);
    /// clearInterval(yourInterval);

    // Add your intervals here
  } else if (gameState == 0) {
    // Clear any existing intervals
    clearInterval(pointerChangeInterval);
    /// clearInterval(yourInterval);

    pointerChangeInterval = setInterval(pointerChange, 1000); // Set interval for pointer texture swap
  } else {
    // Clear intervals if game is not active
    clearInterval(pointerChangeInterval);
    /// clearInterval(yourInterval);
  }
}
```
