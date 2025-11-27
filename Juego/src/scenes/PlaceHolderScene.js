import Phaser from "phaser";

export class PlaceHolderScene extends Phaser.Scene {
    constructor() {
        super('PlaceHolderScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('tutorialBox', 'assets/caja.png');
        
        // Botón de salir (x)
        this.load.image('SettingsButton', 'assets/ajustes.png');
        this.load.image('SettingsButtonHover', 'assets/ajustesHover.png');
        
    }
    create(){
        // dimensiones de la pantalla
        const w = this.scale.width;
        const h = this.scale.height;

        let hoverImg = null;    //refrencia para la imagen hover

        // Rectángulo que cubre toda la pantalla
        this.background = this.add.rectangle(0, 0, w, h, 0x070722, 0.9).setOrigin(0);

        // Caja de fondo
        this.add.image(700, 400, 'tutorialBox')
            .setOrigin(0.5)
            .setScale(1.4);

        // Botón de salir (x)
        const returnBtn = this.add.image(1069, 170, 'SettingsButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        returnBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(1075, 175, 'SettingsButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.75)
                    .setDepth(returnBtn.depth + 1);
            }
        });

        returnBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        // Regresar a la escena original
        returnBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
        
        this.add.text(700, 180, 'Nada que ver aqui',{ 
            fontSize: '48px', fill: '#d4eaf1ff'}).setOrigin(0.5);

        
    }
}