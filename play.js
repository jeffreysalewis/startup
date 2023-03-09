var gameBoard, player, enemy, laser, laser2;
enemy = [];

function GameArea(can) {
    
    this.canvas = can;
    this.context = this.canvas.getContext("2d");
    
    this.start = function() {
        this.interval = setInterval(updateGameArea, 20);
    };
    
    this.clear = function() {
        var image = new Image();
        image.src = "Space.gif";
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
    player = new GamePiece(265, 550, 35, 35, "ship.gif", gameBoard.context, 'n');
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