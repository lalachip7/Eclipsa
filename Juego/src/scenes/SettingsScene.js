import Phaser from "phaser";

export class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    preload() {
        // Caja de fondo
        this.load.image('settingsBox', 'assets/caja.png');

        // Boton Volumen (+/-)
        this.load.image('PlusVolumeButton', 'assets/ajustes.png');
        this.load.image('PlusVolumeHover', 'assets/ajustesHover.png');
        this.load.image('MinusVolumeButton', 'assets/ajustes.png');
        this.load.image('MinusVolumeHover', 'assets/ajustesHover.png');

        // Barras Volumen (rectangulos uno oscuro/apagados y otro claro/encendidos)
        this.load.image('VolumeBarOff', 'assets/ajustes.png');
        this.load.image('VolumeBarOn', 'assets/ajustesHover.png');
        

        // Botón de salir (x)
        this.load.image('ExitMinButton', 'assets/cerrar.png');
        this.load.image('ExitMinButtonHover', 'assets/cerrarHover.png');

    }
    create(){
        // dimensiones de la pantalla
        const w = this.scale.width;
        const h = this.scale.height;

        // Volumen
        
        //let volume = this.scene.sound.volume;
        let volume = 60;
        //if(volume > 100) volume = 100;
		//else if(volume < 0) volume = 0;

        let hoverImg = null;    //refrencia para la imagen hover
        let volumeBar1, volumeBar2, volumeBar3, volumeBar4, volumeBar5;

        // Rectángulo que cubre toda la pantalla
        this.background = this.add.rectangle(0, 0, w, h, 0x070722, 0.9).setOrigin(0);

        // Caja de fondo
        this.add.image(700, 400, 'settingsBox')
            .setOrigin(0.5)
            .setScale(1);

        // Texto Volumen
        this.volumeText = this.add.text(700, 300, volume,{ 
            fontSize: '48px', fill: '#d4eaf1ff'}).setOrigin(0.5);
        // Barras de volumen fondo
        this.add.image(433, 500, 'VolumeBarOff')
            .setOrigin(0.5)
            .setScale(1);
        this.add.image(566, 500, 'VolumeBarOff')
            .setOrigin(0.5)
            .setScale(1);
        this.add.image(700, 500, 'VolumeBarOff')
            .setOrigin(0.5)
            .setScale(1);
        this.add.image(833, 500, 'VolumeBarOff')
            .setOrigin(0.5)
            .setScale(1);
        this.add.image(966, 500, 'VolumeBarOff')
            .setOrigin(0.5)
            .setScale(1);

        // Barras de volumen activas 
        volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
        volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
        volumeBar3 = this.add.image(700, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
        volumeBar4 = this.add.image(833, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
        volumeBar5 = this.add.image(966, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
        

        // Actualizar barras de volumen 
        volumeBar1.destroy();
        volumeBar2.destroy();
        volumeBar3.destroy();
        volumeBar4.destroy();
        volumeBar5.destroy();
        if(volume == 0 && volumeBar1 != null){
            volumeBar1.destroy();
        }else if(volume <= 20){
            volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
        }else if(volume <= 40){
            volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
        }else if(volume <= 60){
            volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar3 = this.add.image(700, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
        }else if(volume <= 80){
            volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar3 = this.add.image(700, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar4 = this.add.image(833, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
        }else if(volume == 100){
            volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar3 = this.add.image(700, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar4 = this.add.image(833, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar5 = this.add.image(966, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
        }
        
        // Boton volumen aumentado
        const plusVolumeBtn = this.add.image(1100, 500, 'PlusVolumeButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });
        
        plusVolumeBtn.on('pointerdown', () => {
            volume += 20;
            if(volume > 100) volume = 100;
		    else if(volume < 0) volume = 0;

            //this.scene.sound.setVolume(volume);
		    this.volumeText.destroy();
            this.volumeText = this.add.text(700, 300, volume,{ 
            fontSize: '48px', fill: '#d4eaf1ff'}).setOrigin(0.5);

            //updateVolumeBars(volume);
            volumeBar1.destroy();
            volumeBar2.destroy();
            volumeBar3.destroy();
            volumeBar4.destroy();
            volumeBar5.destroy();
            if(volume == 0 && volumeBar1 != null){
                volumeBar1.destroy();
            }else if(volume <= 20){
                volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
            }else if(volume <= 40){
                volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
            }else if(volume <= 60){
                volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar3 = this.add.image(700, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
            }else if(volume <= 80){
                volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar3 = this.add.image(700, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar4 = this.add.image(833, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
            }else if(volume == 100){
                volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar3 = this.add.image(700, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar4 = this.add.image(833, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar5 = this.add.image(966, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
            }
        });

        // Boton volumen disminuido
        const minusVolumeBtn = this.add.image(300, 500, 'MinusVolumeButton')
            .setOrigin(0.5)
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        minusVolumeBtn.on('pointerdown', () => {
		    volume -= 20;
            if(volume > 100) volume = 100;
		    else if(volume < 0) volume = 0;

            //this.scene.sound.setVolume(volume);
            this.volumeText.destroy();
		    this.volumeText = this.add.text(700, 300, volume,{ 
            fontSize: '48px', fill: '#d4eaf1ff'}).setOrigin(0.5);

            //updateVolumeBars(volume);
            volumeBar1.destroy();
            volumeBar2.destroy();
            volumeBar3.destroy();
            volumeBar4.destroy();
            volumeBar5.destroy();
            if(volume == 0 && volumeBar1 != null){
                volumeBar1.destroy();
            }else if(volume <= 20){
                volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
            }else if(volume <= 40){
                volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
            }else if(volume <= 60){
                volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar3 = this.add.image(700, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
            }else if(volume <= 80){
                volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar3 = this.add.image(700, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar4 = this.add.image(833, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
            }else if(volume == 100){
                volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar3 = this.add.image(700, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar4 = this.add.image(833, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
                volumeBar5 = this.add.image(966, 500, 'VolumeBarOn')
                .setOrigin(0.5)
                .setScale(1);
            }
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
                this.scene.resume(original); // reanuda PauseScene si fue la original
            }
            this.scene.stop(); // cierra TutorialScene
        });
        
        this.add.text(700, 200, 'Ajustes',{ 
            fontSize: '48px', fill: '#d4eaf1ff'}).setOrigin(0.5);

        
    }
    // Actualizar los sprites de volumen
    /*
    updateVolumeBars(volume){
        volumeBar1.destroy();
        volumeBar2.destroy();
        volumeBar3.destroy();
        volumeBar4.destroy();
        volumeBar5.destroy();
        if(volume <= 0.2){
            volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
        }else if(volume <= 0.4){
            volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
        }else if(volume <= 0.6){
            volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar3 = this.add.image(700, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
        }else if(volume <= 0.8){
            volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar3 = this.add.image(700, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar4 = this.add.image(833, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
        }else if(volume == 1){
            volumeBar1 = this.add.image(433, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar2 = this.add.image(566, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar3 = this.add.image(700, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar4 = this.add.image(833, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
            volumeBar5 = this.add.image(966, 500, 'VolumeBarOn')
            .setOrigin(0.5)
            .setScale(1);
        }
    }*/
}