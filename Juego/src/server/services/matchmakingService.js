// src/server/services/matchmakingService.js

/**
 * Matchmaking service - manages player queue and matches players
 */
export function createMatchmakingService(gameRoomService) {
  const queue = [];

  /**
   * Add a player to the matchmaking queue
   * @param {WebSocket} ws - The WebSocket connection
   */
  function joinQueue(ws) {
    // Check if already in queue
    if (queue.some(player => player.ws === ws)) {
      return;
    }

    queue.push({ ws });
    console.log(`📥 Jugador añadido a la cola. Total: ${queue.length}`);

    // Notify player they're in queue
    ws.send(JSON.stringify({
      type: 'queueStatus',
      position: queue.length,
      total: queue.length
    }));

    // Try to match players
    tryMatch();
  }

  /**
   * Remove a player from the queue
   * @param {WebSocket} ws - The WebSocket connection
   */
  function leaveQueue(ws) {
    const index = queue.findIndex(player => player.ws === ws);
    if (index !== -1) {
      queue.splice(index, 1);
      console.log(`📤 Jugador salió de la cola. Total: ${queue.length}`);
    }
  }

  /**
   * Try to match two players from the queue
   */
  function tryMatch() {
    if (queue.length >= 2) {
      const player1 = queue.shift();
      const player2 = queue.shift();

      // Create a game room
      const roomId = gameRoomService.createRoom(player1.ws, player2.ws);

      console.log(`🎮 Partida iniciada: ${roomId}`);

      // Notify both players
      player1.ws.send(JSON.stringify({
        type: 'gameStart',
        role: 'nivia',
        roomId
      }));

      player2.ws.send(JSON.stringify({
        type: 'gameStart',
        role: 'solenne',
        roomId
      }));
    }
  }

  /**
   * Get current queue size
   * @returns {number}
   */
  function getQueueSize() {
    return queue.length;
  }

  return {
    joinQueue,
    leaveQueue,
    getQueueSize
  };
}