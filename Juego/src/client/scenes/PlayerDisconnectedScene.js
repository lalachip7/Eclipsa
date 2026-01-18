import Phaser from "phaser";
import { wsService } from "../services/WebSocketService";

export class PlayerDisconnectedScene extends Phaser.Scene {
    constructor() {
        super('PlayerDisconnectedScene');
    }

    preload() {
        this.load.image('tutorialBox', 'assets/caja.png');
        this.load.image('ExitButton', 'assets/cancelar.png');
        this.load.image('ExitButtonHover', 'assets/cancelarHover.png');
        this.load.image('RetMenuButton', 'assets/menu.PNG');
        this.load.image('RetMenuButtonHover', 'assets/menuHover.PNG');

        this.load.image('texto_abandonarPartida', 'assets/texto_abandonarPartida.png');
        this.load.image('siSalir', 'assets/siSalir.png');
        this.load.image('siSalirHover', 'assets/siSalirHover.png');
        this.load.image('cancelar', 'assets/cancelar.png');
        this.load.image('cancelarHover', 'assets/cancelarHover.png');
        
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

        // Título (sin "Warning")
        this.add.text(700, 260, 'JUGADOR DESCONECTADO', {
            fontSize: '36px',
            color: '#ff6666',
            fontStyle: 'bold',
            fontFamily: 'Caudex'
        }).setOrigin(0.5);

        this.add.text(700, 320, 'El otro jugador abandonó la partida', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Caudex'
        }).setOrigin(0.5);

        // Botón VOLVER AL LOBBY (con tus assets o usando ExitButton)
        const lobbyBtn = this.add.image(700, 420, 'ExitButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        this.add.text(700, 420, 'VOLVER AL LOBBY', {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Caudex',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(1);

        lobbyBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(700, 420, 'ExitButtonHover')
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

        // Botón MENÚ PRINCIPAL
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