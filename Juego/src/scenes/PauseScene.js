import Phaser from "phaser";

export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('CreditsBox', 'assets/caja.png');

        // Texto Pausa
        this.load.image('PauseText', 'assets/texto_pausa.PNG');

        // Botón de salir (x)
        this.load.image('ExitMinButton', 'assets/cerrar.png');
        this.load.image('ExitMinButtonHover', 'assets/cerrarHover.png');

        // Botón de tutorial
        this.load.image('TutorialButton', 'assets/tutorial.png');
        this.load.image('TutorialButtonHover', 'assets/tutorialHover.png');

        // Botón de reiniciar nivel
        this.load.image('RestartButton', 'assets/reiniciar.PNG');
        this.load.image('RestartButtonHover', 'assets/reiniciarHover.PNG');
        
        // Botón de volver al menú principal
        this.load.image('RetMenuButton', 'assets/menu.PNG');
        this.load.image('RetMenuButtonHover', 'assets/menuHover.PNG');

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

        // Texto Pausa
        this.add.image(700, 210, 'PauseText')
            .setOrigin(0.5)
            .setScale(1);

        // Botón de salir (x)
        const ExitBtn = this.add.image(1069, 170, 'ExitMinButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        ExitBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(1068, 170, 'ExitMinButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.7)
                    .setDepth(ExitBtn.depth + 1);
            }
        });

        ExitBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        // Regresar a la escena original
        ExitBtn.on('pointerdown', () => {
            const original = this.scene.settings.data.originalScene;
            if (original) this.scene.resume(original); // reanuda primero la escena original
            this.scene.stop(); // luego detiene PauseScene
        });


        // Tutorial 
        const tutorialbtn = this.add.image(700, 320, 'TutorialButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        tutorialbtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(700, 320, 'TutorialButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.7)
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

        // Reiniciar nivel
        const restartbtn = this.add.image(705, 415, 'RestartButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        restartbtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(693, 425, 'RestartButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.7)
                    .setDepth(restartbtn.depth + 1);
            }
        });

        restartbtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        restartbtn.on('pointerdown', () => {
            const originalSceneKey = this.scene.settings.data.originalScene;
            this.scene.stop(originalSceneKey);
            this.scene.start('GameScene');
        });

        // Volver al menú principal
        const menubtn = this.add.image(700, 520, 'RetMenuButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        menubtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(698, 520, 'RetMenuButtonHover')
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
            const originalSceneKey = this.scene.settings.data.originalScene;
            this.scene.stop(originalSceneKey);
            this.scene.start('MenuScene');
            this.scene.stop();
        });
    }
}