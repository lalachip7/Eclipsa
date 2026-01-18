import Phaser from "phaser";
import { wsService } from "../services/WebSocketService";

export class PlayerDisconnectedScene extends Phaser.Scene {
    constructor() {
        super('PlayerDisconnectedScene');
    }

    preload() {
        this.load.image('CreditsBox', 'assets/caja.png');
        this.load.image('RetMenuButton', 'assets/menu.PNG');
        this.load.image('RetMenuButtonHover', 'assets/menuHover.PNG');
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        let hoverImg = null;

        // Fondo oscuro
        this.background = this.add.rectangle(0, 0, w, h, 0x070722, 0.9).setOrigin(0);

        // Caja central
        this.add.image(700, 400, 'CreditsBox').setOrigin(0.5).setScale(1);

        // Icono y título
        this.add.text(700, 220, 'Warning', { fontSize: '64px' }).setOrigin(0.5);

        this.add.text(700, 300, 'JUGADOR DESCONECTADO', {
            fontSize: '36px',
            color: '#ff6666',
            fontStyle: 'bold',
            fontFamily: 'Caudex'
        }).setOrigin(0.5);

        this.add.text(700, 350, 'El otro jugador abandonó la partida', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Caudex'
        }).setOrigin(0.5);

        // Botón VOLVER AL LOBBY
        const lobbyBtn = this.add.text(700, 440, 'Volver al Lobby', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#4a90e2',
            padding: { x: 20, y: 10 },
            fontFamily: 'Caudex'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        lobbyBtn.on('pointerover', () => {
            lobbyBtn.setStyle({ backgroundColor: '#357abd' });
        });

        lobbyBtn.on('pointerout', () => {
            lobbyBtn.setStyle({ backgroundColor: '#4a90e2' });
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

        // Botón MENÚ PRINCIPAL
        const menuBtn = this.add.image(700, 540, 'RetMenuButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        menuBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(698, 540, 'RetMenuButtonHover')
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