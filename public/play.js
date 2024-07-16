var gameBoard, player, enemy, laser, laser2;
enemy = [];
//loads my painting of space and the pixel art
var spacegif = "https://64.media.tumblr.com/a85d865d521d5b94534c09b0a8ad87c7/796e8cf6f5207595-47/s2048x3072/5c6b2ca3b956f4f5ba22330f771e023db89953db.gif";
var shipgif = "https://drive.google.com/uc?export=view&id=1iWsWodmzV96liCBX2l-iDbmifpV-Z42W";
var shipmovegif = "https://drive.google.com/uc?export=view&id=1p_tgCNAlcCokNIcZrLlFQRiCIiqg8AOw";
var enemygif = "https://drive.google.com/uc?export=view&id=1XqwqIYJ8AnERVeP5LJMyDZt0k7rF9LVM";
var lasergif = "https://drive.google.com/uc?export=view&id=1R2WsLspVy0XtVVd2YMQcp4r3AvU-bOvN";
var ac = true;
//event descriptions
const GameEndEvent = 'gameEnd';
const GameStartEvent = 'gameStart';

function GameArea(can) {
    
    this.canvas = can;
    this.context = this.canvas.getContext("2d");
    
    this.start = function() {
        this.score = 0;
        this.interval = setInterval(updateGameArea, 20);
        //stuff.configureWebSocket();
        //stuff.broadcastEvent(this.getPlayerName(), GameStartEvent, {});
    };
    
    this.clear = function() {
        var image = new Image();
        image.src = spacegif;
        this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    };
    
    this.stop = function() {
        clearInterval(this.interval);
        alert("Game Over!");
    };
}

//basic object function the player and enemies inherit from
function GamePiece(x, y, w, h, c, ctx, yn) {
    var className = "GamePiece";
    this.begx = x;
    this.begy = y;
    this.color = c;
    this.addX = 0;
    this.addY = 0;
    this.width = w;
    this.height = h;
    this.yesno = yn;
    this.context = ctx;
    this.canvas = document.getElementById("myCanvas");
    
    this.changeAddX = function(num) {
        this.addX += num;
    };
    
    this.changeAddY = function(num) {
        this.addY += num;
    };
    
    //draws my art on the canvas
    this.draw = function() {
        this.context.fillStyle = this.color;
        if (this.yesno === 'n') {
            if ((this.begx > this.canvas.width - 35) || (this.begx < 0)) {
                this.addX *= -1;
            }
        }
        this.begx += this.addX;
        this.begy += this.addY;
        
        var image = new Image();
        image.src = this.color;
        this.context.drawImage(image, this.begx, this.begy, this.width, this.height);
    };
    
    //checks if hitboxes collide
    this.crashWith = function(otherobj) {
        var myleft = this.begx;
        var myright = this.begx + (this.width);
        var mytop = this.begy;
        var mybottom = this.begy + (this.height);
        var otherleft = otherobj.begx;
        var otherright = otherobj.begx + (otherobj.width);
        var othertop = otherobj.begy;
        var otherbottom = otherobj.begy + (otherobj.height);
        var crash = false;
        if (((mybottom > othertop) && (mytop < otherbottom)) && 
            ((myright > otherleft) && (myleft < otherright))) {
            crash = true;
        }
        return crash;
    };
}

function main() {
    var canvas = document.getElementById("myCanvas");
    gameBoard = new GameArea(canvas);
    //draws the player
    player = new GamePiece(Math.floor(canvas.width / 2), (canvas.height - 50), 35, 35, shipgif, gameBoard.context, 'n');
    player.draw();
    //draws enemies
    for (var i = 0; i < 7; i++) {
        var y = Math.floor(Math.random() * ((-1 * canvas.height) + 20) - canvas.height);
        var x = Math.floor(Math.random() * (canvas.width - 35));
        enemy[i] = new GamePiece(x, y, 35, 35, enemygif, gameBoard.context, 'y');
        enemy[i].changeAddY(1);
        enemy[i].draw;
    }
    //draws the laser
    laser = new GamePiece(-10, -10, 2, 10, lasergif, gameBoard.context, 'y');
    laser2 = new GamePiece(-10, -10, 2, 10, lasergif, gameBoard.context, 'y');
    gameBoard.start();
}

