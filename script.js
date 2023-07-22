const gameBoard = generateGameBoardArray(); // The board of tiles.
const snakeArray = [68]; // Starting tile.
let snakeDirection = "right"; // the direction of snake.
let foodOnBoard = false; // Boolean value that indicates whether there is a food tile on the board.
let gameState = false; // Determines whether the game is going on right now.

// Arrays for the bordertiles. We dont need to make an array for top and bottom since we can check if snake is on the those borders using
// snake[0] < 16 for top border or snake[0] > 239;
const rightBorder = [
  15, 31, 47, 63, 79, 95, 111, 127, 143, 159, 175, 191, 207, 223, 239, 255,
];
const leftBorder = [
  16, 32, 48, 64, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 240,
];

// Function for generating the array of gameboard tiles.
function generateGameBoardArray() {
  let i = 0;
  let emptyArray = [];
  // Creates an array of 256 elements ranging from number 0 to number 255.
  // This represents 256 tiles which would be a 16x16 grid.
  while (i < 256) {
    emptyArray.push(i);
    i++;
  }
  return emptyArray;
}

// a function that starts the game
function startGame() {
  gameState = true;
  document.getElementById("score").textContent = `SCORE: ${snakeArray.length}`;
  generateGameBoard();
  document.getElementById(snakeArray[0]).className = "tile S";
  spawnFood();
  gameLoop();
}

function generateGameBoard() {
  let board = "";
  // creates a board variable that equals to 255 div elements.
  for (let i = 0; i < gameBoard.length; i++) {
    board += `<div class="tile E" id="${i}"></div>`;
  }
  // Selecting the game element from HTML (which is a div container) and setting it's innerHTML value to our
  // board variable so we will have 255 divs in our HTML code after calling this function.
  document.querySelector(".game").innerHTML = board;
}

// Function that spawns a food for the snake to eat.
function spawnFood() {
  // Checks if there is food on the board.
  if (!foodOnBoard) {
    let state = true;

    // A loop that generates a random number to decide the tile where to spawn the food. If the random number is in snake array it means that the tile is a part of snake,
    // and foot cannot be spawned on that tile, so it loops until it gets an ID that is not part of the snake array and
    // spawns food there by changing the tile element to F meaning food.
    while (state) {
      let randomInt = getRandomIntInclusive(0, 255);
      if (!snakeArray.includes(randomInt)) {
        const foodElement = document.getElementById(randomInt);
        foodElement.className = "tile F";
        foodOnBoard = true;
        state = false;
      }
    }
  }
}

// Function that generates a random integer between two values, inclusive.
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

// calculates the tile id that is ahead of snake depending on the direction the snake is moving.
function calculateTileAheadSnake() {
  let newTileId = 0;
  // checks direction and if snake is on the respective border. For example if snakeDirection is right, the snake cant be on the right border.
  // otherwise we will set the gameState to false and send an alert that the game is over.
  if (snakeDirection === "right" && !rightBorder.includes(snakeArray[0])) {
    newTileId = snakeArray[0] + 1;
  } else if (snakeDirection === "down" && !(snakeArray[0] > 239)) {
    newTileId = snakeArray[0] + 16;
  } else if (snakeDirection === "left" && !leftBorder.includes(snakeArray[0])) {
    newTileId = snakeArray[0] - 1;
  } else if (snakeDirection === "up" && !(snakeArray[0] < 16)) {
    newTileId = snakeArray[0] - 16;
  } else if (
    snakeDirection === "right" &&
    rightBorder.includes(snakeArray[0])
  ) {
    newTileId = snakeArray[0] - 15;
  } else if (snakeDirection === "down" && snakeArray[0] > 239) {
    newTileId = snakeArray[0] % 16;
  } else if (snakeDirection === "left" && leftBorder.includes(snakeArray[0])) {
    newTileId = snakeArray[0] + 15;
  } else if (snakeDirection === "up" && snakeArray[0] < 16) {
    newTileId = 15 * 16 + snakeArray[0];
  } else {
    gameState = false;
  }
  return newTileId;
}

// function that changes the tile that the snake goes on.

function changeTile(id) {
  const tileElement = document.getElementById(id);
  // If the tile is E meaning Empty, set the snake to that tile and remove the last snake tile in snakeArray.
  if (tileElement.classList.contains("E")) {
    snakeArray.unshift(id);
    tileElement.className = "tile S";
    document.getElementById(snakeArray.pop()).className = "tile E";
  } else if (tileElement.classList.contains("F")) {
    snakeArray.unshift(id);
    tileElement.className = "tile S";
    delay -= 12.5; // decreases delay each time after snake eats food.
    delay = Math.max(delay, 50); // delay cant go under 50ms
    document.getElementById(
      "score"
    ).textContent = `SCORE: ${snakeArray.length}`;
    foodOnBoard = false;
  } else if (tileElement.classList.contains("S")) {
    gameState = false;
  }
}

// Eventlistener that listens for keypresses and based on the arrow pressed changes the direction of the snake. Direction cant be changed into opposite direction.
// For example if snake is directed up you cant change direction down cause that would cause snake to go into itself.
// The directionChanged variable indicates whether the person has changed a variable already in a game loop. If they have they cant do so again after the game loop ends.
let directionChanged = false;
document.addEventListener(
  "keydown",
  (event) => {
    var name = event.key;

    if (event.key === "ArrowUp") {
      if (snakeDirection !== "down" && !directionChanged) {
        snakeDirection = "up";
        directionChanged = true; // Set the flag to true
      }
    } else if (event.key === "ArrowDown") {
      if (snakeDirection !== "up" && !directionChanged) {
        snakeDirection = "down";
        directionChanged = true; // Set the flag to true
      }
    } else if (event.key === "ArrowLeft") {
      if (snakeDirection !== "right" && !directionChanged) {
        snakeDirection = "left";
        directionChanged = true; // Set the flag to true
      }
    } else if (event.key === "ArrowRight") {
      if (snakeDirection !== "left" && !directionChanged) {
        snakeDirection = "right";
        directionChanged = true; // Set the flag to true
      }
    }
    console.log(snakeDirection);
  },
  false
);

let delay = 250;
// GAME LOOPS, this runs the code inside the setTimeout function once every 1/4 of a second. When the gamestate is false the game stops! The delay decreases
// after each time the snake eats food.
function gameLoop() {
  if (!gameState) {
    alert("Game Over");
    return;
  }

  directionChanged = false;

  setTimeout(() => {
    spawnFood();
    changeTile(calculateTileAheadSnake());
    gameLoop();
  }, delay);
}

// End of code!
