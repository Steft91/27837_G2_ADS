const express = require('express');
const service = require('../service/estudianteService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = express.Router();

// Crear estudiante (registro público)

router.post('/', async (req, res) => {
  try {
    const estudiante = await service.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Estudiante creado correctamente',
      content: estudiante
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Listar estudiantes (solo técnico o admin)

router.get('/', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const estudiantes = await service.findAll();
    res.json({
      status: 'success',
      message: 'Lista de estudiantes',
      content: estudiantes
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Ver estudiante por id (solo técnico, admin o el propio estudiante)

router.get('/:id', auth, async (req, res) => {
  if (req.user.role === 'TECNICO' || req.user.role === 'ADMIN' || req.user.id === req.params.id) {
    try {
      const estudiante = await service.findById(req.params.id);
      if (!estudiante) {
        return res.status(404).json({
          status: 'error',
          message: 'No encontrado',
          content: null
        });
      }
      res.json({
        status: 'success',
        message: 'Estudiante encontrado',
        content: estudiante
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: err.message,
        content: null
      });
    }
  } else {
    res.status(403).json({
      status: 'error',
      message: 'No autorizado',
      content: null
    });
  }
});

// Actualizar estudiante (solo técnico, admin o el propio estudiante)

router.put('/:id', auth, async (req, res) => {
  if (req.user.role === 'TECNICO' || req.user.role === 'ADMIN' || req.user.id === req.params.id) {
    try {
      const estudiante = await service.update(req.params.id, req.body);
      if (!estudiante) {
        return res.status(404).json({
          status: 'error',
          message: 'No encontrado',
          content: null
        });
      }
      res.json({
        status: 'success',
        message: 'Estudiante actualizado',
        content: estudiante
      });
    } catch (err) {
      res.status(400).json({
        status: 'error',
        message: err.message,
        content: null
      });
    }
  } else {
    res.status(403).json({
      status: 'error',
      message: 'No autorizado',
      content: null
    });
  }
});

// Eliminar estudiante (solo técnico o admin)

router.delete('/:id', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const estudiante = await service.delete(req.params.id);
    if (!estudiante) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Estudiante eliminado',
      content: estudiante
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

module.exports = router;