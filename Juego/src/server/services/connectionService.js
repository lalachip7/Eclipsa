export function createConnectionService() {
  // Map para almacenar sesiones
  const activeSessions = new Map();
  const INACTIVITY_TIMEOUT = 10000; // 10 segundos

  // Limpiar sesiones inactivas periódicamente
  setInterval(() => {
    const now = Date.now();
    let removed = 0;

    activeSessions.forEach((lastSeen, sessionId) => {
      if (now - lastSeen > INACTIVITY_TIMEOUT) {
        activeSessions.delete(sessionId);
        console.log(`Sesión desconectada: ${sessionId}`);
        removed++;
      }
    });

    if (removed > 0) {
      console.log(`Sesiones activas: ${activeSessions.size}`);
    }
  }, 2000);

  return {
    /**
     * Actualizar la última vez vista de una sesión
     * @param {string} sessionId - ID de la sesión del cliente
     * @returns {number} - Número de sesiones conectadas
     */
    updateConnection(sessionId) {
      const wasNew = !activeSessions.has(sessionId);
      
      activeSessions.set(sessionId, Date.now());
      
      if (wasNew) {
        console.log(`Nueva conexión: ${sessionId}`);
      }
      
      return activeSessions.size;
    },

    /**
     * Obtener el número de sesiones activas
     * @returns {number}
     */
    getActiveCount() {
      return activeSessions.size;
    },

    /**
     * Verificar si una sesión está activa
     * @param {string} sessionId
     * @returns {boolean}
     */
    isSessionActive(sessionId) {
      return activeSessions.has(sessionId);
    }
  };
}