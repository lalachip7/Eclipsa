import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.add.text(400, 100, 'PONG GAME', 
            { fontSize: '64px', fill: '#b9f5daff' }).setOrigin(0.5);

        const localBtn = this.add.text(400, 300, 'Local Play',
            { fontSize: '24px', fill: '#36fb53ff' }
        ).setOrigin(0.5).setInteractive({ useHandCursor: true })
        .on('pointerover', () => localBtn.setStyle({ fill: '#ffec71ff' }))
        .on('pointerout', () => localBtn.setStyle({ fill: '#36fb53ff' }))
        .on('pointerdown', () => {
            
            this.scene.start('GameScene');
        });
    }
}    