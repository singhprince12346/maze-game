"use-strict";
/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Choose theme at random.
const colors = ["#D64163", "#fa625f", "#4874E2"];
const colorsDark = ["#c13b59", "#e15856", "#4168cb"];
const selColor = Math.floor(Math.random() * colors.length);
document.documentElement.style.setProperty('--primary', colors[selColor]);
document.documentElement.style.setProperty('--primary-dark', colorsDark[selColor]);

// Define default values.
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
let road = [];
let roadCurve = 0;
let straightBlocks = 0;
let turnBlocks = 0;
let turnLeft = false;
let turnRight = false;
let count = 0;
let icons = ["\uf1bb", "\uf82b", "\uf400", "\uf724"];
let gameStarted = false;
let maxDistance = 0;
let totalBlocks = 0;
let speed = 10;

// Car object defined.
class Car {
    constructor() {
        this.x = 350;
        this.y = 500;
    }

    // This function shows car on canvas.
    show() {
        if (turnRight == true) {
            ctx.save();
            ctx.translate(this.x + 100, this.y + 100);
            ctx.rotate(20 * Math.PI / 180);
            ctx.translate(-(this.x + 100), -(this.y + 100));
            ctx.drawImage(carImage, this.x, this.y);
            ctx.restore();
            return;
        }
        if (turnLeft == true) {
            ctx.save();
            ctx.translate(this.x + 100, this.y + 100);
            ctx.rotate(-20 * Math.PI / 180);
            ctx.translate(-(this.x + 100), -(this.y + 100));
            ctx.drawImage(carImage, this.x, this.y);
            ctx.restore();
            return;
        }
        ctx.drawImage(carImage, this.x, this.y);
    }

    // Move car function.
    move() {
        if (turnLeft == true) {
            this.x -= 5;
        }
        if (turnRight == true) {
            this.x += 5;
        }
        if (gameStarted) {
            if (this.x < road[53].o - 50 || this.x + 200 > road[53].o + 450) {
                resetGame();
            }
            if (road[53].e != false) {
                let dif = Math.abs((this.x + 100) - road[53].e);
                if (dif < 80) {
                    resetGame();
                }
            }
        }
    }
}

// Reset game fucntion.
function resetGame() {
    count = 0;
    road = [];
    speed = 10;
    document.getElementById("score_ID").innerText = count;
    document.getElementById("speed_ID").innerHTML = `0 m/s`;
    gameStarted = false;
    totalBlocks = 0;
    createRoad();
    car = new Car();
}

// Add controls.
window.addEventListener("keydown", function (e) {
    e.preventDefault();
    if (e.keyCode == 38) {
        if (gameStarted == true && speed < 20) {
            speed += 5;
        }
        gameStarted = true;
    }
    if (e.keyCode == 40) {
        if (gameStarted == true && speed > 10) {
            speed -= 5;
        }
    }
    if (gameStarted) {
        if (e.keyCode == 37) {
            turnLeft = true;
            turnRight = false;
        } else if (e.keyCode == 39) {
            turnRight = true;
            turnLeft = false;
        }
    }

});

// Windows key events.
window.addEventListener("keyup", function (e) {
    if (e.keyCode == 37) {
        turnLeft = false;
        turnRight = false;
    } else if (e.keyCode == 39) {
        turnRight = false;
        turnLeft = false;
    }

});

let carImage = new Image();
carImage.src = "assets/images/car.png";
let car = new Car();

// Create road function.
function createRoad() {
    let total = canvas.height / 10;
    for (let i = 1; i < total + 1; i++) {
        createRoadBlock(250, i);
    }
}

// Create road block.
function createRoadBlock(offset, i) {
    totalBlocks++;
    let tree = false;
    let element = false;
    let rn = Math.random();
    if (totalBlocks % 15 == 0) {
        if (rn > 0.5) {
            tree = (rn * (500 - offset)) + offset + 400;
        } else {
            tree = (rn * (offset) - 30);
        }
    }
    if (gameStarted && totalBlocks % 30 == 0 && Math.random() > 0.7) {
        let x = (rn * 350) + offset + 50;
        element = x;
    }
    road.unshift({ o: offset, w: 400, b: tree, e: element });
}

// Show road function shows road.
function showRoad() {
    for (let i = 0; i < road.length; i++) {
        if (i > 0) {
            ctx.beginPath();
            ctx.moveTo(road[i].o, i * speed);
            ctx.lineWidth = 10;
            ctx.lineTo(road[i - 1].o, (i * speed) + speed);
            ctx.strokeStyle = "#666666";
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(road[i].o + 400, i * speed);
            ctx.lineWidth = 10;
            ctx.lineTo(road[i - 1].o + 400, (i * speed) + speed);
            ctx.strokeStyle = "#666666";
            ctx.stroke();
        }
        if (road[i].b != false) {
            ctx.beginPath();
            ctx.font = '300 52px "Font Awesome 5 Pro"';
            ctx.fillStyle = "#666666";
            ctx.textAlign = 'center';
            ctx.fillText("\uf400", road[i].b, i * speed);
        }
        if (road[i].e != false) {
            ctx.beginPath();
            ctx.font = '300 52px "Font Awesome 5 Pro"';
            ctx.fillStyle = "#666666";
            ctx.textAlign = 'center';
            ctx.fillText("\uf2fc", road[i].e, i * speed);
        }
    }
}

// Update road function update road.
function updateRoad() {
    let r = Math.random();
    switch (roadCurve) {
        case 0:
            if (straightBlocks < 5) {
                createRoadBlock(road[0].o, straightBlocks);
                road.pop();
                straightBlocks++;
            } else {
                straightBlocks = 0;
                if (r > 0.5 && road[0].o < canvas.width - 500) {
                    roadCurve = 1;
                } else if (road[0].o >= 100) {
                    roadCurve = -1;
                }
            }
            break;
        case 1:
            if (turnBlocks < 80 && road[0].o < (canvas.width - 500)) {
                let offset = road[0].o;
                offset = offset + (turnBlocks / 20);
                createRoadBlock(offset, turnBlocks);
                road.pop();
                turnBlocks++;
            } else {
                turnBlocks = 0;
                roadCurve = 0;
            }
            break;
        case -1:
            if (turnBlocks < 80 && road[0].o > 100) {
                let offset = road[0].o;
                offset = offset - (turnBlocks / 20);
                createRoadBlock(offset, turnBlocks);
                road.pop();
                turnBlocks++;
            } else {
                turnBlocks = 0;
                roadCurve = 0;
            }
            break;
    }
}

createRoad();

// This function shows start.
function showStart() {
    ctx.beginPath();
    ctx.font = '300 62px "Font Awesome 5 Pro"';
    ctx.fillStyle = "#858585";
    ctx.textAlign = 'center';
    ctx.fillText("\uf04c", 450, 350);
}

draw();
// Draw function defined.
function draw() {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
    car.show();
    car.move();
    if (gameStarted) {
        updateRoad();
    } else {
        showStart();
    }
    showRoad();
    if (gameStarted) {
        // Update dom elements.
        document.getElementById("score_ID").innerText = count;
        if (count > maxDistance) {
            maxDistance = count;
            document.getElementById("maxScore_ID").innerText = maxDistance;
        }
        //Display Speedometer
        document.getElementById("speed_ID").innerHTML = `${speed} m/s`;
        document.getElementById("speed_ID").innerHTML = `${speed*3.6} km/hr`;
        count++;
    }
    window.requestAnimationFrame(draw);
}
