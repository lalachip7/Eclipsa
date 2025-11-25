import Phaser from "phaser";

import { MenuScene } from "./scenes/MenuScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { PauseScene } from "./scenes/PauseScene.js";

const config = {
    type: Phaser.AUTO,
    width: 1420,
    height: 800,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    scene: [MenuScene, GameScene, PauseScene],
    backgroundColor: '#021410ff',

}    

const game = new Phaser.Game(config);