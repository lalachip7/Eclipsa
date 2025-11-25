import Phaser from 'phaser';
import { MenuScene } from './Scenes/menuScene.js';

console.log("--> Cargando configuración del juego <--");

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene],
    backgroundColor: '#a2a2ebff',
}

const game = new Phaser.Game(config);

console.log("--> Juego inicializado <--");