//"animates" the canvas, moves the player and enemies and lasers
async function updateGameArea() {
    gameBoard.clear();
    var canvas = document.getElementById("myCanvas");
    for (var i = 0; i < 7; i++) {
        if (enemy[i].begy > canvas.height) {
            enemy[i].begy = Math.floor(Math.random() * ((-1 * canvas.height) + 20) - 20);
            enemy[i].begx = Math.floor(Math.random() * (canvas.width - 35));
            enemy[i].addY++;
        }
        enemy[i].draw();
        if (player.crashWith(enemy[i])) {
            saveScore(gameBoard.score);
            gameBoard.stop();
        } else if (laser.crashWith(enemy[i]) || laser2.crashWith(enemy[i])) {
            enemy[i].begy = Math.floor(Math.random() * ((-1 * canvas.height) + 20) - 20);
            enemy[i].begx = Math.floor(Math.random() * (canvas.width - 35));
            enemy[i].addY++;
            laser.begx = -10;
        }
    }
    document.addEventListener("keydown", action);
    document.addEventListener("keyup", actionUp);
    player.draw();
    laser.draw();
    laser2.draw();
    document.getElementById("score").innerHTML = gameBoard.score;
    gameBoard.score++;
}

function moveleft() {
    player.color = shipmovegif;
    player.changeAddX(-1);
}

function moveright() {
    player.color = shipmovegif;
    player.changeAddX(1);
}

function move(num) {
    var canvas = document.getElementById("myCanvas");
    player.color = shipmovegif;
    console.log(player.begx);
    if (player.begx < 0) {
        player.begx = 0;
    } else if (player.begx > (canvas.width - 35)) {
        player.begx = canvas.width - 35;
    }
    player.begx += num;
}

function lasers() {
    laser.begx = player.begx + 17;
    laser.begy = player.begy - 10;
    laser.changeAddY(-1);
}

function lasers2() {
    laser2.begx = player.begx + 17;
    laser2.begy = player.begy - 10;
    laser2.changeAddY(-1);
}

//moved this code to main()
function main2() {
    //document.addEventListener("keydown", action);
    //document.addEventListener("keyup", actionUp);
}

function action(event) {
    var arr = ['a', 'd', 's', 'w'];
    for (var i = 0; i < 4; i++) {
        if (arr[i] === event.key) {
            if (event.key === 'a') {
                move(-5);
            } else if (event.key === 'd') {
                move(5);
            } else if (event.key === 's') {
                cambiarlasers();
            } else if (event.key === 'w') {
                cambiarlasers();
            }
        }
    }
    main2();
}

function actionUp(event) {
    if (event.key === 'a' || 'd') {
        player.color = shipgif;
    }
    main2();
}

//allows player to shoot 2 lasers at a time
function cambiarlasers() {
    if(ac) {
        lasers();
        ac = false;
    } else {
        lasers2();
        ac = true;
    }
}

function getPlayerName() {
    return localStorage.getItem('userName') ?? 'Mystery player';
}

async function saveScore(score) {
    const userName = getPlayerName();
    const date = new Date().toLocaleDateString();
    const newScore = { name: userName, score: score, date: date };

    try {
        const response = await fetch('/api/score', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newScore),
        });

        //let other players know the game has ended
        //this.broadcastEvent(userName, GameEndEvent, newScore);

        // Store what the service gave us as the high scores
        const scores = await response.json();
        localStorage.setItem('scores', JSON.stringify(scores));
    } catch {
        // If there was an error then just track scores locally
        this.updateScoresLocal(newScore);
    }
}

function updateScoresLocal(newScore) {
    let scores = [];
    const scoresText = localStorage.getItem('scores');
    if (scoresText) {
        scores = JSON.parse(scoresText);
    }

    let found = false;
    for (const [i, prevScore] of scores.entries()) {
        if (newScore > prevScore.score) {
        scores.splice(i, 0, newScore);
        found = true;
        break;
        }
    }

    if (!found) {
        scores.push(newScore);
    }

    if (scores.length > 10) {
        scores.length = 10;
    }

    localStorage.setItem('scores', JSON.stringify(scores));
}

    //functionality for peer communication using websocket

//   configureWebSocket() {
//     const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
//     this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
//     this.socket.onopen = (event) => {
//       this.displayMsg('system', 'game', 'connected');
//     };
//     this.socket.onclose = (event) => {
//       this.displayMsg('system', 'game', 'disconnected');
//     };
//     this.socket.onmessage = async (event) => {
//       const msg = JSON.parse(await event.data.text());
//       if(msg.type === GameEndEvent) {
//         this.displayMsg('player', msg.from, `scored ${msg.value.score}`);
//       } else if(msg.type === GameStartEvent) {
//         this.displayMsg('player', msg.from, `started a new game`);
//       }
//     };
//   }

//   displayMsg(cls, from, msg) {
//     const chatText = document.querySelector('#player-messages');
//     chatText.innerHTML = `<div class="event"><span class="${cls}-event">${from}</span> ${msg}</div` + chatText.innerHTML;
//   }

//   broadcastEvent(from, type, value) {
//     const event = {
//       from: from,
//       type: type,
//       value: value,
//     };
//     this.socket.send(JSON.stringify(event));
//   }