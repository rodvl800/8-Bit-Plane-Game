let player = document.getElementById('player');
let gameContainer = document.getElementById('game-container');
let obstaclesContainer = document.getElementById('obstacles-container');
let powerUpsContainer = document.getElementById('power-ups-container');
let scoreDiv = document.getElementById('score');

let playerX = 275; //initial position of a ship
let playerY = 0;

let windowSize = window.innerWidth;

let playerSpeedX = 5; //initial speed of objects
let playerSpeedY = 5;
let obstacleSpeed = 5;
let powerUpSpeed = 5;

let playerDirectionX = 0;
let playerDirectionY = 0;

let obstacleSpawnInterval = 1000; //how often do things spawn
let powerUpSpawnInterval = 3000;
let score = 0;

let obstacles = []; //formation of obstacles and powerups
let powerUps = [];

let gameLoop; //variables for diifferent states of the game
let isGameOver = false;

startGame(); //start game

function startGame() {
    resetGame();

    gameLoop = setInterval(runGame, 16); // Run every 16 milliseconds

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

    while (obstacles.length > 0) { //remove any obstacles if they are on the screen
        obstacles.pop().remove();
    }

    while (powerUps.length > 0) { //remove any powerups if they are on the screen
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

function handleKeyPress(event) { //handle keypresses using event codes (https://www.freecodecamp.org/news/javascript-keycode-list-keypress-event-key-codes/)
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
//drtrct which direction the player should move
function handleKeyUp(event) {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
        playerDirectionX = 0;
    } else if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
        playerDirectionY = 0;
    }
}

function movePlayer() {
    playerX += playerSpeedX * playerDirectionX; // moves player with a specific speed
    playerY += playerSpeedY * playerDirectionY;

    playerX = Math.max(0, Math.min(playerX, gameContainer.offsetWidth - player.offsetWidth)); //ensure that the player does not move outside the visible area
    playerY = Math.max(0, Math.min(playerY, gameContainer.offsetHeight - player.offsetHeight));

    player.style.left = playerX + 'px'; // moves player using css style
    player.style.bottom = playerY + 'px';
}

function moveObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        let obstacleY = obstacle.offsetTop; //vertical position of an obstacle

        if (obstacleY > gameContainer.offsetHeight) {
            obstacle.remove(); //delete obstacle when it fell from the screen
            obstacles.splice(i, 1); //also delete obstacle from the array
            i--;
        }

        obstacle.style.top = obstacleY + obstacleSpeed + 'px'; // moves obstacle with a specific speed
    }
}

//same principle but for powerups
function movePowerUps() {
    for (let i = 0; i < powerUps.length; i++) {
        let powerUp = powerUps[i];
        let powerUpY = powerUp.offsetTop;

        if (powerUpY > gameContainer.offsetHeight) {
            powerUp.remove();
            powerUps.splice(i, 1);
            i--;
        }

        powerUp.style.top = powerUpY + powerUpSpeed + 'px';
    }
}

function checkCollisions() {
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];

        if (collision(player, obstacle)) { //if a collision occurrs - game over
            gameOver();
        }
    }

    for (let i = 0; i < powerUps.length; i++) {
        let powerUp = powerUps[i];

        if (collision(player, powerUp)) { //if you collect a powerup - increase speed 
            powerUp.remove(); //and remove the pover from the screen bc is is collected
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
//https://stackoverflow.com/questions/2440377/javascript-collision-detection

function collision(a, b) { //check 2 elements for collision
    let aRect = a.getBoundingClientRect();//gets a position of an object from a point
    let bRect = b.getBoundingClientRect();

    return !(//returns true (indicates a collision)if any is false (sides collided)
        aRect.bottom < bRect.top ||//comparing the positions of the objects relatively
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function spawnObstacle() {
    if (Math.random() < 0.02) {//2% chance to spawn
        let obstacle = document.createElement('img');
        obstacle.src = 'Pictures/ps3.png';
        obstacle.classList.add('obstacle');//create css and modify it later
        obstacle.style.left = Math.random() * (gameContainer.offsetWidth - obstacle.offsetWidth) + 'px';
        obstacle.style.top = '-50px';
        gameContainer.appendChild(obstacle);//adds the picture in "container" div in html
        obstacles.push(obstacle);
    }
}

function spawnPowerUp() {
    if (Math.random() < 0.005) {//0,5% chance to spawn
        let powerUp = document.createElement('div');
        powerUp.classList.add('power-up');//create css and modify it later
        powerUp.style.left = Math.random() * (gameContainer.offsetWidth - powerUp.offsetWidth) + 'px';
        powerUp.style.top = '-50px';
        gameContainer.appendChild(powerUp);//adds the picture in "container" div in html
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

//Game over screen
function showGameOverScreen() {
    let gameOverScreen = document.getElementById("gameOver");
    let playAgainButton = document.getElementById("playAgain");
    let goBackButton = document.getElementById("goBack");
    isGameOver = true; //change the state of the game

    gameOverScreen.style.display = "block";

    playAgainButton.addEventListener("click", function () {

        gameOverScreen.style.display = "none"; // Hide the game over screen
        clearInterval(gameLoop);
        resetGame();
        startGame();
        isGameOver = false;
    });
}

// Call this function when the game is over
function gameOver() {
    clearInterval(gameLoop); //reset
    // Show the game over screen
    showGameOverScreen();
}