const express = require('express');
const service = require('../service/materiaService');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const materia = await service.create(req.body);
    res.status(201).json(materia);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  const materias = await service.findAll();
  res.json(materias);
});

router.get('/:id', async (req, res) => {
  const materia = await service.findById(req.params.id);
  if (!materia) return res.status(404).json({ message: 'No encontrado' });
  res.json(materia);
});

router.put('/:id', auth, async (req, res) => {
  try {
    const materia = await service.update(req.params.id, req.body);
    if (!materia) return res.status(404).json({ message: 'No encontrado' });
    res.json(materia);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const materia = await service.delete(req.params.id);
  if (!materia) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Eliminado' });
});

module.exports = router;