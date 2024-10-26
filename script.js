const DINOSAUR = document.getElementById('dinosaur');
const currentScoreText = document.getElementById("score").textContent;
const highestScoreText = document.getElementById("theHighestScore").textContent;
const obstaclesDown = document.getElementsByClassName("obstaclesDown");
const obstaclesUp = document.getElementsByClassName("obstaclesUp");
const VERIFICATION_INTERVAL = 10;
const GAME_HEIGHT = 120;
const UPWARD = 0.1;
const DOWNWARD = 0;
const MILLISECOND_INTERVAL = 100;
const OBSTACLE_START_POSITION = 350;
const MINIMUM_OBSTACLE_SPACING = 12;
const OBSTACLE_UPDATE_INTERVAL = 10;
let gameActive = false;
let restartGame = false;
let dinosaurIsJumping = false;
let score = 0;
let lastObstacleScore = 0;
let level = 0;
let movementSpeed = 2;
let timeBetweenObstacles = 25;
let obstacleUpdateInterval;
let highestScore = 0;

function updateScore() {
    setInterval(function () {
        if (gameActive) {
            ++score;
            let lengthOfScore = (score + "").length;
            let newTextScore = currentScoreText.slice(0, -lengthOfScore);
            document.getElementById("score").innerHTML = newTextScore + score;
            spawnObstacle();
            checkLevelUp();
        }
    }, MILLISECOND_INTERVAL);
}

function checkAndUpdateHighestScore() {
    if (!gameActive && score !== 0) {
        if (highestScore < score) {
            highestScore = score;
        }
    }
    let lengthOfScore = (highestScore + "").length;
    let newTextHighestScore = highestScoreText.slice(0, -lengthOfScore);
    document.getElementById("theHighestScore").innerHTML = newTextHighestScore + highestScore;
    score = 0;
}

function checkLevelUp() {
    if (score % 100 === 0 && score > 99) {
        document.getElementById('levelUp').style.visibility = 'visible';
        timeBetweenObstacles = Math.max(timeBetweenObstacles - 1, MINIMUM_OBSTACLE_SPACING);
        ++level;
        return true;
    } else if (score % 120 === 0) {
        document.getElementById('levelUp').style.visibility = 'hidden';
        return false;
    }
}

function jumpDinosaur() {
    let heightOfTheJump = parseInt(window.getComputedStyle(DINOSAUR).top);
    let jumpHeight = GAME_HEIGHT;
    let jumpDirection = UPWARD;
    let jumpSpeed = 1.5;

    jumpInterval = setInterval(function () {
        dinosaurIsJumping = true;
        if (jumpHeight === 0) {
            jumpDirection = DOWNWARD;
        }
        if (jumpDirection === UPWARD) {
            jumpHeight -= jumpSpeed;
            DINOSAUR.style.top = jumpHeight + 'px';
        } else {
            jumpSpeed = 2;
            jumpHeight += jumpSpeed;
            DINOSAUR.style.top = jumpHeight + 'px';
            if (jumpHeight === GAME_HEIGHT) {
                clearInterval(jumpInterval);
                dinosaurIsJumping = false;
            }
        }
    }, VERIFICATION_INTERVAL);
}

function spawnObstacle() {
    if (level >= 2) {
        if (score % timeBetweenObstacles === 0) {
            let obstacle = getRandomInt(2);
            if (obstacle === 1) {
                createObstaclesUp();
            } else {
                createObstaclesDown();
            }
        }
    } else if (score % timeBetweenObstacles === 0 || score === 1) {
        createObstaclesDown();
    }
}

function updateObstaclePosition() {
    obstacleUpdateInterval = setInterval(function () {
        changeObstaclePosition();
        dinosaurHitsAnObstacle();
    }, OBSTACLE_UPDATE_INTERVAL);
}

function createObstaclesDown() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstaclesDown');
    obstacle.style.left = OBSTACLE_START_POSITION + 'px';
    document.getElementById('dinosaurGame').appendChild(obstacle);
}

function createObstaclesUp() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstaclesUp');
    obstacle.style.left = OBSTACLE_START_POSITION + 'px';
    document.getElementById('dinosaurGame').appendChild(obstacle);
}

function changeObstaclePosition() {
    changeObstaclePositionForClass('obstaclesDown');
    changeObstaclePositionForClass('obstaclesUp');
}

function changeObstaclePositionForClass(obstacleClass) {
    const obstacles = document.getElementsByClassName(obstacleClass);
    for (let i = 0; i < obstacles.length; ++i) {
        if (i > 0) {
            let left = parseInt(window.getComputedStyle(obstacles[i]).left);
            obstacles[i].style.left = (left - movementSpeed) + 'px';
        }
    }
}

function dinosaurHitsAnObstacle() {
    const dinosaurRect = DINOSAUR.getBoundingClientRect();
    const obstacles = document.querySelectorAll('.obstaclesDown, .obstaclesUp');

    for (let obstacle of obstacles) {
        const obstacleRect = obstacle.getBoundingClientRect();
        if (checkCollision(dinosaurRect, obstacleRect)) {
            document.getElementById('gameOverMess').style.visibility = 'visible';
            gameActive = false;
            setNewInstructions();
            clearInterval(obstacleUpdateInterval);
            restartGame = true;
            checkAndUpdateHighestScore();
            return true;
        }
    }
    return false;
}

function checkCollision(dinosaurRect, obstacleRect) {
    return dinosaurRect.left < obstacleRect.right && dinosaurRect.right > obstacleRect.left &&
        dinosaurRect.top < obstacleRect.bottom && dinosaurRect.bottom > obstacleRect.top;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function setNewInstructions() {
    document.getElementById('instructions').innerHTML = "Press space to restart the game.";
}

function startNewGame() {
    for (let i = obstaclesDown.length - 1; i >= 0; --i) {
        obstaclesDown[i].remove();
    }
    for (let i = obstaclesUp.length - 1; i >= 0; --i) {
        obstaclesUp[i].remove();
    }
    document.getElementById('gameOverMess').style.visibility = 'hidden';
    score = 0;
    level = 0;
    movementSpeed = 2;
    timeBetweenObstacles = 25;
    gameActive = true;
    dinosaurIsJumping = false;
    updateObstaclePosition();
}

updateObstaclePosition();

document.addEventListener('keydown', function (event) {
    if (event.key === " " && restartGame) {
        startNewGame();
        restartGame = false;
    } else if (event.key === " ") {
        if (!dinosaurIsJumping) {
            jumpDinosaur();
        }
        if (!gameActive) {
            updateScore();
        }
        gameActive = true;
    }
});
