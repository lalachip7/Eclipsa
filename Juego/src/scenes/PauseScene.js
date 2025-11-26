import Phaser from "phaser";

export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('CreditsBox', 'assets/caja.png');

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
            this.scene.stop();
            this.scene.resume(this.scene.settings.data.originalScene);
        });
    }
}