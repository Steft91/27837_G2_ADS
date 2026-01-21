const express = require('express');
const service = require('../service/dispositivoService');
const auth = require('../middleware/auth');
const router = express.Router();


const authorize = require('../middleware/authorize');

// Crear dispositivo (solo técnico o admin)

router.post('/', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const dispositivo = await service.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Dispositivo creado correctamente',
      content: dispositivo
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Listar dispositivos (todos autenticados)

router.get('/', auth, async (req, res) => {
  try {
    const dispositivos = await service.findAll();
    res.json({
      status: 'success',
      message: 'Lista de dispositivos',
      content: dispositivos
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Ver dispositivo por id (todos autenticados)

router.get('/:id', auth, async (req, res) => {
  try {
    const dispositivo = await service.findById(req.params.id);
    if (!dispositivo) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Dispositivo encontrado',
      content: dispositivo
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Actualizar dispositivo (solo técnico o admin)

router.put('/:id', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const dispositivo = await service.update(req.params.id, req.body);
    if (!dispositivo) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Dispositivo actualizado',
      content: dispositivo
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Eliminar dispositivo (solo técnico o admin)

router.delete('/:id', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const dispositivo = await service.delete(req.params.id);
    if (!dispositivo) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Dispositivo eliminado',
      content: dispositivo
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