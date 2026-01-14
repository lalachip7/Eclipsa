import Phaser from "phaser";
import { connectionManager } from '../services/ConnectionManager';  //importamos instancia del objeto


export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Música de fondo del menú
        this.load.audio('MenuMusic', 'assets/sonido/inicio.mp3');

        // fondo del menú
        this.load.image('Pantalla_de_inicio', 'assets/fondo_pantalla_inicio.png');

        // botón de juego local
        this.load.image('LocalPlayButton', 'assets/jugar.png');
        this.load.image('LocalPlayButtonHover', 'assets/jugarHover.png');

        // botón de tutorial
        this.load.image('TutorialButton', 'assets/tutorial.png');
        this.load.image('TutorialButtonHover', 'assets/tutorialHover.png');

        // botón de créditos
        this.load.image('CreditosButton', 'assets/creditos.png');
        this.load.image('CreditosButtonHover', 'assets/creditosHover.png');

        // botón de salir de juego
        this.load.image('ExitButton', 'assets/salir.png');
        this.load.image('ExitButtonHover', 'assets/salirHover.png');

        // botón de ajustes
        this.load.image('SettingsButton', 'assets/ajustes.png');
        this.load.image('SettingsButtonHover', 'assets/ajustesHover.png');
    }
    create() {
        // Detener la música del juego si está sonando
        this.sound.stopByKey('GameMusic');

        // Reproducir música del menú
        this.sound.play('MenuMusic', { loop: true, volume: this.sound.volume });

        // Fondo del menú
        const bg = this.add.image(0, 0, 'Pantalla_de_inicio').setOrigin(0);
        bg.setDisplaySize(this.scale.width, this.scale.height);
        bg.setDepth(-1);

        let hoverImg = null;    //refrencia para la imagen hover

       // Botón de juego local
        const localBtn = this.add.image(305, 340, 'LocalPlayButton')
            .setOrigin(0.5)
            .setScale(0.75)
            .setInteractive({ useHandCursor: true });

        localBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(305, 340, 'LocalPlayButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.75)
                    .setDepth(localBtn.depth + 1);
            }
        });

        localBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        localBtn.on('pointerdown', () => {
            this.scene.launch('GameModeScene');
            //this.scene.start('GameScene');
        });

        // Botón de tutorial
        const tutorialBtn = this.add.image(312, 450, 'TutorialButton')
            .setOrigin(0.5)
            .setScale(0.75)
            .setInteractive({ useHandCursor: true });

        tutorialBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(312, 450, 'TutorialButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.75)
                    .setDepth(tutorialBtn.depth + 1);
            }
        });

        tutorialBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        tutorialBtn.on('pointerdown', () => {
            this.scene.launch('TutorialScene');
        });

        // Botón de créditos
        const creditosBtn = this.add.image(305, 560, 'CreditosButton')
            .setOrigin(0.5)
            .setScale(0.75)
            .setInteractive({ useHandCursor: true });

        creditosBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(312, 555, 'CreditosButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.75)
                    .setDepth(creditosBtn.depth + 1);
            }
        });

        creditosBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        creditosBtn.on('pointerdown', () => {
            this.scene.launch('CreditsScene');
        });

        // Botón de pantalla de ranking
        const rankingBtn = this.add.image(1300, 670, 'RankingButton') // Ajusta posición
            .setOrigin(0.5)    
            .setScale(0.75)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.launch('RankingScene'));

        // Botón de salir de juego
        const exitBtn = this.add.image(312, 670, 'ExitButton')
            .setOrigin(0.5)
            .setScale(0.75)
            .setInteractive({ useHandCursor: true });

        exitBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(312, 670, 'ExitButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.75)
                    .setDepth(exitBtn.depth + 1);
            }
        });

        exitBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        exitBtn.on('pointerdown', () => {
            // Cierra la ventana del navegador o pestaña
            window.close();
        });

        // Botón de ajustes
        const settingsBtn = this.add.image(1330, 75, 'SettingsButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        settingsBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(1335, 75, 'SettingsButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.7)
                    .setDepth(settingsBtn.depth + 1);
            }
        });

        settingsBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        settingsBtn.on('pointerdown', () => {
            this.scene.launch('SettingsScene');
        });

    // Indicador de conexión al servidor  --  comprobado conexion 
        this.connectionText = this.add.text(400, 500, 'Servidor: Comprobando...', {
            fontSize: '18px',
            color: '#ffff00',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setOrigin(0).setDepth(1000);

    // Listener para cambios de conexión  --  usuarios conectados
        this.connectionListener = (data) => {
            this.updateConnectionDisplay(data);
        };
        connectionManager.addListener(this.connectionListener);
    }

    updateConnectionDisplay(data) {
        // Solo actualizar si el texto existe (la escena está creada)
        if (!this.connectionText || !this.scene || !this.scene.isActive('MenuScene')) {
            return;
        }
        try {
            if (data.connected) {
                this.connectionText.setText(`Servidor: ${data.count} usuario(s) conectado(s)`);
                this.connectionText.setColor('#00ff00');
            } else {
                this.connectionText.setText('Servidor: Desconectado');
                this.connectionText.setColor('#ff0000');
            }
        } catch (error) {
            console.error('[MenuScene] Error updating connection display:', error);
        }
    }

    shutdown() {
        // Remover el listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }
}