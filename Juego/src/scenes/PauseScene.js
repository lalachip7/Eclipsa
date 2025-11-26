import Phaser from "phaser";

export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('CreditsBox', 'assets/caja.png');

        // Botón de salir (x)

        // Botón de tutorial
        this.load.image('TutorialButton', 'assets/tutorial.png');
        this.load.image('TutorialButtonHover', 'assets/tutorialHover.png');

    }
    create(){
        // dimensiones de la pantalla
        const w = this.scale.width;
        const h = this.scale.height;

        let hoverImg = null;    //referencia para la imagen hover

        // Rectángulo que cubre toda la pantalla
        this.background = this.add.rectangle(0, 0, w, h, 0x070722, 0.9).setOrigin(0);

        // Caja de fondo
        this.add.image(700, 400, 'CreditsBox')
            .setOrigin(0.5)
            .setScale(1);

        // Botón de salir (x)
        const settingsBtn = this.add.image(1069, 170, 'SettingsButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        settingsBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(1075, 175, 'SettingsButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.75)
                    .setDepth(settingsBtn.depth + 1);
            }
        });

        settingsBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        // Regresar a la escena original
        settingsBtn.on('pointerdown', () => {
            const original = this.scene.settings.data.originalScene;
            if (original) this.scene.resume(original); // reanuda primero la escena original
            this.scene.stop(); // luego detiene PauseScene
        });


        // Tutorial 
        const tutorialbtn = this.add.image(700, 250, 'TutorialButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        tutorialbtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(700, 250, 'TutorialButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.75)
                    .setDepth(tutorialbtn.depth + 1);
            }
        });

        tutorialbtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        // Ir a la escena de tutorial
        tutorialbtn.on('pointerdown', () => {
            // lanzar TutorialScene y pausar PauseScene para poder reanudarla después
            this.scene.launch('TutorialScene', { originalScene: 'PauseScene' });
            this.scene.pause();
        });


        this.add.text(700, 350, 'Reiniciar nivel', { //cambiar por botón
            fontSize: '32px', fill: '#ffffff'
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => {
            const originalSceneKey = this.scene.settings.data.originalScene;
            this.scene.stop(originalSceneKey);
            this.scene.start('GameScene');
        });

        this.add.text(700, 450, 'Volver al menú principal', {
            fontSize: '32px', fill: '#ffffff'
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => {
            const originalSceneKey = this.scene.settings.data.originalScene;
            this.scene.stop(originalSceneKey);
            this.scene.start('MenuScene');
            this.scene.stop();
        });

    }
}