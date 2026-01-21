const express = require('express');
const service = require('../service/inscripcionService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = express.Router();

// Crear inscripción (solo técnico o admin)

router.post('/', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const inscripcion = await service.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Inscripción creada correctamente',
      content: inscripcion
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Listar inscripciones (todos autenticados)

router.get('/', auth, async (req, res) => {
  try {
    const inscripciones = await service.findAll();
    res.json({
      status: 'success',
      message: 'Lista de inscripciones',
      content: inscripciones
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Ver inscripción por id (todos autenticados)

router.get('/:id', auth, async (req, res) => {
  try {
    const inscripcion = await service.findById(req.params.id);
    if (!inscripcion) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Inscripción encontrada',
      content: inscripcion
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Actualizar inscripción (solo técnico o admin)

router.put('/:id', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const inscripcion = await service.update(req.params.id, req.body);
    if (!inscripcion) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Inscripción actualizada',
      content: inscripcion
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Eliminar inscripción (solo técnico o admin)

router.delete('/:id', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const inscripcion = await service.delete(req.params.id);
    if (!inscripcion) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Inscripción eliminada',
      content: inscripcion
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