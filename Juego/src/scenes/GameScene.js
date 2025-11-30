import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init() {
        this.isPaused = false;
        this.escWasDown = false;

        this.niviaHasMoonCrystal = false;
        this.solenneHasSunCrystal = false;
    }

    preload() {
        // Carga de los personajes
        this.load.atlas('nivia', 'assets/nivia/nivia_sheet.png', 'assets/nivia/nivia_sheet.json');
        this.load.atlas('solenne', 'assets/solenne/solenne_sheet.png', 'assets/solenne/solenne_sheet.json');
       
        // Carfga de los cristales
        this.load.spritesheet('sundrop_sheet', 'assets/items/sundrop.png', { frameWidth: 214, frameHeight: 206 });
        this.load.spritesheet('moondrop_sheet', 'assets/items/moondrop.png', { frameWidth: 214, frameHeight: 206 });

        // Carga del fondo
        this.load.image('fondo', 'assets/Escenario/Nivel1/fondo_abajo.png');
        this.load.image('fondo', 'assets/Escenario/Nivel2/fondo_arriba.png');

        // Carga de los elementos del escenario
        this.load.image('plataformasNivel1', 'assets/Escenario/Nivel1/plataformas_abajo.png');
        this.load.image('plataformasNivel2', 'assets/Escenario/Nivel2/plataformas_arriba.png');

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

        this.load.image('portal', 'assets/Escenario/Nivel2/portal.png');
    }

    create() {
        // Configuración del tilemap
        //const map = this.make.tilemap({ key: 'level1' });
        //const tileset = map.addTilesetImage('myTileset', 'level1');

        const mapWidthInPixels = 1420;
        const mapHeightInPixels = 1600;

        // Agregar fondo
        this.add.image(mapWidthInPixels, mapHeightInPixels, 'fondo');
        
        // Capas del nivel
        //const geometryLayer = map.createLayer('Geometry', tileset);
        //geometryLayer.setCollisionByProperty({ collides: true });

        // Configuración de la física del mundo
        this.physics.world.gravity.y = 1000;

        // Creación de los personajes
        this.setUpPlayers();



        // TEMPORAL: Crear un suelo simple para que puedan saltar y caer
        this.ground = this.add.rectangle(0, mapHeightInPixels - 50, mapWidthInPixels, 50, 0x00FF00).setOrigin(0, 0);
        this.physics.add.existing(this.ground, true); // true = estático

        // Colisiones entre personajes y el suelo temporal
        this.physics.add.collider(this.nivia, this.ground);
        this.physics.add.collider(this.solenne, this.ground);



        this.createAnimations('nivia');
        this.createAnimations('solenne');

        // Iniciar la animación 'run' para probar (se corregirá en update)
        this.nivia.play('nivia_idle');
        this.solenne.play('solenne_idle');

        // Creación de los objetos
        this.crystals = this.physics.add.group();
        this.moonCrystal = this.crystals.create(200, 300, 'moondrop_sheet').setBodySize(32, 32).setImmovable(true);
        this.sunCrystal = this.crystals.create(mapWidthInPixels - 200, 300, 'sundrop_sheet').setBodySize(32, 32).setImmovable(true);
        //this.sunCrystal = this.crystals.create(map.widthInPixels - 200, 300, 'sunCrystal').setBodySize(32, 32).setImmovable(true);

        //this.metaPortal = this.physics.add.sprite(mapWidthInPixels / 2, 50, 'metaPortal').setImmovable(true).setBodySize(64, 64);

        // Animaciones de los objetos
        this.anims.create({
            key: 'crystal_idle',
            frames: this.anims.generateFrameNumbers('sundrop_sheet', { start: 0, end: 7 }),
            frameRate: 6,
            repeat: -1
        });

        this.moonCrystal.play('crystal_idle');
        this.sunCrystal.play('crystal_idle');

        // Lógica de la recolección de cristales
        this.physics.add.overlap(this.nivia, this.moonCrystal, this.collectMoonCrystal, null, this);
        this.physics.add.overlap(this.solenne, this.sunCrystal, this.collectSunCrystal, null, this);

        // Lógica de fin de nivel (Overlap del portal)
        //this.physics.add.overlap(this.nivia, this.metaPortal, this.checkLevelComplete, null, this);
        //this.physics.add.overlap(this.solenne, this.metaPortal, this.checkLevelComplete, null, this);

        // Colisiones entre personajes y el nivel
        //this.physics.add.collider(this.nivia, geometryLayer);
        //this.physics.add.collider(this.solenne, geometryLayer);

        // Configuración de la cámara
        this.cameras.main.setBounds(0, 0, mapWidthInPixels, mapHeightInPixels);  

        // Control de pausa
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    setUpPlayers() {
        const initialY = 1500;

         // Creación personajes
        this.nivia = this.physics.add.sprite(100, initialY, 'nivia').setBounce(0.2).setCollideWorldBounds(true);
        this.solenne = this.physics.add.sprite(100, initialY, 'solenne').setBounce(0.2).setCollideWorldBounds(true);

        // Controles de Nivia (Teclas WASD)
        this.niviaControls = this.input.keyboard.addKeys({
            left: 'A',
            right: 'D',
            up: 'W',    // salto
            interact: 'E'
        });

        // Controles de Solenne (Flechas)
        this.solenneControls = this.input.keyboard.addKeys({
            left: 'LEFT',
            right: 'RIGHT',
            up: 'UP',   // salto
            interact: 'SPACE'
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
        const jumpVelocity = 600;
        const key = playerSprite.texture.key;
        let animkey = '';

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
        if (Phaser.Input.Keyboard.JustDown(controls.interact)) {
            // Aquí va la lógica de interacción (por ejemplo, abrir puertas, recoger objetos, etc.)
            console.log('Interacción realizada');
        }
    }

    collectMoonCrystal(player, crystal) {
        crystal.disableBody(true, true);
        this.niviaHasMoonCrystal = true;
        console.log('Nivia ha recogido el Cristal de la Luna');
    }

    collectSunCrystal(player, crystal) {
        crystal.disableBody(true, true);
        this.solenneHasSunCrystal = true;
        console.log('Solenne ha recogido el Cristal del Sol');
    }

    checkLevelComplete(player, portal) {
        // Los dos deben tocar el portal y tener sus respectivos cristales
        const niviaInPortal = Phaser.Geom.Intersects.RectangleToRectangle(
            this.nivia.getBounds(), portal.getBounds()
        );
        const solenneInPortal = Phaser.Geom.Intersects.RectangleToRectangle(
            this.solenne.getBounds(), portal.getBounds()
        );
        
        if (niviaInPortal && solenneInPortal && this.niviaHasMoonCrystal && this.solenneHasSunCrystal) {
            console.log('Nivel completado! Formando el eclipse...');
            // Aquí puedes agregar la lógica para avanzar al siguiente nivel o mostrar una pantalla de victoria
        }
    }

    endgame(winnerId) {
       console.log("Juego Terminado:", message);
        this.physics.pause();
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, message, { 
            fontSize: '48px', fill: '#FFFFFF' }).setOrigin(0.5);
    }
}