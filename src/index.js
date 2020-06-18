import Phaser from "phaser";
import Level1 from "./level1.js";
//import Test from "./test.js"
import Title from "./title.js";
import WebfontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin.js';
import RoundRectanglePlugin from 'phaser3-rex-plugins/plugins/roundrectangle-plugin.js';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "parent",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
        }
    },
    plugins: {
      global: [{
          key: 'rexRoundRectanglePlugin',
          plugin: RoundRectanglePlugin,
          start: true
      },
      {
        key: 'rexWebfontLoader',
        plugin: WebfontLoaderPlugin,
        start: true
      },]
    },
    scene: [Level1]
    //scene: [Multiplayer,Title]
}

var game = new Phaser.Game(config);
