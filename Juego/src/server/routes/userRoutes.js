/**
 * Rutas para la gestión de usuarios
 * Define los endpoints HTTP y los conecta con el controlador
 *
 * Patrón: Inyección de dependencias - recibe el controlador como parámetro
 */

import express from 'express';

export function createUserRoutes(userController) {
  const router = express.Router();

  // POST /api/users/login - Login de usuario
  router.post('/login', userController.login);

  // POST /api/users/register - Crear nuevo usuario
  router.post('/register', userController.create);

  // GET /api/users - Obtener todos los usuarios
  router.get('/', userController.getAll);

  // GET /api/users/:id - Obtener un usuario por ID
  router.get('/:id', userController.getById);

  // GET /api/users/ranking - Obtener ranking de usuarios
  router.get('/ranking', userController.getRanking);

  // PUT /api/users/:id/score - Actualizar puntaje de un usuario
  router.put('/:id/score', userController.updateScore);

  // PUT /api/users/:id - Actualizar un usuario
  router.put('/:id', userController.update);

  // DELETE /api/users/:id - Eliminar un usuario
  router.delete('/:id', userController.remove);

  return router;
}
