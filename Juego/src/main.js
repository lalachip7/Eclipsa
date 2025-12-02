import Phaser from "phaser";

import { MenuScene } from "./scenes/MenuScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { PauseScene } from "./scenes/PauseScene.js";
import { TutorialScene } from "./scenes/TutorialScene.js";
import { CreditsScene } from "./scenes/CreditsScene.js";
import { SettingsScene } from "./scenes/SettingsScene.js";
import { LevelSelectScene } from "./scenes/LevelSelectScene.js";
import { PlaceHolderScene } from "./scenes/PlaceHolderScene.js";



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

    scene: [GameScene, MenuScene, TutorialScene, CreditsScene,  PauseScene, SettingsScene, LevelSelectScene, PlaceHolderScene],
    backgroundColor: '#021410ff',

}    

const game = new Phaser.Game(config);