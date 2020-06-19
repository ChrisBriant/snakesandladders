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
        this.load.image('panel', 'assets/panel.png');
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');
        this.load.atlas('dice', 'assets/dice.png', 'assets/dice.json')
    },

   create: function() {
     this.running = false;
     this.gameOver = false;
     this.rolling = false;
     this.dieResult = 1;
     //Define the items on the screen. Snakes, ladders etc.
     this.items = [{'land':3,'end':38,'up':true},
        {'land':6,'end':26,'up':true},
        {'land':28,'end':46,'up':true},
        {'land':30,'end':91,'up':true},
        {'land':34,'end':4,'up':false},
        {'land':58,'end':36,'up':false},
        {'land':64,'end':8,'up':false},
        {'land':61,'end':81,'up':true},
        {'land':83,'end':65,'up':false},
        {'land':75,'end':85,'up':true},
        {'land':89,'end':49,'up':false},
        {'land':99,'end':21,'up':false}
      ];

     this.add.image(0,0,'board').setOrigin(0,0).setScale(0.5);
     this.add.image(0,0,'items').setOrigin(0,0).setScale(0.5);

     //Add the square numbers
     for(var i=1;i<101;i++) {
       var squareCoords = this.getCoordsFromSquare(i);
       this.add.text(squareCoords.x, squareCoords.y, i, {
           fontSize: '15px',
           fill: '#ffffff',
           stroke: '#000000',
           strokeThickness: 1
       }).setOrigin(0,0);
     }

      // set the boundaries of our game world
      this.physics.world.bounds.width = 1600;
      this.physics.world.bounds.height = 1200;

      this.player = this.physics.add.sprite(75,525, 'player',0);
      //TESTING
      //this.player = this.physics.add.sprite(525,75, 'player',0);
      //this.player = this.physics.add.sprite(375,475, 'player',0);
      //this.player = this.physics.add.sprite(75,425, 'player',0);
      this.player.rolling = true; //Control when dice is rolled
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

      this.cursors = this.input.keyboard.createCursorKeys();

      this.blackRectangle = this.add.graphics({ fillStyle: { color: 0x000000} }).setAlpha(0);
      this.messageContainer = this.add.container(0,0);

      var startMsg = ["Every day is a huge challenge for an autistic person. Just like a game of Snakes and Ladders" +
        ", there are ups and downs.", "This game demonstrates how a typical day can be for us. To play simply press space " +
        "to roll the die, each snake or ladder will describe a random aspect of autistic life, positive if it is a ladder and "+
        "negative if you land on a snake."]
      this.messageScreen("Snakes and Ladders",startMsg,"Press Space to Start");

  },


  update: function(time, delta) {
    if(this.running) {
      if (this.cursors.space.isDown && !this.player.rolling) {
        this.player.rolling = true;
        this.die.anims.play('dice',true);
        this.diceTimer = this.time.addEvent({
          delay: 1000,
          callback: function() {
            this.dieResult = randomNumber(1,7);
            this.die.anims.pause(this.die.anims.currentAnim.frames[this.stopFrames[this.dieResult]]);
            this.movePlayer(this.dieResult);
          },
          callbackScope: this,
          loop: false
        });
      }
    } else {
      //Triggers starting of game
      if (this.cursors.space.isDown) {
        if(this.gameOver) {
          this.scene.restart();
        }
        this.running = true;
        //Delay rolling
        this.time.addEvent({
          delay: 500,
          callback: function() {
            this.player.rolling = false; //Allow dice rolls
          },
          callbackScope: this,
          loop: false
        })
        this.player.setVisible(true);
        this.blackRectangle.setVisible(false);
        this.messageContainer.destroy();
        this.messageContainer = this.add.container(0,0);

        //Set up the in game text
        this.setGamePanel();
      }
    }
  },

  getSquare: function(x,y) {
    var ySquare = (10 - Math.floor(y / 50));
    if(ySquare % 2 == 0) {
      //Reverse x square as it is up a level
      var xSquare = (Math.floor(x / 50));
    } else {
      //forward direction
      var xSquare = 11 - (Math.floor(x / 50));

    }
    return xSquare + (ySquare * 10);
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
    return {x:x,y:y};
  },

  movePlayer: function(squares) {
    var player = this.player;
    var currentCoords = {x:player.x,y:player.y};
    var scene = this;
    var square = this.getSquare(player.x,player.y);
    var nextSquare = square + squares;
    this.squareText.setText(nextSquare);
    if(nextSquare >= 100) {
      //Move player to end of board and play end message
      this.tweens.add({
        targets: this.player,
        x: 75,
        y: 75,
        onComplete: function() {
          player.anims.stop('walk',true);
          scene.gamePanelContainer.destroy(); // remove the side text
          var endMsg = ["Well done! You have managed to get through a day in the life of an autistic person.",
            "This is how difficult it can be, sometimes good things happen, sometimes bad."];
          scene.messageScreen("Congratulations!",endMsg,"Press Space to Start Over");
          scene.gameOver = true;
          scene.running = false;
        },
      });
    } else {
      console.log(square);
      var nextSquareCoords = this.getCoordsFromSquare(nextSquare);

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
          onComplete: function() {
            player.anims.stop('walk',true);
            scene.checkSquare(nextSquare);
          },
        });

        timeline.play();

      } else {
        this.tweens.add({
          targets: this.player,
          x: nextSquareCoords.x,
          y: nextSquareCoords.y,
          onComplete: function() {
            player.anims.stop('walk',true);
            scene.checkSquare(nextSquare);
          },
        });
      }
    }
  },

  checkSquare: function(square) {
    var item = this.items.filter(i => i.land == square);
    var player = this.player;

    if(item.length > 0) {
      var destination = this.getCoordsFromSquare(item[0].end);
      this.squareText.setText(item[0].end);
      player.anims.play('walk',true);

      this.tweens.add({
        targets: this.player,
        x: destination.x,
        y: destination.y,
        onComplete: function() {
          if(destination.y % 100 == 75) {
            player.flipX = true; //Odd
          } else {
            player.flipX = false; //Even level
          }
          player.anims.stop('walk',true);
        },
      });
    }
    this.player.rolling = false;
  },

  messageScreen: function(title,text, message) {
    //Set up the welcome screen
    var coverScreen = new Phaser.Geom.Rectangle(0, 0, 800,600 );
    this.blackRectangle.setAlpha(0.5).fillRectShape(coverScreen);
    this.blackRectangle.setVisible(true);
    this.player.setVisible(false);
    var panel = this.add.image(400,300,'panel').setOrigin(0.5,0.5).setScale(0.5);
    this.messageContainer.add(panel);

    var titleText = this.add.text(400, 100, title, {
        fontSize: '20px',
        fill: '#ffffff',
        wordWrap: { width: 450, useAdvancedWrap: true }
    }).setOrigin(0.5,0);

    this.messageContainer.add(titleText);

    var txtOffset = 150;
    for(var i=0;i<text.length;i++) {
      var scrText = this.add.text(400, txtOffset, text[i], {
          fontSize: '20px',
          fill: '#ffffff',
          wordWrap: { width: 450, useAdvancedWrap: true }
      }).setOrigin(0.5,0);

      console.log(scrText.height);
      txtOffset += scrText.height + 20;
      console.log(txtOffset);
      this.messageContainer.add(scrText);
    }

    var flashText = this.add.text(400, txtOffset+20, message, {
        fontSize: '20px',
        fill: '#ffffff',
        wordWrap: { width: 450, useAdvancedWrap: true }
    }).setOrigin(0.5,0);

    this.messageContainer.add(flashText);
    this.messageContainer.setVisible(true);

    var blinkOn=true;
    this.timer = this.time.addEvent({
      delay: 500,
      callback: function() {
        if(blinkOn) {
          flashText.setVisible(false);
          blinkOn = false;
        } else {
          flashText.setVisible(true);
          blinkOn = true;
        }
      },
      callbackScope: this,
      loop: true
    });

  },

  setGamePanel: function() {
    this.gamePanelContainer = this.add.container(0,0);
    var squareWord = this.add.text(675, 75, "SQUARE", {
        fontSize: '20px',
        fill: '#ffffff',
        wordWrap: { width: 450, useAdvancedWrap: true }
    }).setOrigin(0.5,0)
    this.squareText = this.add.text(675, 125, "1", {
        fontSize: '20px',
        fill: '#ffffff',
        wordWrap: { width: 450, useAdvancedWrap: true }
    }).setOrigin(0.5,0);
    var flashText = this.add.text(675, 275, "PRESS SPACE TO ROLL", {
        fontSize: '20px',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: 100, useAdvancedWrap: true }
    }).setOrigin(0.5,0)
    this.gamePanelContainer.add(squareWord);
    this.gamePanelContainer.add(this.squareText);
    this.gamePanelContainer.add(flashText);

    var blinkOn=true;
    this.timer = this.time.addEvent({
      delay: 500,
      callback: function() {
        if(blinkOn) {
          flashText.setVisible(false);
          blinkOn = false;
        } else {
          flashText.setVisible(true);
          blinkOn = true;
        }
      },
      callbackScope: this,
      loop: true
    });
  }


});
