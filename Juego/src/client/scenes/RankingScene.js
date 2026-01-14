import Phaser from "phaser";

export class RankingScene extends Phaser.Scene {
    constructor() {
        super('RankingScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('tutorialBox', 'assets/caja.png');

        // Botón de salir (x)
        this.load.image('ExitMinButton', 'assets/cerrar.png');
        this.load.image('ExitMinButtonHover', 'assets/cerrarHover.png');

        // Texto de ranking
        this.load.image('RankingText', 'assets/texto_ranking.png');
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        let hoverImg = null;    //refrencia para la imagen hover

        // Rectángulo que cubre toda la pantalla
        this.background = this.add.rectangle(0, 0, w, h, 0x070722, 0.9).setOrigin(0);

        // Caja de fondo
        this.add.image(700, 400, 'tutorialBox')
            .setOrigin(0.5)
            .setScale(1);

        // Título estilizado según el GDD (tipografía rúnica/clara)
        this.add.image(700, 210, 'RankingText')
            .setOrigin(0.5)
            .setScale(1);


        // Contenedor para la lista
        this.fetchRanking();

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
            this.scene.stop();
            this.scene.resume(this.scene.settings.data.originalScene);
        });
    }

    async fetchRanking() {
        try {
            // Llamada al endpoint que crearemos en userRoutes.js
            const response = await fetch('/api/users/ranking');
            const players = await response.json();

            players.forEach((player, index) => {
                const yPos = 200 + (index * 50);
                const color = index < 3 ? '#ffff00' : '#ffffff'; // Top 3 en dorado
                
                this.add.text(w * 0.3, yPos, `${index + 1}. ${player.username}`, { 
                    fontSize: '32px', fill: color 
                });
                
                // Formatear el tiempo (suponiendo que guardas milisegundos o segundos)
                this.add.text(w * 0.7, yPos, `${player.bestTime}s`, { 
                    fontSize: '32px', fill: color 
                }).setOrigin(1, 0);
            });
        } catch (error) {
            console.error("Error al obtener ranking:", error);
            this.add.text(this.scale.width / 2, 300, 'Error al conectar con el bosque...', { 
                fontSize: '24px', fill: '#ff0000' 
            }).setOrigin(0.5);
        }
    }
}