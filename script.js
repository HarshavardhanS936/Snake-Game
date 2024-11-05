const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20;
let snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
let direction = null;
let food = {
  x: Math.floor(Math.random() * 29) * boxSize,
  y: Math.floor(Math.random() * 19) * boxSize,
};
let score = 0;
let speed = 150;
let gameInterval;
let timeInterval;
let timeElapsed = 0;
let isPaused = false;
const tutorialOverlay = document.getElementById("tutorialOverlay");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");
document.addEventListener("keydown", startGame);
pauseButton.addEventListener("click", togglePause);
restartButton.addEventListener("click", restartGame);
let startX, startY;
canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);
function startGame(event) {
  if (!direction && event.key.startsWith("Arrow")) {
    setDirection(event);
    gameInterval = setInterval(gameLoop, speed);
    timeInterval = setInterval(updateTime, 1000);
    tutorialOverlay.style.display = "none";
  } else {
    setDirection(event);
  }
}
function setDirection(event) {
  const keyPressed = event.keyCode;
  if (keyPressed === 37 && direction !== "RIGHT") direction = "LEFT";
  else if (keyPressed === 38 && direction !== "DOWN") direction = "UP";
  else if (keyPressed === 39 && direction !== "LEFT") direction = "RIGHT";
  else if (keyPressed === 40 && direction !== "UP") direction = "DOWN";
}
function handleTouchStart(event) {
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
}
function handleTouchMove(event) {
  const diffX = event.touches[0].clientX - startX;
  const diffY = event.touches[0].clientY - startY;
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0 && direction !== "LEFT") direction = "RIGHT";
    else if (diffX < 0 && direction !== "RIGHT") direction = "LEFT";
  } else {
    if (diffY > 0 && direction !== "UP") direction = "DOWN";
    else if (diffY < 0 && direction !== "DOWN") direction = "UP";
  }
}
function drawFood() {
  ctx.fillStyle = "brown";
  ctx.beginPath();
  ctx.arc(food.x + boxSize / 2, food.y + boxSize / 2, boxSize / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.fillRect(food.x + 12, food.y + 5, 3, 3);
}
function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "limegreen";
    ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
    ctx.strokeStyle = "#111";
    ctx.strokeRect(snake[i].x, snake[i].y, boxSize, boxSize);
  }
  const head = snake[0];
  const eyeSize = boxSize / 6;
  const eyeOffsetY = boxSize / 4;
  const eyeOffsetX = boxSize / 4;
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(head.x + eyeOffsetX, head.y + eyeOffsetY, eyeSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(head.x + 3 * eyeOffsetX, head.y + eyeOffsetY, eyeSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "black";
  const pupilSize = eyeSize / 2;
  ctx.beginPath();
  ctx.arc(head.x + eyeOffsetX, head.y + eyeOffsetY, pupilSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(head.x + 3 * eyeOffsetX, head.y + eyeOffsetY, pupilSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(head.x + boxSize / 2, head.y + eyeOffsetY + pupilSize);
  ctx.quadraticCurveTo(head.x + boxSize / 2, head.y + eyeOffsetY + 2 * pupilSize, head.x + boxSize / 2 + 10, head.y + eyeOffsetY + pupilSize);
  ctx.strokeStyle = "red";
  ctx.stroke();
}
function moveSnake() {
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (direction === "LEFT") snakeX -= boxSize;
  if (direction === "UP") snakeY -= boxSize;
  if (direction === "RIGHT") snakeX += boxSize;
  if (direction === "DOWN") snakeY += boxSize;
  if (snakeX === food.x && snakeY === food.y) {
    food = {
      x: Math.floor(Math.random() * 29) * boxSize,
      y: Math.floor(Math.random() * 19) * boxSize,
    };
    score++;
    document.getElementById("scoreValue").innerText = score;
    if (score % 5 === 0) {
      speed = Math.max(speed - 10, 50);
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, speed);
    }
  } else {
    snake.pop();
  }
  const newHead = { x: snakeX, y: snakeY };
  if (collision(newHead, snake) || snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height) {
    gameOver();
  }
  snake.unshift(newHead);
}
function collision(head, snakeArray) {
  for (let i = 0; i < snakeArray.length; i++) {
    if (head.x === snakeArray[i].x && head.y === snakeArray[i].y) {
      return true;
    }
  }
  return false;
}
function updateTime() {
  if (!isPaused) {
    timeElapsed++;
    document.getElementById("timeValue").innerText = timeElapsed;
  }
}
function gameLoop() {
  if (!isPaused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    moveSnake();
  }
}
function togglePause() {
  isPaused = !isPaused;
  pauseButton.innerText = isPaused ? "Resume" : "Pause";
}
function restartGame() {
  clearInterval(gameInterval);
  clearInterval(timeInterval);
  snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
  direction = null;
  food = {
    x: Math.floor(Math.random() * 29) * boxSize,
    y: Math.floor(Math.random() * 19) * boxSize,
  };
  score = 0;
  speed = 150;
  timeElapsed = 0;
  isPaused = false;
  document.getElementById("scoreValue").innerText = score;
  document.getElementById("timeValue").innerText = timeElapsed;
  pauseButton.innerText = "Pause";
  clearCanvas();
  initialDraw();
}
function gameOver() {
  clearInterval(gameInterval);
  clearInterval(timeInterval);
  alert(`Game Over! Your Score: ${score}. Time Played: ${timeElapsed} seconds`);
  restartGame();
}
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function initialDraw() {
  clearCanvas();
  drawFood();
  drawSnake();
}
initialDraw();