import Phaser from "phaser";

export class VictoryScene extends Phaser.Scene {
    constructor() {
        super('VictoryScene');
    }
    preload() {
        // No es obligatorio si los assets ya se cargaron en otra escena,
        // pero puedes descomentar y ajustar rutas si necesitas recargar:
        this.load.image('RestartButton', 'assets/reiniciar.PNG');
        this.load.image('RestartButtonHover', 'assets/reiniciarHover.PNG');
        this.load.image('ExitButton', 'assets/salir.png');
        this.load.image('ExitButtonHover', 'assets/salirHover.png');
    }

    create(data) {
        // asegurar que la escena quede encima de GameScene
        this.scene.bringToTop('VictoryScene');

        const w = this.scale.width;
        const h = this.scale.height;
        let hoverImg = null;

        // Fondo semi-transparente (depth alto para garantizar visibilidad)
        this.add.rectangle(0, 0, w, h, 0x070722, 0.8).setOrigin(0).setDepth(1000);

        // Texto de victoria encima del fondo
        this.add.text(w/2, h/2 - 120, '¡Victoria!', { fontSize: '64px', fill: '#ffffff' }).setOrigin(0.5).setDepth(1001);

        // Botón reiniciar nivel
        const restartBtn = this.add.image(w/2, h/2, 'RestartButton')
            .setOrigin(0.5)
            .setScale(0.8)
            .setInteractive({ useHandCursor: true });

        restartBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(w/2 - 12, h/2 + 10, 'RestartButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.8)
                    .setDepth(restartBtn.depth + 1);
            }
        });

        restartBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        restartBtn.on('pointerdown', () => {
            const original = data?.originalScene || 'GameScene';
            // Detener escena original y reiniciarla
            this.scene.stop(original);
            this.scene.start('GameScene');
        });

        // Botón volver al menú (opcional, usa asset ExitButton si existe)
        const exitBtn = this.add.image(w/2, h/2 + 120, 'ExitMinButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        exitBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(w/2, h/2 + 120, 'ExitMinButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.7)
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
            // Cierra la escena de juego pausada y vuelve al menú
            const original = data?.originalScene;
            if (original) this.scene.stop(original);
            this.scene.stop();
            this.scene.start('MenuScene');
        });
    }
}