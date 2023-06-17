let player = document.getElementById('player');
let gameContainer = document.getElementById('game-container');
let obstaclesContainer = document.getElementById('obstacles-container');
let powerUpsContainer = document.getElementById('power-ups-container');
let scoreDiv = document.getElementById('score');

let playerX = 275;
let playerY = 0;

let windowSize = window.innerWidth;

let playerSpeedX = 5;
let playerSpeedY = 5;
let obstacleSpeed = 5;
let powerUpSpeed = 5;

let playerDirectionX = 0;
let playerDirectionY = 0;

let obstacleSpawnInterval = 1000;
let powerUpSpawnInterval = 3000;
let score = 0;

let obstacles = [];
let powerUps = [];

let gameLoop;
let isGameOver = false;

startGame();

function startGame() {
    resetGame();

    gameLoop = setInterval(runGame, 16); // Run at approximately 60 frames per second (1000ms / 60fps ≈ 16.67ms)

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyUp);
}

function resetGame() {
    playerX = windowSize / 2;
    playerY = 0;
    score = 0;
    playerSpeedX = 5;
    playerSpeedY = 5;
    obstacleSpeed = 5;
    powerUpSpeed = 5;

    scoreDiv.textContent = 'Score: ' + score;

    while (obstacles.length > 0) {
        obstacles.pop().remove();
    }

    while (powerUps.length > 0) {
        powerUps.pop().remove();
    }
}

function runGame() {
    movePlayer();
    moveObstacles();
    movePowerUps();
    checkCollisions();
    spawnObstacle();
    spawnPowerUp();
}

function handleKeyPress(event) {
    if (event.code === 'ArrowLeft') {
        playerDirectionX = -1;
    } else if (event.code === 'ArrowRight') {
        playerDirectionX = 1;
    } else if (event.code === 'ArrowDown') {
        playerDirectionY = -1;
    } else if (event.code === 'ArrowUp') {
        playerDirectionY = 1;
    }
}

function handleKeyUp(event) {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
        playerDirectionX = 0;
    } else if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
        playerDirectionY = 0;
    }
}

function movePlayer() {
    playerX += playerSpeedX * playerDirectionX;
    playerY += playerSpeedY * playerDirectionY;

    playerX = Math.max(0, Math.min(playerX, gameContainer.offsetWidth - player.offsetWidth));
    playerY = Math.max(0, Math.min(playerY, gameContainer.offsetHeight - player.offsetHeight));

    player.style.left = playerX + 'px';
    player.style.bottom = playerY + 'px';
}

function moveObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        let obstacleY = obstacle.offsetTop;

        if (obstacleY > gameContainer.offsetHeight) {
            obstacle.remove();
            obstacles.splice(i, 1);
            i--;
            continue;
        }

        obstacle.style.top = obstacleY + obstacleSpeed + 'px';
    }
}

function movePowerUps() {
    for (let i = 0; i < powerUps.length; i++) {
        let powerUp = powerUps[i];
        let powerUpY = powerUp.offsetTop;

        if (powerUpY > gameContainer.offsetHeight) {
            powerUp.remove();
            powerUps.splice(i, 1);
            i--;
            continue;
        }

        powerUp.style.top = powerUpY + powerUpSpeed + 'px';
    }
}

function checkCollisions() {
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];

        if (collision(player, obstacle)) {
            gameOver();
            return;
        }
    }

    for (let i = 0; i < powerUps.length; i++) {
        let powerUp = powerUps[i];

        if (collision(player, powerUp)) {
            powerUp.remove();
            powerUps.splice(i, 1);
            i--;
            score += 2;
            scoreDiv.textContent = 'Score: ' + score;
            playerSpeedX += 2;
            playerSpeedY += 2;
            obstacleSpeed += 1;
            powerUpSpeed += 1;
        }
    }
}

function collision(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function spawnObstacle() {
    if (Math.random() < 0.02) {
        let obstacle = document.createElement('img');
        obstacle.src = 'Pictures/ps3.png';
        obstacle.classList.add('obstacle');
        obstacle.style.left = Math.random() * (gameContainer.offsetWidth - obstacle.offsetWidth) + 'px';
        obstacle.style.top = '-50px';
        gameContainer.appendChild(obstacle);
        obstacles.push(obstacle);
    }
}

function spawnPowerUp() {
    if (Math.random() < 0.005) {
        let powerUp = document.createElement('div');
        powerUp.classList.add('power-up');
        powerUp.style.left = Math.random() * (gameContainer.offsetWidth - powerUp.offsetWidth) + 'px';
        powerUp.style.top = '-50px';
        gameContainer.appendChild(powerUp);
        powerUps.push(powerUp);
    }
}

function spawnPlayer() {
    player = document.createElement('img');
    player.src = '../game js/Pictures/main.png';
    player.classList.add('player');
    player.style.left = playerX + 'px';
    player.style.bottom = playerY + 'px';
    gameContainer.appendChild(player);
}

// Add your game logic here

// When the game is over, show the game over screen
function showGameOverScreen() {
    let gameOverScreen = document.getElementById("gameOver");
    let playAgainButton = document.getElementById("playAgain");
    let goBackButton = document.getElementById("goBack");
    isGameOver = true;

    gameOverScreen.style.display = "block";

    // Add an event listener to the play again button
    playAgainButton.addEventListener("click", function () {
        // Hide the game over screen
        gameOverScreen.style.display = "none";
        clearInterval(gameLoop);
        resetGame();
        startGame();
        isGameOver = false;
    });
}

// Call this function when your game is over
function gameOver() {
    // Perform any necessary game over actions (e.g., stopping timers, updating high score)
    clearInterval(gameLoop);
    // Show the game over screen
    showGameOverScreen();
}