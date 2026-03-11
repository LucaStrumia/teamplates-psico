const express = require('express');
const router = express.Router();

/**
 * GET /api/templates
 * Obtener todos los templates disponibles
 */
router.get('/', async (req, res) => {
  try {
    const templates = [
      {
        id: 1,
        name: 'Portfolio Elegante',
        description: 'Template minimalista y elegante',
        preview: '/images/template-1-preview.jpg',
        category: 'profesional'
      },
      {
        id: 2,
        name: 'Portfolio Moderno',
        description: 'Template moderno con efectos interactivos',
        preview: '/images/template-2-preview.jpg',
        category: 'moderno'
      },
      {
        id: 3,
        name: 'Portfolio Creativo',
        description: 'Template creativo y colorido',
        preview: '/images/template-3-preview.jpg',
        category: 'creativo'
      }
    ];
    res.status(200).json({ templates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/templates/:id
 * Obtener detalles de un template específico
 */
router.get('/:id', async (req, res) => {
  try {
    res.status(200).json({ template: {} });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
