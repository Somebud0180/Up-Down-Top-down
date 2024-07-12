## Movement Code
_For movement code with extras, check (placholderGravityLink) or (placeholderJumpLink)_

The following code provides barebones code to control the player with the following
| Key | Action        |
|:---:|:-------------:|
|  W  | to move up    |
|  A  | to move down  |
|  S  | to move left  |
|  D  | to move right |
``` js
// Controls
onInput("w", () => {
  getFirst(player).y -= 1; // Moves player up
});

onInput("s", () => {
  getFirst(player).y += 1; // Moves player down
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
```
