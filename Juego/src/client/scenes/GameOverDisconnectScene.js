import Phaser from "phaser";
import { wsService } from "../services/WebSocketService";

export class GameOverDisconnectScene extends Phaser.Scene {
    constructor() {
        super('GameOverDisconnectScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('CreditsBox', 'assets/caja.png');
        // Texto Game Over (imagen de DERROTA)
        this.load.image('GameOverText', 'assets/texto_derrota.png');
        
        // Botón de ir al lobby
        this.load.image('LobbyButton', 'assets/lobby.png');
        this.load.image('LobbyButtonHover', 'assets/lobbyHover.png');
        
        // Botón de volver al menú principal
        this.load.image('RetMenuButton', 'assets/menu.PNG');
        this.load.image('RetMenuButtonHover', 'assets/menuHover.PNG');
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;
        let hoverImg = null;

        // Fondo oscuro
        this.background = this.add.rectangle(0, 0, w, h, 0x070722, 0.9).setOrigin(0);

        // Caja de fondo
        this.add.image(700, 400, 'CreditsBox')
            .setOrigin(0.5)
            .setScale(1);

        // Imagen de DERROTA
        this.add.image(700, 240, 'GameOverText')
            .setOrigin(0.5)
            .setScale(1);

        // Subtítulo: "Derrota por desconexión"
        this.add.text(700, 320, 'Derrota por desconexión', {
            fontSize: '24px',
            color: '#ff6666',
            fontFamily: 'Caudex',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);

        // Botón volver al Lobby
        const lobbybtn = this.add.image(705, 415, 'LobbyButton')
            .setOrigin(0.5)
            .setScale(0.6)
            .setInteractive({ useHandCursor: true });

        lobbybtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(705, 415, 'LobbyButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.6)
                    .setDepth(lobbybtn.depth + 1);
            }
        });

        lobbybtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        lobbybtn.on('pointerdown', () => {
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

        // Botón volver al Menú Principal
        const menubtn = this.add.image(700, 515, 'RetMenuButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        menubtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(698, 515, 'RetMenuButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.7)
                    .setDepth(menubtn.depth + 1);
            }
        });

        menubtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        menubtn.on('pointerdown', () => {
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