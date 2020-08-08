//for the canvas the square box
var myGamePiece;
//for the obstacle an array
var myObstacles = [];
//for the score
var myScore;
//for the sound
var mySound;
//for the background music
var myMusic;

function startGame() {
    myGamePiece = new component(30, 30,"#C30C09", 10, 120);
    myScore = new component("20px", "Consolas", "black", 200, 40, "text"); //for the score
    mySound = new sound("gameover.mp3");//for the game over sound
    myMusic = new sound("gametheme.mp3");
    myMusic.play(); //for the background music
    
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
      this.canvas.width = 350;
      this.canvas.height = 300;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.frameNo = 0; //for multiple obstacles
      this.interval = setInterval(updateGameArea, 20);
      window.addEventListener('mousedown', function (e) {
        myGameArea.x = e.pageX;
        myGameArea.y = e.pageY;
      })
      window.addEventListener('mouseup', function (e) {
        myGameArea.x = false;
        myGameArea.y = false;
      })
      window.addEventListener('touchstart', function (e) {
        myGameArea.x = e.pageX;
        myGameArea.y = e.pageY;
      })
      window.addEventListener('touchend', function (e) {
        myGameArea.x = false;
        myGameArea.y = false;
      })
    },
    clear : function(){
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
      } //when you hit the obstacle game over
  }
  function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
  } //for multiple obstacles

//for the square the speed and for it to change with the click of the buttons
function component(width, height, color, x, y, type) {
    this.type = type; //for the score
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
      ctx = myGameArea.context;
      if (this.type == "text") {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y); //for the score
      } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
    this.newPos = function() {
      this.x += this.speedX;
      this.y += this.speedY;
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
          crash = false;
        }
        return crash;
      } //for when you hit the obstacle game over
  }
 
  

//for the canvas to clear 50 times every second and the position
    function updateGameArea() {
    var x, y;
    for (i = 0; i < myObstacles.length; i += 1) {
      if (myGamePiece.crashWith(myObstacles[i])) {
        mySound.play(); //to play gameover sound when it crashes
        myMusic.stop();
        myGameArea.stop();
        return;
      }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(30, height, "#2F1847", x, 0));
        myObstacles.push(new component(30, x - height - gap, "#2F1847", x, height + gap));
      } //for obstacles of random sizes
    for (i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].x += -1;
      myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update(); //for the score
    myGamePiece.newPos();
    myGamePiece.update();
  }

  

//for the actions when the button is clicked
function moveup() {
    myGamePiece.speedY -= 1;
  }
  
  function movedown() {
    myGamePiece.speedY += 1;
  }
  
  function moveleft() {
    myGamePiece.speedX -= 1;
  }
  
  function moveright() {
    myGamePiece.speedX += 1;
  }
  //for the square to stop moving when the button is released
  function stopMove() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
  }

  //for the sound
  function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }
