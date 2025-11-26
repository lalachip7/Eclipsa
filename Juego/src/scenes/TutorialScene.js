import Phaser from "phaser";

export class TutorialScene extends Phaser.Scene {
    constructor() {
        super('TutorialScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('tutorialBox', 'assets/caja.png');

        // Imagenes de teclas
        this.load.image('keys', 'assets/teclas3.png');

        // Personajes
        this.load.image('solenneIcon', 'assets/personajeSolenne.png');
        this.load.image('niviaIcon', 'assets/personajeNivia.png');

        // Botón de salir (x)

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
            .setScale(1);

        
        this.add.image(700, 380, 'keys')
            .setOrigin(0.5)
            .setScale(1);

        this.add.image(515, 580, 'niviaIcon')
            .setOrigin(0.5)
            .setScale(0.75);

        this.add.image(885, 580, 'solenneIcon')
            .setOrigin(0.5)
            .setScale(0.75);

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
            this.scene.stop();
            this.scene.resume(this.scene.settings.data.originalScene);
        });
        
        this.add.text(700, 200, 'Tutorial',{ 
            fontSize: '48px', fill: '#d4eaf1ff'}).setOrigin(0.5);

        
    }
}