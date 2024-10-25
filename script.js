const DINOSAUR = document.getElementById('dinosaur');
const TIME_OF_VERIFICATION = 10;
const HEIGHT_OF_THE_GAME = 120;
const UP_DIRECTION = 0.1;
const DOWN_DIRECTION = 0;
const TENTH = 100;
let gameActive = false;
let dinosaurIsJumping = false;
let score = 0;
let lastObstacleScore = 0;
let level = 0;
let movementSpeed = 2;
let timeBetweenObstacles = 25;

function updateScore() {
    setInterval(function () {
        if (gameActive && !gameOver()) {
            ++score;
            let textScore = document.getElementById("score").textContent;
            let lenghtOfScore = (score + "").length;
            let newTextScore = textScore.slice(0, -lenghtOfScore);
            document.getElementById("score").innerHTML = newTextScore + score;

            spawnObstacle();
            levelUp();
        }
    }, TENTH);
}

function levelUp() {
    if (score % 100 === 0 && score > 99) {
        document.getElementById('levelUp').style.visibility = 'visible';
        // movementSpeed = Math.min(movementSpeed + 0.5, 5);  
        timeBetweenObstacles = Math.max(timeBetweenObstacles - 1, 10);
        ++level;
        return true;
    } else if (score % 120 === 0) {
        document.getElementById('levelUp').style.visibility = 'hidden';
        return false;
    }
}

function jumpDino() {
    let heightOfTheJump = parseInt(window.getComputedStyle(DINOSAUR).top);
    let jumpHeigh = HEIGHT_OF_THE_GAME;
    let jumpDirection = UP_DIRECTION;
    let jump_speed = 1.5;

    jumpInterval = setInterval(function () {
        dinosaurIsJumping = true;
        if (jumpHeigh === 0) {
            jumpDirection = DOWN_DIRECTION;
        }
        if (jumpDirection === UP_DIRECTION) {
            jumpHeigh -= jump_speed;
            DINOSAUR.style.top = jumpHeigh + 'px';
        } else {
            jump_speed = 2;
            jumpHeigh += jump_speed;
            DINOSAUR.style.top = jumpHeigh + 'px';
            if (jumpHeigh === HEIGHT_OF_THE_GAME) {
                clearInterval(jumpInterval);
                dinosaurIsJumping = false;
            }
        }
    }, TIME_OF_VERIFICATION)
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
    setInterval(function () {
        changeObstaclePosition();
    }, 10);
}

function createObstaclesDown() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstaclesDown');
    let lastObstacle = document.querySelector('.obstaclesDown:last-child');
    let position = lastObstacle ? parseInt(lastObstacle.style.left) : 220;

    if (position < 50) {
        position = 220;
    }
    obstacle.style.left = position + 'px';
    document.getElementById('dinosaurGame').appendChild(obstacle);
}

function createObstaclesUp() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstaclesUp');
    let lastObstacle = document.querySelector('.obstaclesUp:last-child');
    let position = lastObstacle ? parseInt(lastObstacle.style.left) : 220;

    if (position < 50) {
        position = 220;
    }
    obstacle.style.left = position + 'px';
    document.getElementById('dinosaurGame').appendChild(obstacle);
}

function changeObstaclePosition() {
    // Actualizează poziția pentru ambele tipuri de obstacole
    changeObstaclePositionForClass('obstaclesDown');
    changeObstaclePositionForClass('obstaclesUp');
}

function changeObstaclePositionForClass(obstacleClass) {
    const obstacles = document.getElementsByClassName(obstacleClass);
    for (let i = 0; i < obstacles.length; ++i) {
        if (i > 0) {
            let left = parseInt(window.getComputedStyle(obstacles[i]).left);
            if (left > -880) {
                obstacles[i].style.left = (left - movementSpeed) + 'px';
            } else {
                delete obstacles[i]; // Corect: eliminare DOM element
            }
        }
    }
}

function dinosaurHitsAnObstacle() {

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function theHighestScore() {
    return false;
}

function gameOver() {
    return false;
}

updateObstaclePosition();

document.addEventListener('keydown', function (event) {
    if (event.key === " ") {
        if (!dinosaurIsJumping) {
            jumpDino();
        }
        if (gameActive === false) {
            updateScore();
        }

        gameActive = true;
    }
});