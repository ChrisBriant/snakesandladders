import Phaser from "phaser";
import {randomNumber} from './include.js';

export default new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function Test() {
        Phaser.Scene.call(this, { key: 'Test' , active: false  })
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



     this.add.image(0,0,'board').setOrigin(0,0).setScale(0.5);
     this.add.image(0,0,'items').setOrigin(0,0).setScale(0.5);

this.cameras.main.setBackgroundColor('#242b24');

      //display lives
      this.livesTxt = this.add.text(300, 300, 'Lives: ', {
          fontFamily: 'Bangers',
          fontSize: '20px',
          fill: '#fcba03'
      }).setOrigin(0,0);
      this.livesTxt.setScrollFactor(0);
      this.add.text(480, 520, 'Multiplayer', { fontFamily: 'Bangers', fontSize: 25, color: '#ffffff' }).setOrigin(0,0);



  },



  update: function(time, delta) {

  },



});
