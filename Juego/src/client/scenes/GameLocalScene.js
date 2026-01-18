import Phaser from "phaser";

export class GameLocalScene extends Phaser.Scene {
    constructor() {
        super('GameLocalScene');
    }

    init() {
        this.isPaused = false;
        this.escWasDown = false;

        this.niviaHasMoonCrystal = false;
        this.solenneHasSunCrystal = false;
        this.niviaOnPortal = false;
        this.solenneOnPortal = false;

        this.isNiviaWalking = null;
        this.isSolenneWalking = null;
    }

    preload() {
        // Carga de los personajes
        this.load.atlas('nivia', 'assets/nivia/nivia_sheet.png', 'assets/nivia/nivia_sheet.json');
        this.load.atlas('solenne', 'assets/solenne/solenne_sheet.png', 'assets/solenne/solenne_sheet.json');

        // Carga de los cristales
        this.load.spritesheet('sundrop_sheet', 'assets/items/sundrop.png', { frameWidth: 214, frameHeight: 206 });
        this.load.spritesheet('moondrop_sheet', 'assets/items/moondrop.png', { frameWidth: 214, frameHeight: 206 });

        this.load.spritesheet('sun_sheet', 'assets/items/sun.png', { frameWidth: 347, frameHeight: 329 });
        this.load.spritesheet('moon_sheet', 'assets/items/moon.png', { frameWidth: 347, frameHeight: 329 });

        // Carga del fondo
        this.load.image('fondo', 'assets/Escenario/Nivel1/fondo_abajo.png');
        this.load.image('plataformas', 'assets/Escenario/Nivel1/plataformas_abajo.png');

        // Carga de los elementos del escenario

        this.load.image('puertaClaraNivel1', 'assets/Escenario/Nivel1/puerta_clara.png');
        this.load.image('puertaOscuraNivel1', 'assets/Escenario/Nivel1/puerta_oscura.png');

        this.load.image('puertaClara1Nivel2', 'assets/Escenario/Nivel2/puerta_clara1.png');
        this.load.image('puertaClara2Nivel2', 'assets/Escenario/Nivel2/puerta_clara2.png');
        this.load.image('puertaClara3Nivel2', 'assets/Escenario/Nivel2/puerta_clara3.png');
        this.load.image('puertaOscura1Nivel2', 'assets/Escenario/Nivel2/puerta_oscura1.png');
        this.load.image('puertaOscura2Nivel2', 'assets/Escenario/Nivel2/puerta_oscura2.png');

        this.load.image('botonClaroNivel1', 'assets/Escenario/Nivel1/boton_claro.png');
        this.load.image('botonOscuro1Nivel1', 'assets/Escenario/Nivel1/boton_oscuro.png');

        this.load.image('botonNivel2', 'assets/Escenario/Nivel2/boton.png');
        this.load.image('botonClaroNivel2', 'assets/Escenario/Nivel2/boton_claro.png');
        this.load.image('botonOscuro1Nivel2', 'assets/Escenario/Nivel2/boton_oscuro1.png');
        this.load.image('botonOscuro2Nivel2', 'assets/Escenario/Nivel2/boton_oscuro2.png');

        this.load.image('portal', 'assets/trampas/puertaFinal.png');

        // Carga de los botones
        this.load.image('PauseButton', 'assets/pausa.png');
        this.load.image('PauseButtonHover', 'assets/pausaHover.png');

        this.load.image('SettingsButton', 'assets/ajustes.png');
        this.load.image('SettingsButtonHover', 'assets/ajustesHover.png');

        // Botón de reiniciar nivel
        this.load.image('RestartButton', 'assets/reiniciar.PNG');
        this.load.image('RestartButtonHover', 'assets/reiniciarHover.PNG');

        //Daño
        this.load.image('damage', 'assets/trampas/lianas_plataformas.png')

        // Efectos de sonido y música de fondo
        this.load.audio('walkSound', 'assets/sonido/caminar.mp3');
        this.load.audio('collectSunCrystalSound', 'assets/sonido/cristalClaro.mp3');
        this.load.audio('collectMoonCrystalSound', 'assets/sonido/cristalOscuro.mp3');

        // Música del juego
        this.load.audio('GameMusic', 'assets/sonido/juego.mp3'); 
    }

