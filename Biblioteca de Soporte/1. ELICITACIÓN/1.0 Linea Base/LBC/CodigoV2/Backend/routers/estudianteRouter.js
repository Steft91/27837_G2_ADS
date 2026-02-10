const express = require('express');
const service = require('../service/estudianteService');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const estudiante = await service.create(req.body);
    res.status(201).json(estudiante);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  const estudiantes = await service.findAll();
  res.json(estudiantes);
});

router.get('/:id', auth, async (req, res) => {
  const estudiante = await service.findById(req.params.id);
  if (!estudiante) return res.status(404).json({ message: 'No encontrado' });
  res.json(estudiante);
});

router.put('/:id', auth, async (req, res) => {
  try {
    const estudiante = await service.update(req.params.id, req.body);
    if (!estudiante) return res.status(404).json({ message: 'No encontrado' });
    res.json(estudiante);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const estudiante = await service.delete(req.params.id);
  if (!estudiante) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Eliminado' });
});

module.exports = router;