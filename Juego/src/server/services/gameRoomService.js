/**
 * Game Room service - manages active game rooms and game state
 */
export function createGameRoomService() {
  const rooms = new Map(); // roomId -> room data
  let nextRoomId = 1;

  /**
   * Create a new game room with two players
   * @param {WebSocket} player1Ws - Player 1's WebSocket (Nivia)
   * @param {WebSocket} player2Ws - Player 2's WebSocket (Solenne)
   * @returns {string} Room ID
   */
  function createRoom(player1Ws, player2Ws) {
    const roomId = `room_${nextRoomId++}`;

    const room = {
      id: roomId,
      player1: {
        ws: player1Ws,
        role: 'nivia',
        x: 1300,
        y: 700,
        hasCrystal: false,
        onPortal: false
      },
      player2: {
        ws: player2Ws,
        role: 'solenne',
        x: 100,
        y: 700,
        hasCrystal: false,
        onPortal: false
      },
      gameState: {
        moonCrystalCollected: false,
        sunCrystalCollected: false,
        darkDoorUnlocked: false,
        lightDoorUnlocked: false,
        portalVisible: false
      },
      active: true
    };

    rooms.set(roomId, room);

    // Store room ID on WebSocket for quick lookup
    player1Ws.roomId = roomId;
    player2Ws.roomId = roomId;

    console.log(`Sala creada: ${roomId}`);

    return roomId;
  }

  /**
   * Handle player movement
   * @param {WebSocket} ws - Player's WebSocket
   * @param {Object} position - {x, y, flipX, animKey}
   */
  function handlePlayerMove(ws, position) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Update player position in server state
    const player = room.player1.ws === ws ? room.player1 : room.player2;
    player.x = position.x;
    player.y = position.y;

    // Relay to the other player
    const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;
    const playerRole = player.role;

    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify({
        type: 'playerMove',
        player: playerRole,
        x: position.x,
        y: position.y,
        flipX: position.flipX,
        animKey: position.animKey
      }));
    }
  }

  /**
   * Handle crystal collection
   * @param {WebSocket} ws - Player's WebSocket
   * @param {string} crystalType - 'moon' or 'sun'
   */
  function handleCrystalCollect(ws, crystalType) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    const player = room.player1.ws === ws ? room.player1 : room.player2;
    const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

    // Update game state
    if (crystalType === 'moon' && !room.gameState.moonCrystalCollected) {
      room.gameState.moonCrystalCollected = true;
      room.gameState.darkDoorUnlocked = true;
      player.hasCrystal = true;

      // Notify both players
      const msg = {
        type: 'crystalCollected',
        crystalType: 'moon',
        darkDoorUnlocked: true
      };

      ws.send(JSON.stringify(msg));
      if (opponent.readyState === 1) {
        opponent.send(JSON.stringify(msg));
      }

      console.log(`Cristal de Luna recogido en ${roomId}`);
    } 
    else if (crystalType === 'sun' && !room.gameState.sunCrystalCollected) {
      room.gameState.sunCrystalCollected = true;
      room.gameState.lightDoorUnlocked = true;
      player.hasCrystal = true;

      // Notify both players
      const msg = {
        type: 'crystalCollected',
        crystalType: 'sun',
        lightDoorUnlocked: true
      };

      ws.send(JSON.stringify(msg));
      if (opponent.readyState === 1) {
        opponent.send(JSON.stringify(msg));
      }

      console.log(`Cristal de Sol recogido en ${roomId}`);
    }

    // Check if portal should appear
    if (room.gameState.moonCrystalCollected && room.gameState.sunCrystalCollected) {
      room.gameState.portalVisible = true;

      const portalMsg = {
        type: 'portalSpawned'
      };

      ws.send(JSON.stringify(portalMsg));
      if (opponent.readyState === 1) {
        opponent.send(JSON.stringify(portalMsg));
      }

      console.log(`Portal activado en ${roomId}`);
    }
  }

  /**
   * Handle victory condition
   * @param {WebSocket} ws - Player's WebSocket
   * @param {boolean} onPortal - If player is on portal
   */
  function handlePortalTouch(ws, onPortal) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Update player portal status
    if (room.player1.ws === ws) {
      room.player1.onPortal = onPortal;
      console.log(`Player 1 (Nivia) en portal: ${onPortal}`);
    } else {
      room.player2.onPortal = onPortal;
      console.log(`Player 2 (Solenne) en portal: ${onPortal}`);
    }

    // Check victory condition
    // Both players must be on portal AND both crystals must be collected
    const bothOnPortal = room.player1.onPortal && room.player2.onPortal;
    const bothCrystals = room.gameState.moonCrystalCollected && room.gameState.sunCrystalCollected;

    if (bothOnPortal && bothCrystals) {
      const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;
      
      const victoryMsg = {
        type: 'victory'
      };

      console.log(`¡VICTORIA! Enviando mensaje a ambos jugadores en ${roomId}`);

      ws.send(JSON.stringify(victoryMsg));
      if (opponent.readyState === 1) {
        opponent.send(JSON.stringify(victoryMsg));
      }

      room.active = false;
    }
  }

  /**
   * Handle game over event (trap hit, etc)
   * @param {WebSocket} ws - Player's WebSocket
   * @param {string} reason - Reason for game over
   */
  function handleGameOver(ws, reason = 'trap') {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

    console.log(`Game Over en ${roomId} - Razón: ${reason}`);

    // Notificar a AMBOS jugadores
    const gameOverMsg = {
      type: 'gameOver',
      reason: reason
    };

    ws.send(JSON.stringify(gameOverMsg));
    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify(gameOverMsg));
    }

    // Marcar sala como inactiva
    room.active = false;
  }

  /**
   * Handle player disconnection
   * @param {WebSocket} ws - Disconnected player's WebSocket
   */
  function handleDisconnect(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    console.log(`Jugador desconectado en ${roomId}`);

    // Only notify if game is still active
    if (room.active) {
      const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

      if (opponent.readyState === 1) { // WebSocket.OPEN
        opponent.send(JSON.stringify({
          type: 'playerDisconnected'
        }));
        
        console.log(`Notificando desconexión al otro jugador`);
      }
    }

    // Clean up room
    room.active = false;
    rooms.delete(roomId);
    console.log(`Sala ${roomId} eliminada`);
  }

  /**
   * Get number of active rooms
   * @returns {number}
   */
  function getActiveRoomCount() {
    return Array.from(rooms.values()).filter(room => room.active).length;
  }

  return {
    createRoom,
    handlePlayerMove,
    handleCrystalCollect,
    handlePortalTouch,
    handleGameOver,
    handleDisconnect,
    getActiveRoomCount
  };
}