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

     this.add.image(0,0,'board').setOrigin(0,0).setScale(0.5);
     this.add.image(0,0,'items').setOrigin(0,0).setScale(0.5);

      // set the boundaries of our game world
      this.physics.world.bounds.width = 1600;
      this.physics.world.bounds.height = 1200;

      this.player = this.physics.add.sprite(75,525, 'player',0);
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

      this.stopFrames = { 1: 0,2:7,3:14,4:21,5:28,6:35}

      this.timer = this.time.addEvent({
        delay: 1000,
        callback: function() {
          this.movePlayer(2);
        },
        callbackScope: this,
        loop: false
      });

      this.cursors = this.input.keyboard.createCursorKeys();

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
          //this.die.anims.stop('dice');
        },
        callbackScope: this,
        loop: false
      });
    }
  },

  movePlayer: function(squares) {
    var player = this.player;
    var current = player.x;
    var nextPosX = current + squares * 50;
    //this.player.setX(current + squares * 50);
    //player.moving = false;
    player.anims.play('walk',true);

    this.tweens.add({
      targets: this.player,
      x: nextPosX,
      //y: spaces[nextMoveIdx].pixelY + 16,
      onComplete: function() {
        player.anims.stop('walk',true);
      },
    });
  }


});
