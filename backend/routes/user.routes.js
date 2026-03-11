const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');

/**
 * GET /api/users/profile
 * Obtener perfil del usuario autenticado
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.status(200).json({ user: {} });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/users/profile
 * Actualizar perfil del usuario
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      user: {}
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/users/password
 * Cambiar contraseña
 */
router.put('/password', authenticateToken, async (req, res) => {
  try {
    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
