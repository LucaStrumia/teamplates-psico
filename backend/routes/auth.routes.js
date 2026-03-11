const express = require('express');
const router = express.Router();
const { validateInput } = require('../middleware/validation.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');

// Esquema de validación para registro
const registerSchema = {
  email: { type: 'email', required: true },
  password: { required: true, minLength: 8 },
  firstName: { required: true },
  lastName: { required: true }
};

// Esquema de validación para login
const loginSchema = {
  email: { type: 'email', required: true },
  password: { required: true }
};

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
router.post('/register', validateInput(registerSchema), async (req, res) => {
  try {
    // Lógica de registro
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      // token: generado
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/login
 * Login de usuario
 */
router.post('/login', validateInput(loginSchema), async (req, res) => {
  try {
    // Lógica de login
    res.status(200).json({
      message: 'Login exitoso',
      // token: generado
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/auth/logout
 * Logout de usuario
 */
router.post('/logout', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Logout exitoso' });
});

/**
 * POST /api/auth/refresh
 * Refrescar token
 */
router.post('/refresh', authenticateToken, (req, res) => {
  try {
    // Generar nuevo token
    res.status(200).json({
      // token: nuevoToken
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
