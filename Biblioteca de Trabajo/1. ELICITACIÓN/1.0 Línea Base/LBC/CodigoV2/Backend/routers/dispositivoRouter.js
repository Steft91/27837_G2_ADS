const express = require('express');
const service = require('../service/dispositivoService');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const dispositivo = await service.create(req.body);
    res.status(201).json(dispositivo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  const dispositivos = await service.findAll();
  res.json(dispositivos);
});

router.get('/:id', async (req, res) => {
  const dispositivo = await service.findById(req.params.id);
  if (!dispositivo) return res.status(404).json({ message: 'No encontrado' });
  res.json(dispositivo);
});

router.put('/:id', auth, async (req, res) => {
  try {
    const dispositivo = await service.update(req.params.id, req.body);
    if (!dispositivo) return res.status(404).json({ message: 'No encontrado' });
    res.json(dispositivo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const dispositivo = await service.delete(req.params.id);
  if (!dispositivo) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Eliminado' });
});

module.exports = router;