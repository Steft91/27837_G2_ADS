const express = require('express');
const service = require('../service/materiaService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = express.Router();

// Crear materia (solo técnico o admin)

router.post('/', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const materia = await service.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Materia creada correctamente',
      content: materia
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Listar materias (todos autenticados)

router.get('/', auth, async (req, res) => {
  try {
    const materias = await service.findAll();
    res.json({
      status: 'success',
      message: 'Lista de materias',
      content: materias
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Ver materia por id (todos autenticados)

router.get('/:id', auth, async (req, res) => {
  try {
    const materia = await service.findById(req.params.id);
    if (!materia) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Materia encontrada',
      content: materia
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Actualizar materia (solo técnico o admin)

router.put('/:id', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const materia = await service.update(req.params.id, req.body);
    if (!materia) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Materia actualizada',
      content: materia
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Eliminar materia (solo técnico o admin)

router.delete('/:id', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const materia = await service.delete(req.params.id);
    if (!materia) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Materia eliminada',
      content: materia
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