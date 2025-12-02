import Phaser from "phaser";

import { MenuScene } from "./scenes/MenuScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { PauseScene } from "./scenes/PauseScene.js";
import { TutorialScene } from "./scenes/TutorialScene.js";
import { CreditsScene } from "./scenes/CreditsScene.js";
import { SettingsScene } from "./scenes/SettingsScene.js";
import { LevelSelectScene } from "./scenes/LevelSelectScene.js";
import { PlaceHolderScene } from "./scenes/PlaceHolderScene.js";
import { VictoryScene } from "./scenes/VictoryScene.js";
import { GameOverScene } from "./scenes/GameOverScene.js";
import { Level2Scene } from "./scenes/Level2Scene.js";



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

    scene: [ MenuScene, Level2Scene, GameScene,  TutorialScene, CreditsScene,  PauseScene, SettingsScene, LevelSelectScene, PlaceHolderScene, VictoryScene, GameOverScene],
    backgroundColor: '#021410ff',
}    

const game = new Phaser.Game(config);