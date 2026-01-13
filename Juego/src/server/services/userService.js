/**
 * Servicio de gestión de usuarios usando closures
 * Este servicio mantiene el estado de los usuarios en memoria
 * y proporciona métodos para realizar operaciones CRUD
 */

import fs from "fs";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export function createUserService() {
  // Estado privado: almacén de usuarios
  const USERS_FILE = "./src/server/data/users.json";
  
  function getNextId(users) {
    if (users.length === 0) return 1;
    return Math.max(...users.map(u => u.id)) + 1;
  }

  function readUsers() 
  {
    return JSON.parse(fs.readFileSync(USERS_FILE));
  }

  function writeUsers(users) 
  {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - {username, password}
   * @returns {Object} Usuario creado
   */
  async function createUser(userData) {
    // 1. Validar que el username no exista ya
    const users = readUsers();
    const existingUser = users.find(u => u.username === userData.username);
    if (existingUser) {
      throw new Error('El usuario ya está registrado');
    }

    // La contraseña se guarda hasheada por seguridad
    const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);

    // 2. Crear objeto usuario con id único y createdAt
    const newUser = {
      id: String(getNextId(users)),
      username: userData.username,
      password: passwordHash,
      bestTime: null,
      createdAt: new Date().toISOString()
    };

    // 3. Agregar a la lista de usuarios
    users.push(newUser);
    writeUsers(users);

    // 4. Retornar el usuario creado
    return newUser;
  }

  /**
   * Obtiene todos los usuarios
   * @returns {Array} Array de usuarios
   */
  function getAllUsers() {
    // Retornar una copia del array de usuarios
    const users = readUsers();

    return users.map(({ id, username, createdAt, bestTime}) => ({
      id,
      username,
      createdAt,
      bestTime
    }));
  }

  /**
   * Busca un usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  function getUserById(id) {
    const users = readUsers();
    const user = users.find(u => u.id === id);
    return user || null;
  }

  function getUserByUsername(username) {
    const users = readUsers();
    const user = users.find(u => u.username === username);
    return user || null;
  }

  /**
   * Busca un usuario por email
   * @param {string} email - Email del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  //function getUserByEmail(email) {
    // TODO: Implementar
    // Buscar y retornar el usuario por email, o null si no existe
    // IMPORTANTE: Esta función será usada por el chat para verificar emails
    //throw new Error('getUserByEmail() no implementado');
  //}

  /**
   * Actualiza un usuario
   * @param {string} id - ID del usuario
   * @param {Object} updates - Campos a actualizar
   * @returns {Object|null} Usuario actualizado o null si no existe
   */
  function updateUser(id, updates) {
    // 1. Buscar el usuario por id
    const users = readUsers();
    const index = users.findIndex(u => u.id === id);

    // 2. Si no existe, retornar null
    if (index === -1) {
      return null;
    }

    if (updates.username) {
      // Verificar que el nuevo username no esté en uso por otro usuario
      const existingUser = users.find(u => u.username === updates.username && u.id !== id);
      if (existingUser) {
        return -1; // Indicar que el username ya está en uso
      }
    }
    
    // 3. Actualizar solo los campos permitidos (name, avatar, level)
    // 4. NO permitir actualizar id, email, o createdAt
    Object.keys(updates).forEach(key => {
      if (['username', 'bestTime'].includes(key)) {
        users[index][key] = updates[key];
      }
    });

    if (updates.password) {
      // Hashear la nueva contraseña
      const passwordHash = bcrypt.hashSync(updates.password, SALT_ROUNDS);
      users[index].password = passwordHash;
    }

    // 5. Escribir usuario a memoria
    writeUsers(users);

    // 6. Retornar el usuario actualizado
    return users[index];
  }

  /**
   * Elimina un usuario
   * @param {string} id - ID del usuario
   * @returns {boolean} true si se eliminó, false si no existía
   */
  function deleteUser(id) {
    // 1. Buscar el índice del usuario
    const users = readUsers();
    const index = users.findIndex(u => u.id === id);

    // 2. Si existe, eliminarlo del array
    // 3. Retornar true si se eliminó, false si no existía
    if (index === -1) return false;

    users.splice(index, 1);
    writeUsers(users);
    return true;
  }

  // Exponer la API pública del servicio
  return {
    createUser,
    getAllUsers,
    getUserById,
    getUserByUsername,
    updateUser,
    deleteUser
  };
}
