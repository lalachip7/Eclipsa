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

    preload() {
        // Cargar el JSON del nivel (Tilemap)
        this.load.tilemapTiledJSON('level1', 'assets/levels/level1.json');
        
        // Cargar la imagen del Tileset
        this.load.image('nombreDeLaImagenDelTileset', 'assets/tilesets/mi_tileset.png'); 

        // Cargar sprites de personajes y objetos
        this.load.image('nivia', 'assets/sprites/nivia_sprite.png'); 
        this.load.image('solenne', 'assets/sprites/solenne_sprite.png'); 
        this.load.image('moonCrystal', 'assets/items/moon_crystal.png');
        this.load.image('sunCrystal', 'assets/items/sun_crystal.png');
        this.load.image('metaPortal', 'assets/items/portal.png');
    }

    create() {
        // Configuración del tilemap
        const map = this.make.tilemap({ key: 'level1' });
        const tileset = map.addTilesetImage('myTileset', 'nombreDeLaImagenDelTileset');

        // Capas del nivel
        const geometryLayer = map.createLayer('Geometry', tileset);
        geometryLayer.setCollisionByProperty({ collides: true });

        // Configuración de la física del mundo
        this.physics.world.gravity.y = 1000;

        // Creación de los personajes
        this.setUpPlayers();

        // Creación de los objetos
        this.crystals = this.physics.add.group();
        this.moonCrystal = this.crystals.create(200, 300, 'moonCrystal'),
        this.sunCrystal = this.crystals.create(map.widthInPixels - 200, 300, 'sunCrystal')

        this.metaPortal = this.physics.add.sprite(map.widthInPixels - 100, map.heightInPixels - 150, 'metaPortal');

        // Lógica de la recolección de cristales
        this.physics.add.overlap(this.nivia, this.moonCrystal, this.collectMoonCrystal, null, this);
        this.physics.add.overlap(this.solenne, this.sunCrystal, this.collectSunCrystal, null, this);

        // Lógica de fin de nivel (Overlap del portal)
        this.physics.add.overlap(this.nivia, this.metaPortal, this.checkLevelComplete, null, this);
        this.physics.add.overlap(this.solenne, this.metaPortal, this.checkLevelComplete, null, this);

        // Variables para rastrear el estado de recolección de cristales
        this.niviaHasMoonCrystal = false;
        this.solenneHasSunCrystal = false;

        // Colisiones entre personajes y el nivel
        this.physics.add.collider(this.nivia, geometryLayer);
        this.physics.add.collider(this.solenne, geometryLayer);

        // Configuración de la cámara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);    

        // Control de pausa
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    setUpPlayers() {
         // Creación personajes
        this.nivia = this.physics.add.sprite(100, 450, 'nivia').setBounce(0.2).setCollideWorldBounds(true);
        this.solenne = this.physics.add.sprite(100, 450, 'solenne').setBounce(0.2).setCollideWorldBounds(true);

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
    }

    handlePlayerMovement(playerSprite, controls) {
        // Velocidad del movimiento
        const speed = 400;
        const jumpVelocity = 600;

        // Movimiento horizontal
        if (controls.left.isDown) {
            playerSprite.setVelocityX(-speed);
            playerSprite.setFlipX(true); // Mirar a la izquierda
        } else if (controls.right.isDown) {
            playerSprite.setVelocityX(speed);
            playerSprite.setFlipX(false); // Mirar a la derecha
        } else {
            playerSprite.setVelocityX(0);
        }

        // Salto (solo si está tocando el suelo)
        if (controls.up.isDown && playerSprite.body.blocked.down) {
            playerSprite.setVelocityY(-jumpVelocity);
        }

        // Lógica de interacción
        if (Phaser.Input.Keyboard.JustDown(controls.interact)) {
            // Aquí va la lógica de interacción (por ejemplo, abrir puertas, recoger objetos, etc.)
            console.log('Interacción realizada');
        }

        // Lógica para cambiar de animación
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
            console.log('Nivel completado!');
            // Aquí puedes agregar la lógica para avanzar al siguiente nivel o mostrar una pantalla de victoria
        }
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