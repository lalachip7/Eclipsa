import Phaser from "phaser";

export class TutorialScene extends Phaser.Scene {
    constructor() {
        super('TutorialScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('tutorialBox', 'assets/caja.png');

        // Imagenes de teclas
        this.load.image('keys', 'assets/teclas.png');

        // Personajes
        this.load.image('solenneIcon', 'assets/personajeSolenne.png');
        this.load.image('niviaIcon', 'assets/personajeNivia.png');

        // Llaves
        this.load.spritesheet('sundrop_sheet', 'assets/items/sundrop.png', { frameWidth: 214, frameHeight: 206 });
        this.load.spritesheet('moondrop_sheet', 'assets/items/moondrop.png', { frameWidth: 214, frameHeight: 206 });

        // Trampa
        this.load.image('trampa', 'assets/trampas/lianas_plataformas.png');

        // Puertas
        this.load.image('puertaClara', 'assets/Escenario/Nivel2/puerta_clara3.png');
        this.load.image('puertaOscura', 'assets/Escenario/Nivel2/puerta_oscura1.png');
        this.load.image('portalFinal', 'assets/Escenario/Nivel1/portal1.png');

        // Boton siguiente pagina
        this.load.image('NextPageButton', 'assets/flechaDerecha.png');
        this.load.image('nextPageBtnOff', 'assets/flechaDerechaOscura.png');

        // Boton pagina anterior
        this.load.image('PrevPageButton', 'assets/flechaIzquierda.png');
        this.load.image('prevPageBtnOff', 'assets/flechaIzquierdaOscura.png');

        // Imagen tutorial
        this.load.image('imageTutorial', 'assets/pantalla_tutorial.png');

        // Botón de salir (x)
        this.load.image('ExitMinButton', 'assets/cerrar.png');
        this.load.image('ExitMinButtonHover', 'assets/cerrarHover.png');

        // Texto del tutorial
        this.load.image('TutorialText', 'assets/texto_tutorial.PNG');
    }

    create() {
        // dimensiones de la pantalla
        const w = this.scale.width;
        const h = this.scale.height;
        // asegurar que esta escena se muestre por encima al crearla
        this.scene.bringToTop();
        this.hoverImg = null;

        // variables de control de paginas
        this.currentPage = 1;
        this.newPage = true;

        // tiempo
        this.timer = 0;
        this.initTime = 0;
        this.lag = 0;

        this.crystals = this.physics.add.staticGroup();

        // Rectángulo que cubre toda la pantalla
        this.background = this.add.rectangle(0, 0, w, h, 0x070722, 0.9).setOrigin(0);

        // Caja de fondo
        this.add.image(700, 400, 'tutorialBox')
            .setOrigin(0.5)
            .setScale(1);

        // Botones de paginas desactivados
        this.prevPageBtnOff = this.add.image(620, 625, 'prevPageBtnOff').setOrigin(0.5).setScale(0.7);
        this.nextPageBtnOff = this.add.image(780, 625, 'nextPageBtnOff').setOrigin(0.5).setScale(0.7);


        // Botón de salir (x)
        this.ExitBtn = this.add.image(1069, 170, 'ExitMinButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        this.ExitBtn.on('pointerover', () => {
            if (!this.hoverImg) {
                this.hoverImg = this.add.image(1068, 170, 'ExitMinButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.7)
                    .setDepth(this.ExitBtn.depth + 1);
            }
        });

        this.ExitBtn.on('pointerout', () => {
            if (this.hoverImg) {
                this.hoverImg.destroy();
                this.hoverImg = null;
            }
        });

        // Regresar a la escena original
        this.ExitBtn.on('pointerdown', () => {
            const original = this.scene.settings.data.originalScene;
            if (original) {
                this.scene.resume(original); // reanuda PauseScene si fue la original
            }
            this.scene.stop(); // cierra TutorialScene
        });


        this.add.image(700, 210, 'TutorialText').setOrigin(0.5).setScale(1);
    }

    update(time) {
        if (this.initTime == 0) {
            this.initTime = time;
        }
        this.timer = time - this.initTime + this.lag;
        this.lag = 0;

        if (this.currentPage == 1) {
            // cargar pagina 1
            if (this.newPage == true) {
                this.keysImg = this.add.image(700, 380, 'keys')
                    .setOrigin(0.5)
                    .setScale(1);

                this.niviaImg = this.add.image(515, 580, 'niviaIcon')
                    .setOrigin(0.5)
                    .setScale(0.75);

                this.solenneImg = this.add.image(885, 580, 'solenneIcon')
                    .setOrigin(0.5)
                    .setScale(0.75);

                // Botón pagina siguiente
                {
                    this.nextPageBtn1 = this.add.image(780, 625, 'NextPageButton')
                        .setOrigin(0.5)
                        .setScale(0.7)
                        .setDepth(this.nextPageBtnOff.depth + 1)
                        .setInteractive({ useHandCursor: true });

                    this.nextPageBtn1.on('pointerdown', () => {
                        // eliminar assets pagina 1
                        this.keysImg.destroy();
                        this.niviaImg.destroy();
                        this.solenneImg.destroy();
                        this.nextPageBtn1.destroy();
                        this.hoverImg.destroy();

                        // actualizar pagina
                        this.currentPage += 1;
                        this.newPage = true;
                    });

                    this.nextPageBtn1.on('pointerover', () => {
                        if (!this.hoverImg) {
                            this.hoverImg = this.add.image(780, 625, 'NextPageButton')
                                .setOrigin(0.5)
                                .setScale(0.75)
                                .setDepth(this.nextPageBtn1.depth + 1);
                        }
                    });

                    this.nextPageBtn1.on('pointerout', () => {
                        if (this.hoverImg) {
                            this.hoverImg.destroy();
                            this.hoverImg = null;
                        }
                    });
                }
                this.newPage = false;
            }

        } else if (this.currentPage == 2) {
            if (this.newPage == true) {
                this.puertaClara = this.add.image(700, 200, 'puertaClara')
                    .setOrigin(0.5)
                    .setScale(0.6);

                this.puertaOscura = this.add.image(800, 200, 'puertaOscura')
                    .setOrigin(0.5)
                    .setScale(0.6);

                this.moonCrystal = this.crystals.create(600, 380, 'moondrop_sheet').setBodySize(32, 32).setScale(0.5);
                this.sunCrystal = this.crystals.create(815, 465, 'sundrop_sheet').setBodySize(32, 32).setScale(0.5);


                this.niviaImg = this.add.image(350, 380, 'niviaIcon')
                    .setOrigin(0.5)
                    .setScale(0.6);

                this.solenneImg = this.add.image(350, 465, 'solenneIcon')
                    .setOrigin(0.5)
                    .setScale(0.6);

                // Botón pagina siguiente
                {
                    this.nextPageBtn2 = this.add.image(780, 625, 'NextPageButton')
                        .setOrigin(0.5)
                        .setScale(0.7)
                        .setDepth(this.nextPageBtnOff.depth + 1)
                        .setInteractive({ useHandCursor: true });

                    this.nextPageBtn2.on('pointerdown', () => {
                        // eliminar assets pagina 2
                        if (this.puertaClara) { this.puertaClara.destroy(); }
                        if (this.puertaOscura) { this.puertaOscura.destroy(); }
                        if (this.moonCrystal) { this.moonCrystal.destroy(); }
                        if (this.sunCrystal) { this.sunCrystal.destroy(); }
                        if (this.niviaImg) { this.niviaImg.destroy(); }
                        if (this.solenneImg) { this.solenneImg.destroy(); }
                        if (this.puertaFinal) { this.puertaFinal.destroy(); }
                        this.prevPageBtn2.destroy();
                        this.nextPageBtn2.destroy();
                        this.hoverImg.destroy();


                        // actualizar pagina
                        this.currentPage += 1;
                        this.newPage = true;
                    });

                    this.nextPageBtn2.on('pointerover', () => {
                        if (!this.hoverImg) {
                            this.hoverImg = this.add.image(780, 625, 'NextPageButton')
                                .setOrigin(0.5)
                                .setScale(0.75)
                                .setDepth(this.nextPageBtn2.depth + 1);
                        }
                    });

                    this.nextPageBtn2.on('pointerout', () => {
                        if (this.hoverImg) {
                            this.hoverImg.destroy();
                            this.hoverImg = null;
                        }
                    });
                }
                // Botón pagina anterior
                {
                    this.prevPageBtn2 = this.add.image(620, 625, 'PrevPageButton')
                        .setOrigin(0.5)
                        .setScale(0.7)
                        .setDepth(this.prevPageBtnOff.depth + 1)
                        .setInteractive({ useHandCursor: true });

                    this.prevPageBtn2.on('pointerdown', () => {
                        // eliminar assets pagina 2
                        if (this.puertaClara) { this.puertaClara.destroy(); }
                        if (this.puertaOscura) { this.puertaOscura.destroy(); }
                        if (this.moonCrystal) { this.moonCrystal.destroy(); }
                        if (this.sunCrystal) { this.sunCrystal.destroy(); }
                        if (this.niviaImg) { this.niviaImg.destroy(); }
                        if (this.solenneImg) { this.solenneImg.destroy(); }
                        if (this.puertaFinal) { this.puertaFinal.destroy(); }
                        this.prevPageBtn2.destroy();
                        this.nextPageBtn2.destroy();
                        this.hoverImg.destroy();

                        // actualizar pagina
                        this.currentPage -= 1;
                        this.newPage = true;
                    });

                    this.prevPageBtn2.on('pointerover', () => {
                        if (!this.hoverImg) {
                            this.hoverImg = this.add.image(620, 625, 'PrevPageButton')
                                .setOrigin(0.5)
                                .setScale(0.75)
                                .setDepth(this.prevPageBtn2.depth + 1);
                        }
                    });

                    this.prevPageBtn2.on('pointerout', () => {
                        if (this.hoverImg) {
                            this.hoverImg.destroy();
                            this.hoverImg = null;
                        }
                    });
                }

                this.newPage = false;
                this.initTime = time;
            }

            {
                if (this.timer < 50) {
                    this.add.tween({
                        targets: this.niviaImg,
                        ease: 'Linear',
                        duration: 600,
                        x: 600,
                    });
                }
                if (this.timer > 600 && this.timer < 650) {
                    this.puertaOscura.destroy();
                    this.moonCrystal.destroy();
                }
                if (this.timer > 1000 && this.timer < 1050) {
                    this.add.tween({
                        targets: this.solenneImg,
                        ease: 'Linear',
                        duration: 1000,
                        x: 815,
                    });
                }
                if (this.timer > 2000 && this.timer < 2050 && !this.puertaFinal) {
                    this.puertaFinal = this.add.image(1000, 420, 'portalFinal')
                        .setOrigin(0.5)
                        .setScale(0.6);

                    this.puertaClara.destroy();
                    this.sunCrystal.destroy();
                    this.lag = 50;
                }
                if (this.timer > 2300 && this.timer < 2350) {
                    this.add.tween({
                        targets: this.niviaImg,
                        ease: 'Linear',
                        duration: 1200,
                        x: 1000,
                    });
                }
                if (this.timer > 2900 && this.timer < 2950) {
                    this.add.tween({
                        targets: this.solenneImg,
                        ease: 'Linear',
                        duration: 600,
                        x: 1000,
                    });
                }

                // reiniciar pagina 2
                if (this.timer > 3900 && this.timer < 3950) {
                    this.add.tween({
                        targets: [this.solenneImg, this.niviaImg],
                        ease: 'Linear',
                        duration: 0,
                        x: 350,
                    });

                    this.initTime = time;

                    this.puertaFinal.destroy();
                    this.puertaFinal = null;

                    this.puertaClara = this.add.image(700, 200, 'puertaClara')
                        .setOrigin(0.5)
                        .setScale(0.6);

                    this.puertaOscura = this.add.image(800, 200, 'puertaOscura')
                        .setOrigin(0.5)
                        .setScale(0.6);

                    this.moonCrystal = this.crystals.create(600, 380, 'moondrop_sheet').setBodySize(32, 32).setScale(0.5);
                    this.sunCrystal = this.crystals.create(815, 465, 'sundrop_sheet').setBodySize(32, 32).setScale(0.5);
                }
            }
        } else if (this.currentPage == 3) {
            if (this.newPage == true) {
                this.trampaImg1 = this.add.image(285, 595, 'trampa')
                    .setOrigin(0.5)
                    .setScale(0.3)
                    .setFlipY(true);

                this.trampaImg2 = this.add.image(1030, 290, 'trampa')
                    .setOrigin(0.5)
                    .setScale(0.3)
                    .setAngle(90);

                this.niviaImg = this.add.image(340, 330, 'niviaIcon')
                    .setOrigin(0.5)
                    .setScale(0.6);

                this.solenneImg = this.add.image(1060, 615, 'solenneIcon')
                    .setOrigin(0.5)
                    .setScale(0.6);

                // Botón pagina anterior
                {
                    this.prevPageBtn3 = this.add.image(620, 625, 'PrevPageButton')
                        .setOrigin(0.5)
                        .setScale(0.7)
                        .setDepth(this.prevPageBtnOff.depth + 1)
                        .setInteractive({ useHandCursor: true });

                    this.prevPageBtn3.on('pointerdown', () => {
                        // eliminar assets pagina 3
                        this.trampaImg1.destroy();
                        this.trampaImg2.destroy();
                        this.niviaImg.destroy();
                        this.solenneImg.destroy();
                        this.prevPageBtn3.destroy();
                        this.hoverImg.destroy();


                        // actualizar pagina
                        this.currentPage -= 1;
                        this.newPage = true;
                    });

                    this.prevPageBtn3.on('pointerover', () => {
                        if (!this.hoverImg) {
                            this.hoverImg = this.add.image(620, 625, 'PrevPageButton')
                                .setOrigin(0.5)
                                .setScale(0.75)
                                .setDepth(this.prevPageBtn3.depth + 1);
                        }
                    });

                    this.prevPageBtn3.on('pointerout', () => {
                        if (this.hoverImg) {
                            this.hoverImg.destroy();
                            this.hoverImg = null;
                        }
                    });
                }

                // Botón pagina siguiente
                {
                    this.nextPageBtn3 = this.add.image(780, 625, 'NextPageButton')
                        .setOrigin(0.5)
                        .setScale(0.7)
                        .setDepth(this.nextPageBtnOff.depth + 1)
                        .setInteractive({ useHandCursor: true });

                    this.nextPageBtn3.on('pointerdown', () => {
                        // eliminar assets pagina 3
                        this.trampaImg1.destroy();
                        this.trampaImg2.destroy();
                        this.niviaImg.destroy();
                        this.solenneImg.destroy();
                        this.hoverImg.destroy();
                        this.prevPageBtn3.destroy();
                        this.nextPageBtn3.destroy();

                        // actualizar pagina
                        this.currentPage += 1;
                        this.newPage = true;
                    });

                    this.nextPageBtn3.on('pointerover', () => {
                        if (!this.hoverImg) {
                            this.hoverImg = this.add.image(780, 625, 'NextPageButton')
                                .setOrigin(0.5)
                                .setScale(0.75)
                                .setDepth(this.nextPageBtn3.depth + 1);
                        }
                    });

                    this.nextPageBtn3.on('pointerout', () => {
                        if (this.hoverImg) {
                            this.hoverImg.destroy();
                            this.hoverImg = null;
                        }
                    });
                }

                this.newPage = false;
                this.initTime = time;
            }

            {
                if (this.timer < 150) {
                    this.add.tween({
                        targets: this.niviaImg,
                        ease: 'Linear',
                        duration: 800,
                        y: 615,
                    });
                    this.add.tween({
                        targets: this.solenneImg,
                        ease: 'Linear',
                        duration: 800,
                        y: 460,
                        x: 700,
                    });
                }
                if (this.timer > 950 && this.timer < 1000) {
                    if (this.solenneImg != null && this.niviaImg != null) {
                        this.solenneImg.destroy();
                        this.niviaImg.destroy();
                        this.niviaImg = null;
                        this.solenneImg = null;
                    }
                    this.niviaImg = this.add.image(340, 330, 'niviaIcon')
                        .setOrigin(0.5)
                        .setScale(0.6);

                    this.solenneImg = this.add.image(1060, 615, 'solenneIcon')
                        .setOrigin(0.5)
                        .setScale(0.6);
                    this.lag = 50;
                }
                if (this.timer > 1400 && this.timer < 1450) {
                    this.add.tween({
                        targets: this.niviaImg,
                        ease: 'Linear',
                        duration: 800,
                        y: 526,
                        x: 634,
                    });
                    this.add.tween({
                        targets: this.solenneImg,
                        ease: 'Linear',
                        duration: 800,
                        y: 340,
                    });
                }
                if (this.timer > 2250 && this.timer < 2300) {
                    if (this.solenneImg != null && this.niviaImg != null) {
                        this.solenneImg.destroy();
                        this.niviaImg.destroy();
                        this.niviaImg = null;
                        this.solenneImg = null;
                    }
                    this.niviaImg = this.add.image(340, 330, 'niviaIcon')
                        .setOrigin(0.5)
                        .setScale(0.6);

                    this.solenneImg = this.add.image(1060, 615, 'solenneIcon')
                        .setOrigin(0.5)
                        .setScale(0.6);
                }
                if (this.timer > 3000 && this.timer < 3200) {
                    this.initTime = time;
                }

            }
        } else if (this.currentPage == 4) {
            if (this.newPage == true) {
                // assets pagina 4
                this.imageTutorial = this.add.image(690, 400, 'imageTutorial')
                    .setOrigin(0.5)
                    .setScale(0.7)
                this.ExitBtn.setDepth(this.imageTutorial.depth + 1);
                this.prevPageBtnOff.setDepth(this.imageTutorial.depth + 1);
                this.nextPageBtnOff.setDepth(this.imageTutorial.depth + 1);

                // Botón pagina anterior

                {
                    this.prevPageBtn4 = this.add.image(620, 625, 'PrevPageButton')
                        .setOrigin(0.5)
                        .setScale(0.7)
                        .setDepth(this.prevPageBtnOff.depth + 1)
                        .setInteractive({ useHandCursor: true });

                    this.prevPageBtn4.on('pointerdown', () => {
                        // eliminar assets pagina 4
                        this.imageTutorial.destroy();
                        this.prevPageBtn4.destroy();
                        this.hoverImg.destroy();


                        // actualizar pagina
                        this.currentPage -= 1;
                        this.newPage = true;
                    });

                    this.prevPageBtn4.on('pointerover', () => {
                        if (!this.hoverImg) {
                            this.hoverImg = this.add.image(620, 625, 'PrevPageButton')
                                .setOrigin(0.5)
                                .setScale(0.75)
                                .setDepth(this.prevPageBtn4.depth + 1);
                        }
                    });

                    this.prevPageBtn4.on('pointerout', () => {
                        if (this.hoverImg) {
                            this.hoverImg.destroy();
                            this.hoverImg = null;
                        }
                    });
                }
                this.newPage = false;
            }
        }

    }
}