    create() {
        const mapWidthInPixels = 1420;
        const mapHeightInPixels = 800;

        let hoverImg = null;

        // Detener solo la música del menú si está sonando
        this.sound.stopByKey('MenuMusic');

        // Reproducir la música del juego
        if (this.cache.audio.exists('GameMusic')) {
            this.sound.play('GameMusic', { loop: true, volume: 0.1});
        }

        const bg = this.physics.add.staticSprite(0, 0, 'fondo').setOrigin(0, 0);
        bg.setDisplaySize(mapWidthInPixels, mapHeightInPixels);

        const plataforma = this.physics.add.staticSprite(0, 0, 'plataformas').setOrigin(0, 0);
        plataforma.setDisplaySize(mapWidthInPixels, mapHeightInPixels);

        // Configuración de la física del mundo
        this.physics.world.gravity.y = 1500;

        // Creación de los personajes
        this.setUpPlayers();


        // Suelo simple para que puedan saltar y caer
        this.ground = this.add.rectangle(0, mapHeightInPixels, mapWidthInPixels, 10, 0x00FF00, 0).setOrigin(0, 0);
        this.physics.add.existing(this.ground, true); 

        //Creación de las plataformas
        this.plataforma1 = this.add.rectangle(200, 480, 300, 20, 0x322b1d, 0).setOrigin(0.5, 0.5);
        this.physics.add.existing(this.plataforma1, true);

        this.plataforma2 = this.add.rectangle(575, 480, 150, 20, 0x322b1d, 0).setOrigin(0.5, 0.5);
        this.physics.add.existing(this.plataforma2, true);

        this.plataforma3 = this.add.rectangle(1000, 550, 400, 20, 0x322b1d, 0).setOrigin(0.5, 0.5);
        this.physics.add.existing(this.plataforma3, true);

        this.plataforma4 = this.add.rectangle(300, 150, 200, 20, 0x322b1d, 0).setOrigin(0.5, 0.5);
        this.physics.add.existing(this.plataforma4, true);

        this.plataforma5 = this.add.rectangle(875, 275, 150, 20, 0x322b1d, 0).setOrigin(0.5, 0.5);
        this.physics.add.existing(this.plataforma5, true);


        this.pared1 = this.add.rectangle(400, 50, 20, 200, 0x322b1d, 0).setOrigin(0.5, 0.5);
        this.physics.add.existing(this.pared1, true);

        this.pared2 = this.add.rectangle(900, 700, 200, 300, 0x322b1d, 0).setOrigin(0.5, 0.5);
        this.physics.add.existing(this.pared2, true);

        this.exitPortal = this.physics.add.staticSprite(1000, 10, 'portal').setScale(1);
        this.exitPortal.setVisible(false);
        this.physics.add.existing(this.exitPortal, true);
        this.exitPortal.body.enable = false;

        // puertas
        this.darkDoor1 = this.physics.add.staticSprite(700, 400, 'puertaOscuraNivel1').setScale(0.7);
        this.lightDoor1 = this.physics.add.staticSprite(750, 400, 'puertaClaraNivel1').setScale(0.7);

        this.darkDoor1Hitbox = this.add.rectangle(250, 375, 20, 300, 0x322b1d, 0).setOrigin(0.5, 0.5);
        this.physics.add.existing(this.darkDoor1Hitbox, true);
            
        this.lightDoor1Hitbox = this.add.rectangle(920, 400, 20, 280, 0x322b1d, 0).setOrigin(0.5, 0.5);
        this.physics.add.existing(this.lightDoor1Hitbox, true);

        // daño placeholder
        this.trampa = this.physics.add.staticSprite(450, 150, 'damage').setScale(0.5);
        this.damage = this.add.rectangle(480, 100, 100, 60, 0x33ff00, 0).setOrigin(0.5, 0.5);
        this.physics.add.existing(this.damage, true);

        // Colisiones entre personajes y el suelo y plataformas
        this.physics.add.collider(this.nivia, this.ground);
        this.physics.add.collider(this.solenne, this.ground);
        this.physics.add.collider(this.nivia, this.plataforma1);
        this.physics.add.collider(this.solenne, this.plataforma1);
        this.physics.add.collider(this.nivia, this.plataforma2);
        this.physics.add.collider(this.solenne, this.plataforma2);
        this.physics.add.collider(this.nivia, this.plataforma3);
        this.physics.add.collider(this.solenne, this.plataforma3);
        this.physics.add.collider(this.nivia, this.plataforma4);
        this.physics.add.collider(this.solenne, this.plataforma4);
        this.physics.add.collider(this.nivia, this.plataforma5);
        this.physics.add.collider(this.solenne, this.plataforma5);
        this.physics.add.collider(this.nivia, this.pared1);
        this.physics.add.collider(this.solenne, this.pared1);
        this.physics.add.collider(this.nivia, this.pared2);
        this.physics.add.collider(this.solenne, this.pared2);
        this.physics.add.collider(this.nivia, this.lightDoor1Hitbox);
        this.physics.add.collider(this.solenne, this.darkDoor1Hitbox);

        this.createAnimations('nivia');
        this.createAnimations('solenne');

        this.nivia.play('nivia_idle');
        this.solenne.play('solenne_idle');

        // Creación de los objetos
        this.crystals = this.physics.add.group({allowGravity: false, immovable: true});
        this.moonCrystal = this.crystals.create(1100, 400, 'moondrop_sheet').setBodySize(32, 32).setScale(0.5);
        this.sunCrystal = this.crystals.create(100, 100, 'sundrop_sheet').setBodySize(32, 32).setScale(0.5);

        // Animaciones de los objetos
        this.anims.create({
            key: 'sundrop_idle',
            frames: this.anims.generateFrameNumbers('sundrop_sheet', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'moondrop_idle',
            frames: this.anims.generateFrameNumbers('moondrop_sheet', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.moonCrystal.play('moondrop_idle');
        this.sunCrystal.play('sundrop_idle');

        // Animación del Icono del Sol (HUD)
        this.anims.create({
            key: 'sun_hud_anim',
            frames: this.anims.generateFrameNumbers('sun_sheet', { start: 0, end: 10 }), 
            frameRate: 8,
            repeat: -1
        });

        // Animación del Icono de la Luna (HUD)
        this.anims.create({
            key: 'moon_hud_anim',
            frames: this.anims.generateFrameNumbers('moon_sheet', { start: 0, end: 10 }), 
            frameRate: 8,
            repeat: -1
        });

        // Indicador de Luna (Nivia) - Izquierda
        this.moonHUD = this.add.sprite(this.cameras.main.centerX - 20, 40, 'moon_sheet')
            .setScrollFactor(0)
            .setScale(0.15) 
            .setVisible(false) 
            .setDepth(100)
            .play('moon_hud_anim'); // Inicia la animación

        // Indicador de Sol (Solenne) - Derecha
        this.sunHUD = this.add.sprite(this.cameras.main.centerX + 20, 40, 'sun_sheet')
            .setScrollFactor(0)
            .setScale(0.15)
            .setVisible(false) 
            .setDepth(100)
            .play('sun_hud_anim'); // Inicia la animación

        // Lógica de la recolección de cristales
        this.physics.add.overlap(this.nivia, this.moonCrystal, this.collectMoonCrystal, null, this);
        this.physics.add.overlap(this.solenne, this.sunCrystal, this.collectSunCrystal, null, this);

        // Configuración de la cámara
        this.cameras.main.setBounds(0, 0, mapWidthInPixels, mapHeightInPixels);  

        // Control de pausa
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
        this.physics.add.overlap(this.nivia, this.exitPortal, () => {
            this.niviaOnPortal = true;
            this.checkLevelComplete();
        });

        this.physics.add.overlap(this.solenne, this.exitPortal, () => {
            this.solenneOnPortal = true;
            this.checkLevelComplete();
        });

        // Botón de pausa
        this.pauseButton = this.add.image(this.cameras.main.width - 40, 40, 'PauseButton')
            .setScrollFactor(0) 
            .setInteractive({ useHandCursor: true })
            .setScale(0.5) 
            .setDepth(100); 

        this.pauseButton.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(this.cameras.main.width - 40, 40, 'PauseButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.5)
                    .setDepth(this.pauseButton.depth + 1);
            }
        });

        this.pauseButton.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        this.pauseButton.on('pointerdown', () => {
            this.togglePause(); 
        });

        // Botón de ajustes
        this.settingsButton = this.add.image(this.cameras.main.width - 120, 40, 'SettingsButton')
            .setScrollFactor(0) 
            .setInteractive({ useHandCursor: true })
            .setScale(0.5) 
            .setDepth(100); 

        this.settingsButton.on('pointerover', () => {
            if (!hoverImg) {
                hoverImg = this.add.image(this.cameras.main.width - 120, 40, 'SettingsButtonHover')
                    .setOrigin(0.5)
                    .setScale(0.5)
                    .setDepth(this.settingsButton.depth + 1);
            }
        });

        this.settingsButton.on('pointerout', () => {
            if (hoverImg) {
                hoverImg.destroy();
                hoverImg = null;
            }
        });

        this.settingsButton.on('pointerdown', () => {
           this.scene.launch('SettingsScene');
        });


        this.events.on('update', () => {
            if (!this.physics.overlap(this.nivia, this.exitPortal)) {
                this.niviaOnPortal = false;
            }
            if (!this.physics.overlap(this.solenne, this.exitPortal)) {
                this.solenneOnPortal = false;
            }
        });
        this.physics.add.overlap(this.nivia, this.damage, () => {
            this.scene.launch('GameOverScene', { originalScene: this.scene.key });
            this.scene.pause();
        });
        this.physics.add.overlap(this.solenne, this.damage, () => {
            this.scene.launch('GameOverScene', { originalScene: this.scene.key });
            this.scene.pause();
        });
    }

    setUpPlayers() {
        const initialY = 1500;

        // Creación personajes
        this.nivia = this.physics.add.sprite(1300, initialY, 'nivia').setBounce(0.2).setCollideWorldBounds(true);
        this.solenne = this.physics.add.sprite(100, initialY, 'solenne').setBounce(0.2).setCollideWorldBounds(true);

        this.nivia.setSize(120, 240);
        this.nivia.setOffset(110, 50);

        this.solenne.setSize(120, 240);
        this.solenne.setOffset(110, 50);

        // Escalado de los personajes
        this.nivia.setScale(0.5); 
        this.solenne.setScale(0.5);

        // Controles de Nivia (Teclas WASD)
        this.niviaControls = this.input.keyboard.addKeys({
            left: 'A',
            right: 'D',
            up: 'W',    // salto
            //interact: 'E'
        });

        // Controles de Solenne (Flechas)
        this.solenneControls = this.input.keyboard.addKeys({
            left: 'LEFT',
            right: 'RIGHT',
            up: 'UP',   // salto
            //interact: 'SPACE'
        });
    }
    
    createAnimations(key) {
        // Animación de correr
        this.anims.create({
            key: `${key}_run`,
            frames: this.anims.generateFrameNames(key, { prefix: 'run_', start: 1, end: 4 }),
            frameRate: 10,
            repeat: -1
        });


        // Animación de salto
        this.anims.create({
            key: `${key}_jump`,
            frames: this.anims.generateFrameNames(key, { prefix: 'jump_', start: 1, end: 6 }),
            frameRate: 10,
            repeat: 0
        });

        // Animación de idle
        this.anims.create({
            key: `${key}_idle`,
            frames: this.anims.generateFrameNames(key, { frames: ['idle_1'] }),
            frameRate: 1,
            repeat: 0
        });
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

    toggleSettings() {
        this.scene.launch('SettingsScene'); 
    }


    update(){
        // Lógica de pausa con tecla ESC
        if(this.escKey.isDown){
            this.togglePause();
        }

        // Movimiento de Nivia
        this.handlePlayerMovement(this.nivia, this.niviaControls);

        // Movimiento de Solenne
        this.handlePlayerMovement(this.solenne, this.solenneControls);

        this.handleCameraAndConstraints();
        
        if(this.exitPortal.visible) {
            this.checkLevelComplete(this.exitPortal);
        }
    }

    handleCameraAndConstraints() {
        const niviaY = this.nivia.y;
        const solenneY = this.solenne.y;

        // Centrar la cámara entre ambos personajes
        const midY = (niviaY + solenneY) / 2;

        // Calcular la posición media en Y
        let desiredCameraY = midY;

        // Desplazar la cámara suavemente
        const lerpFactor = 0.05;
        const cameraHeight = this.cameras.main.height;

        this.cameras.main.scrollY = Phaser.Math.Linear(
            this.cameras.main.scrollY, 
            desiredCameraY - cameraHeight / 2, 
            lerpFactor
        );

        // Viewport constraint
        const maxVerticalGap = cameraHeight * 0.7; // distancia máxima permitida entre los personajes
        const distanceY = Math.abs(niviaY - solenneY);

        if (distanceY > maxVerticalGap) {
            const fasterPlayer = (niviaY < solenneY) ? this.nivia : this.solenne;
            const slowerPlayer = (niviaY < solenneY) ? this.solenne : this.nivia;

            if (slowerPlayer.body.blocked.down || slowerPlayer.y > fasterPlayer.y + maxVerticalGap) {
                // Detener el avance vertical (hacia arriba) del jugador más rápido
                if (fasterPlayer.body.velocity.y < 0) {
                    fasterPlayer.body.velocity.y = 0;
                }
                console.log("Movimiento vertical restringido por el jugador rezagado.");
            }
        }
    }

    handlePlayerMovement(playerSprite, controls) {
        // Velocidad del movimiento
        const speed = 400;
        const jumpVelocity = 900;
        const key = playerSprite.texture.key;
        const isMoving = controls.left.isDown || controls.right.isDown;
        const isGrounded = playerSprite.body.blocked.down;
        let animkey = '';

        // Lógica para reproducir el sonido de caminar
       if (isMoving && isGrounded) {
            if (key === 'nivia' && this.isNiviaWalking === null) {
                this.isNiviaWalking = this.sound.add('walkSound', { loop: true, volume: 1 });
                this.isNiviaWalking.play();
            } else if (key === 'solenne' && this.isSolenneWalking === null) {
                this.isSolenneWalking = this.sound.add('walkSound', { loop: true, volume: 1 });
                this.isSolenneWalking.play();
            }
        } else {
            // Detener el sonido si no se está moviendo o está saltando
            if (key === 'nivia' && this.isNiviaWalking) {
                this.isNiviaWalking.stop();
                this.isNiviaWalking = null;
            } else if (key === 'solenne' && this.isSolenneWalking) {
                this.isSolenneWalking.stop();
                this.isSolenneWalking = null;
            }
        }

        // Movimiento horizontal
        if (controls.left.isDown) {
            playerSprite.setVelocityX(-speed);
            playerSprite.setFlipX(false); // Mirar a la izquierda
        } else if (controls.right.isDown) {
            playerSprite.setVelocityX(speed);
            playerSprite.setFlipX(true); // Mirar a la derecha
        } else {
            playerSprite.setVelocityX(0);
        }

        // Salto (solo si está tocando el suelo)
        const isJumping = controls.up.isDown && playerSprite.body.blocked.down;

        if (isJumping) {
            playerSprite.setVelocityY(-jumpVelocity);
        }

        // Lógica de animaciones
        if (!playerSprite.body.blocked.down) {
            // En el aire
            animkey = `${key}_jump`;
        } else if (controls.left.isDown || controls.right.isDown) {
            // Corriendo
            animkey = `${key}_run`;
        } else {
            // Idle
            animkey = `${key}_idle`;
        }
        
        // Reproducir la animación solo si es diferente a la actual
        if (playerSprite.anims.currentAnim?.key !== animkey) {
            playerSprite.anims.play(animkey);
        }

        // Lógica de interacción
        /*if (Phaser.Input.Keyboard.JustDown(controls.interact)) {
            console.log('Interacción realizada');
        }*/
    }

    collectMoonCrystal(player, crystal) {
        crystal.disableBody(true, true);
        this.niviaHasMoonCrystal = true;
        this.moonHUD.setVisible(true);
        this.sound.play('collectMoonCrystalSound', { volume: 0.5 });
        console.log('Nivia ha recogido el Cristal de la Luna');
        this.unlockDarkDoor();
    }

    collectSunCrystal(player, crystal) {
        crystal.disableBody(true, true);
        this.solenneHasSunCrystal = true;
        this.sunHUD.setVisible(true);
        this.sound.play('collectSunCrystalSound', { volume: 0.5 });
        console.log('Solenne ha recogido el Cristal del Sol');
        this.unlockLightDoor();
    }

    unlockDarkDoor() {
        // Lógica para desbloquear la puerta oscura
        this.darkDoor1Hitbox.body.enable = false;   
        this.darkDoor1Hitbox.setVisible(false);
        this.darkDoor1.setVisible(false);
        console.log('Puerta Oscura desbloqueada');
        this.checkPortalSpawn();
    }

    unlockLightDoor() {
        // Lógica para desbloquear la puerta clara
        this.lightDoor1Hitbox.body.enable = false;   
        this.lightDoor1Hitbox.setVisible(false);
        this.lightDoor1.setVisible(false);
        console.log('Puerta Clara desbloqueada');
        this.checkPortalSpawn();
    }

    checkPortalSpawn() {
        if (this.niviaHasMoonCrystal && this.solenneHasSunCrystal) {
            console.log('Ambos cristales recogidos. El portal aparece.');
            this.exitPortal.setVisible(true);
            this.exitPortal.body.enable = true;
        }
    }

    checkLevelComplete(player, portal) {
        // Los dos deben tocar el portal y tener sus respectivos cristales
        if (this.niviaOnPortal && this.solenneOnPortal && this.niviaHasMoonCrystal && this.solenneHasSunCrystal) {
            this.scene.launch('VictoryScene', { originalScene: this.scene.key });
        }
    }

    endgame() {
        console.log("Juego Terminado");
        let hoverImg = null;   
        this.physics.pause();
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, "¡Nivel Completado!", { 
            fontSize: '48px', fill: '#FFFFFF' }).setOrigin(0.5);
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
    }
}