import Phaser from "phaser";

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('CreditsBox', 'assets/caja.png');

        // Texto Game Over
        this.load.image('GameOverText', 'assets/texto_derrota.png');


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

        // Texto game over
        this.add.image(700, 240, 'GameOverText')
            .setOrigin(0.5)
            .setScale(1);


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
        const menubtn = this.add.image(700, 515, 'RetMenuButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        menubtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(698, 515, 'RetMenuButtonHover')
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