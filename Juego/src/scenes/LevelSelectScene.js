import Phaser from "phaser";

export class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super('LevelSelectScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('LevelBox', 'assets/caja.png');

        // Texto Niveles
        this.load.image('LevelsText', 'assets/texto_niveles.png');

        // Boton de niveles
        // nivel 1
        this.load.image('Level1Button', 'assets/nivel1.png');
        this.load.image('Level1ButtonHover', 'assets/nivel1Hover.png');

        // nivel 2
        this.load.image('Level2Button', 'assets/Nivel2.png');
        this.load.image('Level2ButtonHover', 'assets/Nivel2Hover.png');

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
        this.add.image(700, 400, 'LevelBox')
            .setOrigin(0.5)
            .setScale(1);

        // Texto Niveles
        this.add.image(700, 210, 'LevelsText')
            .setOrigin(0.5)
            .setScale(1);

        // Selección de Niveles
            //Nivel 1
        const LvlUnoBtn = this.add.image(510, 500, 'Level1Button')
            .setOrigin(0.5)
            .setScale(1)
            .setInteractive({ useHandCursor: true });

        LvlUnoBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(520, 505, 'Level1ButtonHover')
                    .setOrigin(0.5)
                    .setScale(1)
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
            this.scene.stop('MenuScene');
            this.scene.start('GameScene');
        });

        //Placeholder
        const LvlDosBtn = this.add.image(880, 500, 'Level2Button')
            .setOrigin(0.5)
            .setScale(1)
            .setInteractive({ useHandCursor: true });

        LvlDosBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(880, 500, 'Level2ButtonHover')
                    .setOrigin(0.5)
                    .setScale(1.05)
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
            this.scene.stop('MenuScene');
            this.scene.start('Level2Scene');
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
                this.scene.resume(original); 
            }
            this.scene.stop(); 
        });
        
    }
}