import Phaser from "phaser";

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('CreditsBox', 'assets/caja.png');

        // Botón de salir (x)
        this.load.image('ExitMinButton', 'assets/cerrar.png');
        this.load.image('ExitMinButtonHover', 'assets/cerrarHover.png');

        // Texto de créditos
        this.load.image('CreditsText', 'assets/texto_creditos.PNG');

        // Texto de miembros
        this.load.image('MembersText', 'assets/nombres.PNG');

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
            this.scene.stop();
            this.scene.resume(this.scene.settings.data.originalScene);
        });
        
        this.add.image(700, 210, 'CreditsText')
        .setOrigin(0.5).
        setScale(1);
        
        this.add.image(710, 460, 'MembersText')
        .setOrigin(0.5)
        .setScale(0.65);

    }
}