// src/client/scenes/PlayerDisconnectedScene.js
import Phaser from "phaser";
import { wsService } from "../services/WebSocketService";

export class PlayerDisconnectedScene extends Phaser.Scene {
    constructor() {
        super('PlayerDisconnectedScene');
    }

    preload() {
        this.load.image('tutorialBox', 'assets/caja.png');
        this.load.image('RetMenuButton', 'assets/menu.PNG');
        this.load.image('RetMenuButtonHover', 'assets/menuHover.PNG');

        // Imágenes específicas de esta escena
        this.load.image('texto_jugadorDesconectado', 'assets/texto_jugadorDesconectado.png');
        this.load.image('LobbyButton', 'assets/lobby.png');
        this.load.image('LobbyButtonHover', 'assets/lobbyHover.png');
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        let hoverImg = null;

        // Fondo oscuro
        this.background = this.add.rectangle(0, 0, w, h, 0x070722, 0.9).setOrigin(0);

        // Caja de piedra
        this.add.image(700, 400, 'tutorialBox').setOrigin(0.5).setScale(1);

        // Imagen del título (en lugar de texto)
        this.add.image(700, 260, 'texto_jugadorDesconectado')
            .setOrigin(0.5)
            .setScale(0.8)

        // Subtítulo
        this.add.text(700, 330, 'El otro jugador abandonó la partida', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Caudex'
        }).setOrigin(0.5);

        // Botón volver al lobby 
        const lobbyBtn = this.add.image(700, 420, 'LobbyButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        lobbyBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(700, 420, 'LobbyButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.7)
                    .setDepth(lobbyBtn.depth + 1);
            }
        });

        lobbyBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        lobbyBtn.on('pointerdown', () => {
            wsService.disconnect();
            this.sound.stopAll();

            const scenes = this.game.scene.keys;
            for (let key in scenes) {
                if (key !== 'LobbyScene') {
                    this.scene.stop(key);
                }
            }
            this.scene.stop();
            this.scene.start('LobbyScene');
        });

        // Botón menú principal
        const menuBtn = this.add.image(700, 520, 'RetMenuButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        menuBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(698, 520, 'RetMenuButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.7)
                    .setDepth(menuBtn.depth + 1);
            }
        });

        menuBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        menuBtn.on('pointerdown', () => {
            wsService.disconnect();
            this.sound.stopAll();

            const scenes = this.game.scene.keys;
            for (let key in scenes) {
                if (key !== 'MenuScene') {
                    this.scene.stop(key);
                }
            }
            this.scene.stop();
            this.scene.start('MenuScene');
        });
    }
}