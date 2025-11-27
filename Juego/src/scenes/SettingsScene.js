import Phaser from "phaser";

export class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('settingsBox', 'assets/caja.png');

        // Boton Volumen (+/-)
        this.load.image('SettingsButton', 'assets/ajustes.png');
        this.load.image('SettingsButtonHover', 'assets/ajustesHover.png');

        // Barras Volumen (rectangulos uno oscuro/apagados y otro claro/encendidos)

        // Botón de salir (x)
        this.load.image('ExitMinButton', 'assets/cerrar.png');
        this.load.image('ExitMinButtonHover', 'assets/cerrarHover.png');

    }
    create(){
        // dimensiones de la pantalla
        const w = this.scale.width;
        const h = this.scale.height;

        let hoverImg = null;    //refrencia para la imagen hover

        // Rectángulo que cubre toda la pantalla
        this.background = this.add.rectangle(0, 0, w, h, 0x070722, 0.9).setOrigin(0);

        // Caja de fondo
        this.add.image(700, 400, 'settingsBox')
            .setOrigin(0.5)
            .setScale(1);

        // Volumen aumentado
        const plusVolumeBtn = this.add.image(400, 500, 'SettingsButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });
        
        plusVolumeBtn.on('pointerdown', () => {
            //if volume < 1, volume +=0.2
        });

        // Volumen disminuido
        const minusVolumeBtn = this.add.image(1000, 500, 'SettingsButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        minusVolumeBtn.on('pointerdown', () => {
            //if volume > 0, volume -=0.2
        });

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
        
        this.add.text(700, 200, 'Ajustes',{ 
            fontSize: '48px', fill: '#d4eaf1ff'}).setOrigin(0.5);

        
    }
}