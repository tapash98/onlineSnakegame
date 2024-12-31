const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const canvasSize = 300;
const box = 10;
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let highScorePlayer = localStorage.getItem('highScorePlayer') || 'Player';
let snake;
let food;
let currentDirection = 'RIGHT';
let nextDirection = 'RIGHT';
let gameInterval;

// Update score and high score display
function updateScoreDisplay() {
  document.getElementById('score').textContent = 'Score: ' + score;
  document.getElementById('highscore').textContent = 'Highscore: ' + highScore + ' (' + highScorePlayer + ')';
}

// Start the game
function startGame() {
  // Initial settings
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  score = 0;
  nextDirection = 'RIGHT';

  snake = [
    { x: 50, y: 50 },
    { x: 40, y: 50 },
    { x: 30, y: 50 },
  ];

  generateFood();
  clearInterval(gameInterval);
  gameInterval = setInterval(update, 100);
  document.querySelector('.game-over').style.display = 'none';

  updateScoreDisplay();
}

// Game update function
function update() {
  // Move the snake by creating a new head based on the direction
  let head = { ...snake[0] };

  if (nextDirection === 'RIGHT') head.x += box;
  if (nextDirection === 'LEFT') head.x -= box;
  if (nextDirection === 'UP') head.y -= box;
  if (nextDirection === 'DOWN') head.y += box;

  // Snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++;
    generateFood();

    // Update high score
    if (score > highScore) {
      highScore = score;
      highScorePlayer = document.getElementById('playerName').value || 'Player'; // Get the player's name or default to 'Player'
      localStorage.setItem('highScore', highScore); // Save high score
      localStorage.setItem('highScorePlayer', highScorePlayer); // Save the player's name
    }
  } else {
    snake.pop(); // Remove the tail
  }

  // Check for game over
  if (
    head.x < 0 || head.x >= canvasSize ||
    head.y < 0 || head.y >= canvasSize ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameInterval);
    document.querySelector('.game-over').style.display = 'block';
    updateScoreDisplay();
    return;
  }

  // Add new head to the snake
  snake.unshift(head);
  currentDirection = nextDirection; // Update the direction after move
  draw();
}

// Drawing function for the game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  ctx.fillStyle = '#32CD32'; // Snake color (bright green)

  // Draw the snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw the food
  ctx.fillStyle = '#FF6347'; // Food color (tomato red)
  ctx.fillRect(food.x, food.y, box, box);

  // Draw the score
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText('Score: ' + score, 10, canvasSize - 10);
}

// Generate food at random position
function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box,
  };
}

// Button control functions
function moveUp() {
  if (currentDirection !== 'DOWN') nextDirection = 'UP';
}

function moveDown() {
  if (currentDirection !== 'UP') nextDirection = 'DOWN';
}

function moveLeft() {
  if (currentDirection !== 'RIGHT') nextDirection = 'LEFT';
}

function moveRight() {
  if (currentDirection !== 'LEFT') nextDirection = 'RIGHT';
}

// Keyboard event listener for controlling the snake
document.addEventListener('keydown', function(event) {
  if (event.keyCode === 37 && currentDirection !== 'RIGHT') nextDirection = 'LEFT';  // Left arrow
  if (event.keyCode === 38 && currentDirection !== 'DOWN') nextDirection = 'UP';    // Up arrow
  if (event.keyCode === 39 && currentDirection !== 'LEFT') nextDirection = 'RIGHT'; // Right arrow
  if (event.keyCode === 40 && currentDirection !== 'UP') nextDirection = 'DOWN';    // Down arrow
});

// Start the game when the page loads
function initGame() {
  document.querySelector('.game-over').style.display = 'none';
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  startGame();
}

// Start game on button click
document.getElementById('start-btn').addEventListener('click', function() {
  const playerName = document.getElementById('playerName').value || 'Player';
  localStorage.setItem('playerName', playerName);
  initGame();
});

// Button event listeners for controlling the snake
document.getElementById('upButton').addEventListener('click', moveUp);
document.getElementById('downButton').addEventListener('click', moveDown);
document.getElementById('leftButton').addEventListener('click', moveLeft);
document.getElementById('rightButton').addEventListener('click', moveRight);