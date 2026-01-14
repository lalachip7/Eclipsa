// src/client/scenes/LobbyScene.js
import Phaser from "phaser";
import { wsService } from '../services/WebSocketService';

export default class LobbyScene extends Phaser.Scene {
  constructor() {
    super('LobbyScene');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Fondo
    this.background = this.add.rectangle(0, 0, width, height, 0x070722, 0.9).setOrigin(0);

    // Título
    this.add.text(width / 2, 100, 'MULTIJUGADOR ONLINE', {
      fontSize: '48px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Subtítulo
    this.add.text(width / 2, 160, 'Fireboy & Watergirl Style', {
      fontSize: '24px',
      color: '#888888'
    }).setOrigin(0.5);

    // Estado de conexión
    this.statusText = this.add.text(width / 2, height / 2 - 50, 'Conectando al servidor...', {
      fontSize: '28px',
      color: '#ffff00'
    }).setOrigin(0.5);

    // Contador de jugadores
    this.playerCountText = this.add.text(width / 2, height / 2 + 20, '', {
      fontSize: '22px',
      color: '#00ff00'
    }).setOrigin(0.5);

    // Indicador de carga (puntos animados)
    this.loadingDots = '';
    this.time.addEvent({
      delay: 500,
      callback: () => {
        if (this.scene.isActive('LobbyScene')) {
          this.loadingDots = (this.loadingDots.length >= 3) ? '' : this.loadingDots + '.';
          if (this.statusText.text.includes('Esperando')) {
            this.statusText.setText(`Esperando oponente${this.loadingDots}`);
          }
        }
      },
      loop: true
    });

    // Botón de cancelar
    const cancelButton = this.add.text(width / 2, height - 100, '❌ Cancelar', {
      fontSize: '24px',
      color: '#ff6666',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    cancelButton.on('pointerover', () => {
      cancelButton.setStyle({ backgroundColor: '#555555', color: '#ff0000' });
    });

    cancelButton.on('pointerout', () => {
      cancelButton.setStyle({ backgroundColor: '#333333', color: '#ff6666' });
    });

    cancelButton.on('pointerdown', () => {
      this.leaveQueue();
    });

    // Conectar al servidor WebSocket
    this.connectToServer();
  }

  async connectToServer() {
    try {
      // Conectar al WebSocket
      await wsService.connect();
      
      this.statusText.setText('Esperando oponente');
      this.statusText.setColor('#00ff00');

      // Registrar handlers de mensajes
      this.queueStatusHandler = this.handleQueueStatus.bind(this);
      this.gameStartHandler = this.handleGameStart.bind(this);
      this.connectionLostHandler = this.handleConnectionLost.bind(this);

      wsService.on('queueStatus', this.queueStatusHandler);
      wsService.on('gameStart', this.gameStartHandler);
      wsService.on('connectionLost', this.connectionLostHandler);

      // Unirse a la cola
      wsService.joinQueue();

    } catch (error) {
      console.error('❌ Error conectando al servidor:', error);
      this.statusText.setText('Error de conexión');
      this.statusText.setColor('#ff0000');
      
      // Botón de reintentar
      const retryButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 100, 
        '🔄 Reintentar', {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#4444ff',
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      retryButton.on('pointerdown', () => {
        retryButton.destroy();
        this.connectToServer();
      });
    }
  }

  handleQueueStatus(data) {
    this.playerCountText.setText(`Jugadores en cola: ${data.position}/2`);
  }

  handleGameStart(data) {
    console.log('🎮 ¡Partida encontrada!', data);
    
    // Guardar el rol del jugador
    wsService.setPlayerRole(data.role);
    
    this.statusText.setText('¡Partida encontrada!');
    this.statusText.setColor('#00ff00');
    this.playerCountText.setText('Iniciando juego...');

    // Transición a la escena de juego después de 1 segundo
    this.time.delayedCall(1000, () => {
      // Pasar el rol al GameScene
      this.scene.start('GameScene', { 
        isMultiplayer: true,
        playerRole: data.role,
        roomId: data.roomId
      });
    });
  }

  handleConnectionLost() {
    console.log('❌ Conexión perdida en Lobby');
    this.statusText.setText('Conexión perdida');
    this.statusText.setColor('#ff0000');
    this.playerCountText.setText('');

    // Volver al menú después de 2 segundos
    this.time.delayedCall(2000, () => {
      this.leaveQueue();
    });
  }

  leaveQueue() {
    // Limpiar handlers
    if (this.queueStatusHandler) {
      wsService.off('queueStatus', this.queueStatusHandler);
    }
    if (this.gameStartHandler) {
      wsService.off('gameStart', this.gameStartHandler);
    }
    if (this.connectionLostHandler) {
      wsService.off('connectionLost', this.connectionLostHandler);
    }

    // Salir de la cola y desconectar
    wsService.leaveQueue();
    wsService.disconnect();

    // Volver al menú
    this.scene.start('MenuScene');
  }

  shutdown() {
    this.leaveQueue();
  }
}