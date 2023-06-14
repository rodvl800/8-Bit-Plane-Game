let player = document.getElementById('player');
let gameContainer = document.getElementById('game-container');
let obstaclesContainer = document.getElementById('obstacles-container');
let powerUpsContainer = document.getElementById('power-ups-container');
let scoreDiv = document.getElementById('score');

let playerX = 275;
let playerY = 0;

let playerSpeed = 10;
let obstacleSpeed = 5;
let powerUpSpeed = 5;

let obstacleSpawnInterval = 1500;
let powerUpSpawnInterval = 5000;
let score = 0;

let obstacles = [];
let powerUps = [];

let gameLoop;

startGame();

function startGame() {
    resetGame();

    gameLoop = setInterval(runGame, 50);

    document.addEventListener('keydown', handleKeyPress);
}

function resetGame() {
    playerX = 275;
    playerY = 0;
    score = 0;

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
        if (playerX > 0) {
            playerX -= playerSpeed;
            player.style.left = playerX
        }
    } else if (event.code === 'ArrowRight') {
        if (playerX < gameContainer.offsetWidth - player.offsetWidth) {
            playerX += playerSpeed;
            player.style.left = playerX + 'px';
        }
    }
}

function movePlayer() {
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
        obstacle.src = 'Pictures/ps2.gif';
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


function gameOver() {
    clearInterval(gameLoop);
    alert('Game Over!');
    resetGame();
    startGame();
}

function spawnPlayer() {
    player = document.createElement('img');
    player.src = '../game js/Pictures/main.png';
    player.classList.add('player');
    player.style.left = playerX + 'px';
    player.style.bottom = playerY + 'px';
    gameContainer.appendChild(player);
}

