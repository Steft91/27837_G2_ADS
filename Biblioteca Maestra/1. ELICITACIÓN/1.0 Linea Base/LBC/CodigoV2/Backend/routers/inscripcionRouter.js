const express = require('express');
const service = require('../service/inscripcionService');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const inscripcion = await service.create(req.body);
    res.status(201).json(inscripcion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  const inscripciones = await service.findAll();
  res.json(inscripciones);
});

router.get('/:id', auth, async (req, res) => {
  const inscripcion = await service.findById(req.params.id);
  if (!inscripcion) return res.status(404).json({ message: 'No encontrado' });
  res.json(inscripcion);
});

router.put('/:id', auth, async (req, res) => {
  try {
    const inscripcion = await service.update(req.params.id, req.body);
    if (!inscripcion) return res.status(404).json({ message: 'No encontrado' });
    res.json(inscripcion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const inscripcion = await service.delete(req.params.id);
  if (!inscripcion) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Eliminado' });
});

module.exports = router;