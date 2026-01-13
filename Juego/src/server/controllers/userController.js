/**
 * Controlador de usuarios usando closures
 * Este controlador maneja las peticiones HTTP relacionadas con usuarios
 * y utiliza el userService para las operaciones de datos
 *
 * Patrón: Inyección de dependencias - recibe el servicio como parámetro
 */

import bcrypt from "bcrypt";

export function createUserController(userService) {
  /**
   * POST /api/users - Crear nuevo usuario
   */
  async function create(req, res, next) {
    try {
      // 1. Extraer datos del body: username
      const { username, password } = req.body;

      // 2. Validar que los campos requeridos estén presentes (username, password)
      if (!username || !password) {
        return res.status(400).json({
          error: 'El campo username y password son obligatorios'
        });
      }

      // 3. Llamar a userService.createUser()
      const newUser = await userService.createUser({ username, password });

      // 4. Retornar 201 con el usuario creado
      res.status(201).json(newUser);
      } catch (error) {
        // 5. Si hay error (ej: email duplicado), retornar 400
        if (error.message === 'El usuario ya está registrado') {
          return res.status(400).json({ error: error.message });
        }
        next(error);
      }
  }

  /**
   * GET /api/users - Obtener todos los usuarios
   */
  async function getAll(req, res, next) {
    try {
      // TODO: Implementar
      // 1. Llamar a userService.getAllUsers()
      const users = userService.getAllUsers();

      // 2. Retornar 200 con el array de usuarios
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id - Obtener un usuario por ID
   */
  async function getById(req, res, next) {
    try {
      // 1. Extraer el id de req.params
      const { id } = req.params;

      // 2. Llamar a userService.getUserById()
      const user = userService.getUserById(id);

      // 3. Si no existe, retornar 404
      if (!user) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }

      // 4. Si existe, retornar 200 con el usuario
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/:id - Actualizar un usuario
   */
  async function update(req, res, next) {
    try {
      // TODO: Implementar
      // 1. Extraer el id de req.params
      const { id } = req.params;

      // 2. Extraer los campos a actualizar del body
      const updates = req.body;

      // 3. Llamar a userService.updateUser()
      const updatedUser = userService.updateUser(id, updates);

      // 4. Si no existe, retornar 404
      if (!updatedUser) {
        return res.status(404).json({
          error: 'Usuario no encontrado.'
        });
      } else if (updatedUser == -1){ // Si se quiere cambiar a un usuario ya existente
        return res.status(400).json({
          error: 'El nombre de usuario ya está en uso.'
        })
      }else if (updatedUser) {// 5. Si existe, retornar 200 con el usuario actualizado
        return res.status(200).json(updatedUser);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/:id - Eliminar un usuario
   */
  async function remove(req, res, next) {
    try {
      // 1. Extraer el id de req.params
      const { id } = req.params;

      // 2. Llamar a userService.deleteUser()
      const deleted = userService.deleteUser(id);

      // 3. Si no existía, retornar 404
      if (!deleted) {
        return res.status(404).json({
          error: 'Usuario no encontrado.'
        });
      }

      // 4. Si se eliminó, retornar 204 (No Content)
      if (deleted) {
        return res.status(204);
      }

    } catch (error) {
      next(error);
    }
  }

  async function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    let user = userService.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      id: user.id,
      username: user.username
    });
  }

  async function getRanking(req, res, next) {
    try {
      const ranking = userService.getRanking();
      res.status(200).json(ranking);
    } catch (error) {
      next(error);
    }
  }

  async function updateScore(req, res, next) {
  try {
    const { id } = req.params;
    const { time } = req.body;
    
    const updatedUser = userService.updateBestTime(id, time);
    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}

  // Exponer la API pública del controlador
  return {
    create,
    getAll,
    getRanking,
    getById,
    update,
    remove,
    login,
    updateScore
  };
}
