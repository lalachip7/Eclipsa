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
import { ConnectionLostScene } from "./scenes/ConnectionLostScene.js";
import { GameModeScene } from "./scenes/GameModeScene.js";
import  LobbyScene  from "./scenes/LobbyScene.js";
import { RankingScene } from "./scenes/RankingScene.js";
import { GameLocalScene } from "./scenes/GameLocalScene.js";
import { Level2SceneLocal } from "./scenes/Level2SceneLocal.js";

import './services/ConnectionManager.js';
import './services/WebSocketService.js';

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

    scene: [ MenuScene, GameScene, GameLocalScene, Level2Scene, Level2SceneLocal, TutorialScene, CreditsScene,  PauseScene, SettingsScene, LevelSelectScene, PlaceHolderScene, VictoryScene, GameOverScene, LobbyScene, ConnectionLostScene, GameModeScene, RankingScene],
    backgroundColor: '#021410ff',
}    

document.fonts.ready.then(() => {
  const game = new Phaser.Game(config);
});

