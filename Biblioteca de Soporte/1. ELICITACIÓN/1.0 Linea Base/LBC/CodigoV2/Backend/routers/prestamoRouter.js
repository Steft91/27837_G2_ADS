const express = require('express');
const service = require('../service/prestamoService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = express.Router();

router.post('/', auth, authorize(['admin', 'estudiante']), async (req, res) => {
  try {
    const prestamo = await service.create(req.body);
    res.status(201).json(prestamo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  const prestamos = await service.findAll();
  res.json(prestamos);
});

router.get('/:id', auth, async (req, res) => {
  const prestamo = await service.findById(req.params.id);
  if (!prestamo) return res.status(404).json({ message: 'No encontrado' });
  res.json(prestamo);
});

router.put('/:id', auth, async (req, res) => {
  try {
    const prestamo = await service.update(req.params.id, req.body);
    if (!prestamo) return res.status(404).json({ message: 'No encontrado' });
    res.json(prestamo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const prestamo = await service.delete(req.params.id);
  if (!prestamo) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Eliminado' });
});

module.exports = router;