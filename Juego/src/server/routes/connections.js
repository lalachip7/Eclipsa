import express from 'express';

export function createConnectionRoutes(connectionController) {
  const router = express.Router();

  router.post('/', connectionController.handleConnected);

  return router;
}


