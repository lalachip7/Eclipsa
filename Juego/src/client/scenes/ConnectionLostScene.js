import Phaser from 'phaser';
import { connectionManager } from '../services/ConnectionManager';

/**
 * Escena que se muestra cuando se pierde la conexión con el servidor
 * Pausa el resto de escenas y comprueba continuamente hasta que se restablezca
 */
export class ConnectionLostScene extends Phaser.Scene {
    constructor() {
        super('ConnectionLostScene');
        this.reconnectCheckTimer = null;
        this.connectionListener = null;
        this.isChecking = false;
    }

    init(data) {
        // Guardar la escena que estaba activa cuando se perdió la conexión
        this.previousScene = data?.previousScene;
    }

    create() {// Fondo semi-transparente
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);

        // Título
        this.add.text(400, 200, 'CONEXIÓN PERDIDA', {
            fontSize: '48px',
            color: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Mensaje de estado
        this.statusText = this.add.text(400, 300, 'Intentando reconectar...', {
            fontSize: '24px',
            color: '#ffff00'
        }).setOrigin(0.5);

        // Contador de intentos
        this.attemptCount = 0;
        this.attemptText = this.add.text(400, 350, 'Intentos: 0', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Indicador parpadeante (...)
        this.dotCount = 0;
        this.time.addEvent({
            delay: 2000,
            loop: true,
            callback: () => {
                this.dotCount = (this.dotCount + 1) % 4;
                const dots = '.'.repeat(this.dotCount);
                this.statusText.setText(`Intentando reconectar${dots}`);
            }
        });

        // Listener de reconexión
        this.connectionListener = (data) => {
            if (data.connected) {
                this.onReconnected();
            }
        };
        connectionManager.addListener(this.connectionListener);

        // Intentos de reconexión 
        this.reconnectCheckTimer = this.time.addEvent({
            delay: 2000,
            loop: true,
            callback: this.attemptReconnect,
            callbackScope: this
        });

        // Primer intento inmediato
        this.attemptReconnect();
    }

    async attemptReconnect() {
        if (this.isChecking) return;
        this.isChecking = true;

        this.attemptCount++;
        this.attemptText.setText(`Intentos: ${this.attemptCount}`);

        try {
            await connectionManager.checkConnection();
        } finally {
            this.isChecking = false;
        }
    }

    onReconnected() {
        // Limpiar timers
        if (this.reconnectCheckTimer) {
            this.reconnectCheckTimer.remove();
            this.reconnectCheckTimer = null;
        }

        // Remover listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
            this.connectionListener = null;
        }

        // Mensaje de éxito
        this.statusText.setText('¡Conexión restablecida!');
        this.statusText.setColor('#00ff00');

        // Reanudar escena anterior y detener la actual
        this.time.delayedCall(1000, () => {
            if (this.previousScene) {
                // Obtener la escena anterior y re-agregar su listener
                const gameScene = this.scene.get(this.previousScene);
                if (gameScene && gameScene.connectionListener) {
                    connectionManager.addListener(gameScene.connectionListener);
                }
                this.scene.resume(this.previousScene);
            }
            this.scene.stop();
        });
    }

    shutdown() {
        // Limpieza extra por seguridad
        if (this.reconnectCheckTimer) {
            this.reconnectCheckTimer.remove();
        }
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }
}
