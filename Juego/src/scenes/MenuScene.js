import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
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
            this.scene.start('GameScene');
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
    }
}