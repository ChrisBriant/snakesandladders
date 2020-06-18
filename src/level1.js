import Phaser from "phaser";
import {randomNumber} from './include.js';

export default new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function Level1() {
        Phaser.Scene.call(this, { key: 'Level1' , active: false  })
    },

    preload: function () {
      this.load.rexWebFont({
        google: {
            families: ['Bangers','Gloria Hallelujah','Oswald','Londrina Solid']
          }
        });
        this.load.image('board', 'assets/board.png');
        this.load.image('items', 'assets/items.png');
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');
        this.load.atlas('dice', 'assets/dice.png', 'assets/dice.json')
    },

   create: function() {
     this.rolling = false;
     this.dieResult = 1;
     //Define the items on the screen. Snakes, ladders etc.
     this.items = [{'land':3,'end':38,'up':true},

      ];


     this.add.image(0,0,'board').setOrigin(0,0).setScale(0.5);
     this.add.image(0,0,'items').setOrigin(0,0).setScale(0.5);

      // set the boundaries of our game world
      this.physics.world.bounds.width = 1600;
      this.physics.world.bounds.height = 1200;

      this.player = this.physics.add.sprite(175,525, 'player',0);
      //this.player = this.physics.add.sprite(375,475, 'player',0);
      //this.player = this.physics.add.sprite(75,425, 'player',0);
      //TESTING
      //this.player = this.physics.add.sprite(560, 216, 'player',0);
      this.player.setCollideWorldBounds(true); // don't go out of the map
      this.player.body.setAllowGravity(false);

      // small fix to our player images, we resize the physics body object slightly
      this.player.body.setSize(this.player.width-8, this.player.height-8 );

      // player animations
      this.anims.create({
          key: 'walk',
          frames: this.anims.generateFrameNames('player', {prefix: 'player ',suffix: '.aseprite', start: 0, end: 4}),
          frameRate: 10,
          repeat: -1
      });

      this.die = this.physics.add.sprite(675,425, 'dice',0);
      this.die.body.setAllowGravity(false);

      this.anims.create({
          key: 'dice',
          frames: this.anims.generateFrameNames('dice', {prefix: 'die1 ',suffix: '.png', start: 0, end: 41}),
          frameRate: 10,
          repeat: -1
      });

      //For controlling where the die lands
      this.stopFrames = {1:0,2:7,3:14,4:21,5:28,6:35}

      /*
      this.timer = this.time.addEvent({
        delay: 1000,
        callback: function() {
          this.movePlayer(2);
        },
        callbackScope: this,
        loop: false
      });
      */
      this.cursors = this.input.keyboard.createCursorKeys();
      this.add.text(100, 100, 'i Hello ', {
          fontSize: '10px',
          fill: '#ffffff'
      });

      for(var i=1;i<101;i++) {
        var squareCoords = this.getCoordsFromSquare(i);
        console.log(squareCoords);
        this.add.text(squareCoords.x, squareCoords.y, 'i', {
            fontSize: '10px',
            fill: '#ffffff'
        });
      }


      // set bounds so the camera won't go outside the game world
      //this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);


      /*
      this.blackRectangle = this.add.graphics({ fillStyle: { color: 0x000000} }).setAlpha(0);

      // text which floats to top when points scored
      this.points = this.add.text(0, 0, '', {
          fontSize: '20px',
          fill: '#ffffff'
      });
      this.points.setScrollFactor(0);
      this.points.setVisible(false);
      */


      //Used for debugging only
      /*
      this.graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });
      //Score panel
      this.scorepanel = this.add.graphics({ fillStyle: { color: 0x000000, alpha:0.5 } });
      var scorerect = new Phaser.Geom.Rectangle(0, 0, this.map.widthInPixels,28 );
      this.scorepanel.fillRectShape(scorerect);

      // text which displays the score
      this.scoreTxt = this.add.text(0, 0, 'Score: ' +  this.score, {
          fontSize: '20px',
          fill: '#ffffff'
      });
      this.scoreTxt.setScrollFactor(0);
      //display lives
      this.livesTxt = this.add.text(300, 0, 'Lives: ' +  this.registry.values.lives, {
          fontSize: '20px',
          fill: '#ffffff'
      });
      this.livesTxt.setScrollFactor(0);

      //Centre of screen
      this.messageTxt = this.add.text(0,0, '', {
          fontFamily: 'Londrina Solid',
          fontSize: '20px',
          fill: '#ffffff',
          align: "center"
      });
      this.messageTxt.setScrollFactor(0);
      this.messageTxt.setVisible(false);
      */
  },


  update: function(time, delta) {
    if (this.cursors.space.isDown && !this.rolling) {
      this.rolling = true;
      this.die.anims.play('dice',true);
      this.diceTimer = this.time.addEvent({
        delay: 1000,
        callback: function() {
          this.rolling = false;
          this.dieResult = randomNumber(1,7);
          this.die.anims.pause(this.die.anims.currentAnim.frames[this.stopFrames[this.dieResult]]);
          this.movePlayer(this.dieResult);
          //this.die.anims.stop('dice');
        },
        callbackScope: this,
        loop: false
      });
    }
  },

  getSquare: function(x,y) {
    var ySquare = (10 - Math.floor(y / 50));
    if(ySquare % 2 == 0) {
      //Reverse x square as it is up a level
      //var xSquare = 10 % (Math.floor(x / 50)+1);
      var xSquare = (Math.floor(x / 50));
    } else {
      //forward direction
      var xSquare = 11 - (Math.floor(x / 50));

    }
    return xSquare + (ySquare * 10);
    //return ySquare;
  },

  getCoordsFromSquare: function(square) {
    var y = 575 - ((Math.floor((square-1)/10)+1) * 50);
    if(y % 100 == 25) {
      //Odd
      var x = square % 10;
      if(x == 0) {
        x = 10;
      }
      x = 25 + (x * 50);
    } else {
      //Even
      var x = square % 10;
      if(x == 0) {
        x = 10;
      }
      x = 25 + ((11-x) * 50);
    }
    //var y = 575 - ((Math.floor(square/10) + 1) * 50);
    return {x:x,y:y};
  },

  movePlayer: function(squares) {
    var player = this.player;
    var currentCoords = {x:player.x,y:player.y};

    var square = this.getSquare(player.x,player.y);
    var nextSquare = square + squares;
    console.log(square);
    var nextSquareCoords = this.getCoordsFromSquare(nextSquare);


    //var current = player.x;
    //var nextPosX = current + squares * 50;
    //this.player.setX(current + squares * 50);
    //player.moving = false;
    //Reverses the sprite depending on the level of the board
    if(nextSquareCoords.y % 100 == 75) {
      player.willFlipX = true;
    } else {
      player.willFlipX = false;
    }

    //Check if player is moving up a level
    if(nextSquareCoords.y < currentCoords.y) {
      var goingUp = true;
    }  else {
      var goingUp = false;
    }



    player.anims.play('walk',true);

    if(goingUp) {
      if(player.willFlipX) {
        var endOfBoardX = 525;
      } else {
        var endOfBoardX = 75;
      }
      //Move to the end first
      var scene = this;

      var timeline = this.tweens.createTimeline();

      timeline.add({
        targets: this.player,
        x: endOfBoardX,
        y: currentCoords.y
      });

      timeline.add({
        targets: this.player,
        x: endOfBoardX,
        y: currentCoords.y - 50,
        onComplete: function() {
          if(player.willFlipX) {
            player.flipX = true;
          } else {
            player.flipX = false;
          }
        },
      });

      timeline.add({
        targets: this.player,
        x: nextSquareCoords.x,
        y: nextSquareCoords.y,
        //y: spaces[nextMoveIdx].pixelY + 16,
        onComplete: function() {
          player.anims.stop('walk',true);
        },
      });

      timeline.play();

    } else {
      this.tweens.add({
        targets: this.player,
        x: nextSquareCoords.x,
        y: nextSquareCoords.y,
        //y: spaces[nextMoveIdx].pixelY + 16,
        onComplete: function() {
          player.anims.stop('walk',true);
        },
      });
    }

  }


});
