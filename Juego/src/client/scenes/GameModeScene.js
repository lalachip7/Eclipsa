// despues de hacer click en "Jugar" - seleccion de modo local u online
import Phaser from "phaser";

export class GameModeScene extends Phaser.Scene {
    constructor() {
        super('GameModeScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('tutorialBox', 'assets/caja.png');
        
        // Botón de salir (x)
        this.load.image('ExitButton', 'assets/salir.png');
        this.load.image('ExitButtonHover', 'assets/salirHover.png');

        // Botón de jugar en local
        this.load.image('LocalButton', 'assets/jugarLocal.png');
        this.load.image('LocalButtonHover', 'assets/jugarLocalHover.png');

        // Botón de jugar en online
        this.load.image('OnlineButton', 'assets/jugarOnline.png');
        this.load.image('OnlineButtonHover', 'assets/jugarOnlineHover.png');
    }
    create(){
        // dimensiones de la pantalla
        const w = this.scale.width;
        const h = this.scale.height;

        let hoverImg = null;    //refrencia para la imagen hover

        // Rectángulo que cubre toda la pantalla
        this.background = this.add.rectangle(0, 0, w, h, 0x070722, 0.9).setOrigin(0);

        // Caja de fondo
        this.add.image(700, 400, 'tutorialBox')
            .setOrigin(0.5)
            .setScale(1);

        // Botón de salir (x)
        const exitBtn = this.add.image(700, 670, 'ExitButton')
            .setOrigin(0.5)
            .setScale(0.75)
            .setInteractive({ useHandCursor: true });

        exitBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(700, 670, 'ExitButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.75)
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
            // Cierra la ventana del navegador o pestaña
            this.scene.start('MenuScene');
        });
        
        this.add.text(700, 180, 'Modo de juego',{ 
            fontSize: '48px', fill: '#d4eaf1ff'}).setOrigin(0.5);

            
       // Botón de juego local
        const localBtn = this.add.image(305, 340, 'LocalButton')
            .setOrigin(0.5)
            .setScale(0.75)
            .setInteractive({ useHandCursor: true });

        localBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(305, 340, 'LocalButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.75)
                    .setDepth(localBtn.depth + 1);
            }
        });

        localBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        localBtn.on('pointerdown', () => {
            this.scene.launch('LevelSelectScene');
            this.scene.stop(); // cierra la escena de seleccion de modo de juego
        });
        
        // Botón de Juego Online
        const onlineBtn = this.add.image(1095, 340, 'OnlineButton')
            .setOrigin(0.5)
            .setScale(0.75)
            .setInteractive({ useHandCursor: true });

        onlineBtn.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(1095, 340, 'OnlineButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.75)
                    .setDepth(onlineBtn.depth + 1);
            }
        });

        onlineBtn.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        onlineBtn.on('pointerdown', () => {
            console.log("👉 Botón Online pulsado"); // <--- MIRA LA CONSOLA

            const user = this.registry.get('user');
            console.log("👤 Usuario en registro:", user); // <--- ¿SALE NULL O ALGO?

            if (user) {
                console.log("✅ Usuario encontrado, voy al Lobby");
                this.scene.start('LobbyScene');
            } else {
                console.log("❌ No hay usuario, voy a AuthScene");
                this.scene.start('AuthScene', { destination: 'LobbyScene' });
            }
        });
    }
}