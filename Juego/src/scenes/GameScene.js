import Phaser from "phaser";
import { Paddle } from "../entities/Paddle.js";

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init() {
        this.players = new Map();
        this.inputsMapping = [];
        this.ball = null;
        this.isPaused = false;
        this.escWasDown = false;
    }

    create() {

        for (let i = 0; i < 17; i++) {
            this.add.rectangle(400, i * 50 + 25, 10, 30, 0xffffff);
        }

        // score texts
        this.leftScore = this.add.text(120, 50, '0', {
            fontSize: '32px', fill: '#b9f5daff'
        });
        
        this.rightScore = this.add.text(680, 50, '0', {
            fontSize: '32px', fill: '#b9f5daff'
        });

        this.createBounds();
        this.createBall();
        this.launchBall();
        this.setUpPlayers();

        this.players.forEach(player => {
            this.physics.add.collider(this.ball, player.sprite);
        });

        this.physics.add.overlap(this.ball, this.leftGoal, this.scoreRightGoal, null, this);
        this.physics.add.overlap(this.ball, this.rightGoal, this.scoreLeftGoal, null, this);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    setUpPlayers() {
        const leftPaddle = new Paddle(this, 'player1', 50, 300);
        const rightPaddle = new Paddle(this, 'player2', 750, 300);

        this.players.set('player1', leftPaddle);
        this.players.set('player2', rightPaddle);

        const InputConfig = [
            {
                playerId: 'player1',
                upKey: 'W',
                downKey: 'S',
            },
            {
                playerId: 'player2',
                upKey: 'UP',
                downKey: 'DOWN', 
            }
        ];
        this.inputsMapping = InputConfig;
        this.inputsMapping = this.inputsMapping.map(config => {
            return ({
                playerId: config.playerId,
                upKeyObj: this.input.keyboard.addKey(config.upKey),
                downKeyObj: this.input.keyboard.addKey(config.downKey),
            });
        });
    }

    scoreRightGoal() {
        const player2 = this.players.get('player2');
        player2.score += 1;
        this.rightScore.setText(player2.score.toString());

        if (player2.score >= 2) {
            this.endgame('player2');
        }
        else{
            this.resetBall();
        }
        
    }

    scoreLeftGoal() {
        const player1 = this.players.get('player1');
        player1.score += 1;
        this.leftScore.setText(player1.score.toString());

        if (player1.score >= 2) {
            this.endgame('player1');
        }
        else{
            this.resetBall();
        }
    }

    resetBall() {
        this.ball.setPosition(400, 300);
        this.ball.setVelocity(0, 0);
        this.time.delayedCall(1000, () => {
            this.launchBall();
        });
    }

    createBounds() {
        this.leftGoal = this.physics.add.sprite(0, 300, null);
        this.leftGoal.setDisplaySize(10, 600);
        this.leftGoal.setSize(10, 600);
        this.leftGoal.setImmovable(false);
        this.leftGoal.setVisible(false);

        this.rightGoal = this.physics.add.sprite(800, 300, null);
        this.rightGoal.setDisplaySize(10, 600);
        this.rightGoal.setSize(10, 600);
        this.rightGoal.setImmovable(false);
        this.rightGoal.setVisible(false);
    }

    createBall() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('ball', 16, 16);
        graphics.destroy();

        this.ball = this.physics.add.image(400, 300, 'ball');
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);
    }

    launchBall() {
        const angle = Phaser.Math.Between(-30, 30);
        const speed = 500;
        const direction = Math.random() < 0.5 ? 1 : -1;
        
        this.ball.setVelocity(
            Math.cos(Phaser.Math.DegToRad(angle)) * speed * direction,
            Math.sin(Phaser.Math.DegToRad(angle)) * speed
        )
    }
        
    setPausedState(isPaused) {
        this.isPaused = isPaused;
        if (this.isPaused) {
            this.scene.launch('PauseScene', {originalScene: this.scene.key});
            this.scene.pause();
        }
    }

    resume() {
        this.isPaused = false;
    }

    togglePause() {
        const newPausedState = !this.isPaused;
        this.setPausedState(newPausedState);
    }

    update(){

        if(this.escKey.isDown){
            this.togglePause();
        }

        this.inputsMapping.forEach(mapping => {
        const paddle = this.players.get(mapping.playerId);

            if (mapping.upKeyObj.isDown) {
               paddle.sprite.setVelocityY(-paddle.baseSpeed);
            } else if (mapping.downKeyObj.isDown) {
               paddle.sprite.setVelocityY(+paddle.baseSpeed);
            } else {
               paddle.sprite.setVelocityY(0);
            }

        });   
    }

    endgame(winnerId) {
        this.ball.setVelocity(0, 0);
        this.players.forEach(paddle => {
            paddle.sprite.setVelocity(0, 0);
        });
        this.physics.pause();

        const winnerText = winnerId === 'player1' ? 'Left Player Wins!' : 'Right Player Wins!';
        
        this.add.text(400, 250, winnerText,{
            fontSize: '48px', fill: '#25ff12ff'}).setOrigin(0.5);
       
        const menuBtn = this.add.text(400, 350, 'Return to Menu', {
            color: '#25ff12ff', fontSize: '32px'
        })
        .setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => menuBtn.setColor('#ffffff'))
        .on('pointerout', () => menuBtn.setColor('#25ff12ff'))
        .on('pointerdown', () => {
            this.scene.start('MenuScene')
        });
    }
}