var gameBoard, player, enemy, laser, laser2;
enemy = [];
var spacegif = "https://drive.google.com/uc?export=view&id=1FDjHGnhbkVbZVJiMHw14bboDWE55Bzd4";
var shipgif = "https://drive.google.com/uc?export=view&id=1iWsWodmzV96liCBX2l-iDbmifpV-Z42W";
var shipmovegif = "https://drive.google.com/uc?export=view&id=1p_tgCNAlcCokNIcZrLlFQRiCIiqg8AOw";
var enemygif = "https://drive.google.com/uc?export=view&id=1XqwqIYJ8AnERVeP5LJMyDZt0k7rF9LVM";
var lasergif = "https://drive.google.com/uc?export=view&id=1R2WsLspVy0XtVVd2YMQcp4r3AvU-bOvN";


function GameArea(can) {
    
    this.canvas = can;
    this.context = this.canvas.getContext("2d");
    
    this.start = function() {
        this.interval = setInterval(updateGameArea, 20);
    };
    
    this.clear = function() {
        var image = new Image();
        image.src = "https://drive.google.com/uc?export=view&id=1FDjHGnhbkVbZVJiMHw14bboDWE55Bzd4";
        this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    };
    
    this.stop = function() {
        clearInterval(this.interval);
        alert("Game Over!");
    };
}

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
    
    this.changeAddX = function(num) {
        this.addX += num;
    };
    
    this.changeAddY = function(num) {
        this.addY += num;
    };
    
    this.draw = function() {
        this.context.fillStyle = this.color;
        if (this.yesno === 'n') {
            if ((this.begx > 565) || (this.begx < 0)) {
                this.addX *= -1;
            }
        }
        this.begx += this.addX;
        this.begy += this.addY;
        
        var image = new Image();
        image.src = this.color;
        this.context.drawImage(image, this.begx, this.begy, this.width, this.height);
    };
    
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
    gameBoard = new GameArea(document.getElementById("myCanvas"));
    player = new GamePiece(265, 550, 35, 35, shipgif, gameBoard.context, 'n');
    player.draw();
    for (var i = 0; i < 7; i++) {
        var y = Math.floor(Math.random() * (-580) - 600);
        var x = Math.floor(Math.random() * (440));
        enemy[i] = new GamePiece(x, y, 35, 35, "enemy.gif", gameBoard.context, 'y');
        enemy[i].changeAddY(1);
        enemy[i].draw;
    }
    laser = new GamePiece(-10, -10, 2, 10, "laser.gif", gameBoard.context, 'y');
    laser2 = new GamePiece(-10, -10, 2, 10, "laser.gif", gameBoard.context, 'y');
    gameBoard.start();
}

function updateGameArea() {
    gameBoard.clear();
    for (var i = 0; i < 7; i++) {
        if (enemy[i].begy > 600) {
            enemy[i].begy = Math.floor(Math.random() * (-580) - 20);
            enemy[i].begx = Math.floor(Math.random() * (565));
            enemy[i].addY++;
        }
        enemy[i].draw();
        if (player.crashWith(enemy[i])) {
            gameBoard.stop();
        } else if (laser.crashWith(enemy[i])) {
            enemy[i].begy = Math.floor(Math.random() * (-580) - 20);
            enemy[i].begx = Math.floor(Math.random() * (565));
            enemy[i].addY++;
            laser.begx = -10;
        } else if (laser2.crashWith(enemy[i])) {
            enemy[i].begy = Math.floor(Math.random() * (-580) - 20);
            enemy[i].begx = Math.floor(Math.random() * (565));
            enemy[i].addY++;
            laser2.begx = -10;
        }
    }
    player.draw();
    laser.draw();
    laser2.draw();
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
    player.color = shipmovegif;
    console.log(player.begx);
    if (player.begx < 0) {
        player.begx = 0;
    } else if (player.begx > 565) {
        player.begx = 565;
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

function main2() {
    document.addEventListener("keydown", action);
    document.addEventListener("keyup", actionUp);
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
                lasers();
            } else if (event.key === 'w') {
                lasers2();
            }
        }
    }
    main2();
}

function actionUp(event) {
    if (event.key === 'a' || 'd') {
        player.color = spacegif;
    }
    main2();
}