import Phaser from "phaser";

export class TutorialScene extends Phaser.Scene {
    constructor() {
        super('TutorialScene');
    }

    create(){const w = this.scale.width;
        const h = this.scale.height;

        // rectángulo que cubre toda la pantalla
        this.background = this.add.rectangle(0, 0, w, h, 0x61c36f, 0.75).setOrigin(0);

        this.add.text(400, 250, 'Game Tutorial',{ 
            fontSize: '48px', fill: '#25ff12ff'}).setOrigin(0.5);

        const resumeBtn = this.add.text(400, 350, 'Resume Game', {
            color: '#25ff12ff',
        })
        .setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => resumeBtn.setColor('#ffffff'))
        .on('pointerout', () => resumeBtn.setColor('#25ff12ff'))
        .on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume(this.scene.settings.data.originalScnene);
        });
        
    }
}