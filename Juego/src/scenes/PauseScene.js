import Phaser from "phaser";

export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    create(){
        this.background = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);
        this.add.text(400, 250, 'Game Paused',{ 
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