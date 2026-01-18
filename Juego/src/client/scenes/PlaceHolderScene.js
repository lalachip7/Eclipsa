import Phaser from "phaser";

export class PlaceHolderScene extends Phaser.Scene {
    constructor() {
        super('PlaceHolderScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('tutorialBox', 'assets/caja.png');

        // Botón de salir (x)
        this.load.image('ExitButton', 'assets/salir.png');
        this.load.image('ExitButtonHover', 'assets/salirHover.png');

    }
    create() {
        // dimensiones de la pantalla
        const w = this.scale.width;
        const h = this.scale.height;

        let hoverImg = null;

        // Rectángulo que cubre toda la pantalla
        this.background = this.add.rectangle(0, 0, w, h, 0x070722, 0.9).setOrigin(0);

        // Caja de fondo
        this.add.image(700, 400, 'tutorialBox')
            .setOrigin(0.5)
            .setScale(1);

        // Botón de salir (x)
        const exitBtn = this.add.image(700, 670, 'ExitButton')
            .setOrigin(0.5)
            .setScale(0.75)
            .setInteractive({ useHandCursor: true });

        exitBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(700, 670, 'ExitButtonHover')
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
            this.scene.start('MenuScene');
        });

        this.add.text(700, 180, 'Nada que ver aqui', {
            fontSize: '48px', fill: '#d4eaf1ff'
        }).setOrigin(0.5);


    }
}