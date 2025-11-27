import Phaser from "phaser";

export class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super('LevelSelectScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('GeneralBox', 'assets/caja.png');

        // Boton de niveles
        this.load.image('SettingsButton', 'assets/ajustes.png');
        this.load.image('SettingsButtonHover', 'assets/ajustesHover.png');

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
        this.add.image(700, 400, 'GeneralBox')
            .setOrigin(0.5)
            .setScale(1.1);

        // Selección de Niveles
            //Nivel 1
        const LvlUnoBtn = this.add.image(400, 500, 'SettingsButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        LvlUnoBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(400, 500, 'SettingsButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.75)
                    .setDepth(LvlUnoBtn.depth + 1);
            }
        });

        LvlUnoBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        // Inicio Nivel 1
        LvlUnoBtn.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        //Placeholder
        const LvlDosBtn = this.add.image(800, 500, 'SettingsButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        LvlDosBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(800, 500, 'SettingsButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.75)
                    .setDepth(LvlDosBtn.depth + 1);
            }
        });

        LvlDosBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        // Placeholder lvl
        LvlDosBtn.on('pointerdown', () => {
            this.scene.start('PlaceHolderScene');
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
        
        this.add.text(700, 180, 'Selecciona un Nivel',{ 
            fontSize: '48px', fill: '#d4eaf1ff'}).setOrigin(0.5);

        
    }
}