export class WebSocketService {
  constructor() {
    this.ws = null;
    this.connected = false;
    this.roomId = null;
    this.playerRole = null; // 'nivia' o 'solenne'
    this.messageHandlers = new Map();
  }

  /**
   * Conectar al servidor WebSocket
   * @returns {Promise<void>}
   */
  connect() {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `ws://${window.location.hostname}:3000`;
        console.log('🔌 Conectando a WebSocket:', wsUrl);
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket conectado');
          this.connected = true;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('❌ Error parseando mensaje:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ Error en WebSocket:', error);
          this.connected = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔌 WebSocket desconectado');
          this.connected = false;
          this.notifyHandler('connectionLost');
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Manejar mensajes del servidor
   * @param {Object} data - Datos recibidos
   */
  handleMessage(data) {
    console.log('📨 Mensaje recibido:', data.type);
    this.notifyHandler(data.type, data);
  }

  /**
   * Registrar un handler para un tipo de mensaje
   * @param {string} type - Tipo de mensaje
   * @param {Function} callback - Función a llamar
   */
  on(type, callback) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type).push(callback);
  }

  /**
   * Remover un handler
   * @param {string} type - Tipo de mensaje
   * @param {Function} callback - Función a remover
   */
  off(type, callback) {
    if (this.messageHandlers.has(type)) {
      const handlers = this.messageHandlers.get(type);
      const index = handlers.indexOf(callback);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Notificar a los handlers registrados
   * @param {string} type - Tipo de mensaje
   * @param {Object} data - Datos del mensaje
   */
  notifyHandler(type, data = {}) {
    if (this.messageHandlers.has(type)) {
      this.messageHandlers.get(type).forEach(handler => handler(data));
    }
  }

  /**
   * Enviar mensaje al servidor
   * @param {Object} message - Mensaje a enviar
   */
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('❌ WebSocket no está conectado');
    }
  }

  // ==================== MÉTODOS ESPECÍFICOS DEL JUEGO ====================

  /**
   * Unirse a la cola de matchmaking
   */
  joinQueue() {
    this.send({ type: 'joinQueue' });
    console.log('📥 Uniéndose a la cola...');
  }

  /**
   * Salir de la cola
   */
  leaveQueue() {
    this.send({ type: 'leaveQueue' });
    console.log('📤 Saliendo de la cola...');
  }

  /**
   * Enviar movimiento del jugador
   * @param {number} x - Posición X
   * @param {number} y - Posición Y
   * @param {boolean} flipX - Orientación del sprite
   * @param {string} animKey - Clave de la animación actual
   */
  sendPlayerMove(x, y, flipX, animKey) {
    this.send({
      type: 'playerMove',
      x,
      y,
      flipX,
      animKey
    });
  }

  /**
   * Notificar recolección de cristal
   * @param {string} crystalType - 'moon' o 'sun'
   */
  sendCrystalCollect(crystalType) {
    this.send({
      type: 'crystalCollect',
      crystalType
    });
    console.log(`💎 Cristal ${crystalType} recogido`);
  }

  /**
   * Notificar contacto con portal
   * @param {boolean} onPortal - Si está tocando el portal
   */
  sendPortalTouch(onPortal) {
    this.send({
      type: 'portalTouch',
      onPortal
    });
  }

  /**
   * Notificar game over (trampa tocada, etc)
   * @param {string} reason - Razón del game over
   */
  sendGameOver(reason = 'trap') {
    this.send({
      type: 'gameOver',
      reason
    });
  }

  /**
   * Desconectar
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
    this.roomId = null;
    this.playerRole = null;
    this.messageHandlers.clear();
  }

  /**
   * Verificar si está conectado
   * @returns {boolean}
   */
  isConnected() {
    return this.connected && this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Obtener rol del jugador
   * @returns {string|null}
   */
  getPlayerRole() {
    return this.playerRole;
  }

  /**
   * Establecer rol del jugador
   * @param {string} role - 'nivia' o 'solenne'
   */
  setPlayerRole(role) {
    this.playerRole = role;
    console.log(`🎮 Rol asignado: ${role}`);
  }
}

// Exportar instancia singleton
export const wsService = new WebSocketService();