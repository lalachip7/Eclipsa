import Phaser from "phaser";

export class TutorialScene extends Phaser.Scene {
    constructor() {
        super('TutorialScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('tutorialBox', 'assets/caja.png');

        // Imagen tutorial
        this.load.image('imageTutorial', 'assets/pantalla_tutorial.png');

        // Botón de salir (x)
        this.load.image('ExitMinButton', 'assets/cerrar.png');
        this.load.image('ExitMinButtonHover', 'assets/cerrarHover.png');

        // Texto del tutorial
        this.load.image('TutorialText', 'assets/texto_tutorial.PNG');
    }
    create(){
        // dimensiones de la pantalla
        const w = this.scale.width;
        const h = this.scale.height;
        // asegurar que esta escena se muestre por encima al crearla
        this.scene.bringToTop();
        let hoverImg = null;    //refrencia para la imagen hover

        // Rectángulo que cubre toda la pantalla
        this.background = this.add.rectangle(0, 0, w, h, 0x070722, 0.9).setOrigin(0);

        // Caja de fondo
        this.add.image(700, 400, 'tutorialBox')
            .setOrigin(0.5)
            .setScale(1);


        this.add.image(700, 400, 'imageTutorial')
            .setOrigin(0.5)
            .setScale(0.7);

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
            if (original) {
                this.scene.resume(original); // reanuda PauseScene si fue la original
            }
            this.scene.stop(); // cierra TutorialScene
        });
        
        //this.add.image(700, 210, 'TutorialText').setOrigin(0.5).setScale(1);

        
    }
}