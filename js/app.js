// Global variables

let allEnemies = [];
let player;
const scoreToWin = 500;
let isGameStarted = false;

// Constants that guard canvas so the player don't move outside the game margins
const topMargin = 50;
const bottomMargin = canvas.height - 200;
const leftMargin = 20;
const rightMargin = canvas.width - 110;

// Starting position for the player based on canvas height
const defaultPos = [202.5, 415];
const defaultSpeed = [130, 140, 150, 170, 190, 210];

// DOM object
const scoreElem = document.querySelector('.score');
const livesElem = document.querySelector('.lives');
const pressPlayElem = document.querySelector('.blink');

// Enemies our player must avoid
class Enemy {

    constructor(x, y, speed) {

        // Variables applied to each of our instances go here
        this.sprite = 'images/enemy-bug.png';
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = 60;
        this.height = 60;
    }

    // Update the enemy's position, required method for game; Parameter: dt, a time delta between ticks
    // Enemy moves *automaticaly* left to right on a stright line (an x axis has to be randered, y axis is set initialy when the instance is created and it doesn't change) 

    update(dt) {

        if (this.x <= canvas.width) { // an object is visible on the canvas, update position...
            this.x += dt * (this.speed);
        } else if (this.x > canvas.width) { // an object is outside the visible canvas, reset the position
            this.x = 0;
        }

        // if the player object has crashed into the enemy object we need to handle collision
        if (checkCollision(this, player) == true) {
            handleCollisionCondition();
        }

    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {

    constructor(x, y) {

        this.sprite = 'images/char-princess-girl.png';
        this.x = x;
        this.y = y;
        this.width = 65;
        this.height = 65;
        this.score = 0;
        this.numOfLives = 3;

    }


    // update x and y coordinates of the player
    update(x = this.x, y = this.y) {
        this.x = x;
        this.y = y;


        // collision shall be checked between any enemy object and the player object 
        allEnemies.forEach((enemy) => {
            if (checkCollision(this, enemy) == true) {
                handleCollisionCondition();
            }
        });

        // if player reached water, increase the score for 100 points, if player reched scoreToWin points, the game is won!
        if (this.y < 70) {
            this.score += 100;
            player.update(defaultPos[0], defaultPos[1]);
            scoreElem.innerHTML = `Score: ${player.score}`;

            if (this.score == scoreToWin) {
                handleWinCondition(this.score);
            }
        }
    }


    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }


    // Handle keyboard inputs to move the players, respecting the board's boundaries
    // coordinates of the canvas start (0,0) from the top left corner!
    handleInput(key) {

        if (key == 'up' && this.y > topMargin && isGameStarted) {
            this.update(undefined, this.y - 84);

        } else if (key == 'down' && this.y < bottomMargin && isGameStarted) {
            this.update(undefined, this.y + 84);

        } else if (key == 'left' && this.x > leftMargin && isGameStarted) {
            this.update(this.x - 101, undefined);

        } else if (key == 'right' && this.x < rightMargin && isGameStarted) {
            this.update(this.x + 101, undefined);
        } else if (key == 'enter') {
            initFrogger();
            pressPlayElem.innerHTML = '&nbsp;';
            isGameStarted = true;

        }
    }
}


// Helper function: Generate a random speed of the enemy
const randomSpeed = function() {
    let speed = defaultSpeed[randomInt(6)];
    return speed;
}

// Helper function: generate a random integer between 0 and the max value (array size)
const randomInt = function(max_items) {
    return Math.floor(Math.random() * Math.floor(max_items));
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

player = new Player(defaultPos[0], defaultPos[1]);


// Initiate the enemies and add them to the array

const evilBugXor = new Enemy(-140, 65, randomSpeed());
const evilBugGrounch = new Enemy(-210, 65, randomSpeed());
const evilBugGrug = new Enemy(-250, 148, randomSpeed());
const evilBugSlurpy = new Enemy(-180, 230, randomSpeed());


// Function 'initiates the frogger game', ie. populates the global array allEnemies with the enemy objects
const initFrogger = function() {

    allEnemies = [];
    allEnemies.push(evilBugXor, evilBugGrounch, evilBugGrug, evilBugSlurpy);

}


// Helper function: Check collisions between two objects
// Collision occures only on the x or the y axes
// The player moves: left<-->right or up<-->down (4 directions)
// The enemy moves:  left->right (1 direction)
// In total: 4 possible collision points
const checkCollision = function(obj1, obj2) {

    let isCollided;

    if (obj1.x + obj1.width > obj2.x &&
        obj2.x + obj2.width > obj1.x &&
        obj1.y + obj1.height > obj2.y &&
        obj2.y + obj2.height > obj1.y) {

        isCollided = true;

    } else {
        isCollided = false;
    }

    return isCollided;

}


// Helper function: Handle collisions
const handleCollisionCondition = function() {
    if (player.numOfLives > 1) {
        player.numOfLives--;
        player.update(defaultPos[0], defaultPos[1]);
        livesElem.innerHTML = `Lives: ${player.numOfLives}`;
        // alert("You've been eaten by a bug!! Careful: " + player.numOfLives + " lives left!");
    } else {
        gameOver();
    }
}


// Helper function: Handle win condition
const handleWinCondition = function() {
    alert(`You won!! Score: ${player.score}`);
    player.update(defaultPos[0], defaultPos[1]);
    player.numOfLives = 3;
    player.score = 0;

    livesElem.innerHTML = `Lives: ${player.numOfLives}`;
    scoreElem.innerHTML = `Score: ${player.score}`;

}


// Helper function: Handle condition when the game ends
const gameOver = function() {

    alert("Out of lives! Game over my friend!! Try again.");
    player.update(defaultPos[0], defaultPos[1]);
    player.numOfLives = 3;
    player.score = 0;

    livesElem.innerHTML = `Lives: ${player.numOfLives}`;
    scoreElem.innerHTML = `Score: ${player.score}`;
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});