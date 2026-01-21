
const express = require('express');
const service = require('../service/prestamoService');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = express.Router();

// Crear préstamo (solo estudiante)
/**
 * @swagger
 * /api/prestamos:
 *   post:
 *     summary: Crear un préstamo
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dispositivoId:
 *                 type: string
 *                 example: 65f1a9b4c12e3a001234abcd
 *               fechaDevolucion:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-01
 *     responses:
 *       201:
 *         description: Préstamo creado correctamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo estudiantes)
 */
router.post('/', auth, authorize(['ESTUDIANTE']), async (req, res) => {
  try {
    const prestamo = await service.create(req.body, req.user);
    res.status(201).json({
      status: 'success',
      message: 'Préstamo creado correctamente',
      content: prestamo
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Listar préstamos (técnico ve todos, estudiante solo los suyos)
/**
 * @swagger
 * /api/prestamos:
 *   get:
 *     summary: Listar préstamos
 *     description: El técnico/admin ve todos, el estudiante solo los suyos
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de préstamos
 *       401:
 *         description: No autenticado
 */
router.get('/', auth, async (req, res) => {
  try {
    let prestamos;
    if (req.user.role === 'TECNICO' || req.user.role === 'ADMIN') {
      prestamos = await service.findAll();
    } else {
      prestamos = await service.getHistorialPrestamosByUsuario(req.user.id);
    }
    res.json({
      status: 'success',
      message: 'Lista de préstamos',
      content: prestamos
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Ver préstamo por id (solo si es suyo o si es técnico)
/**
 * @swagger
 * /api/prestamos/{id}:
 *   get:
 *     summary: Obtener préstamo por ID
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 65f1a9b4c12e3a001234abcd
 *     responses:
 *       200:
 *         description: Préstamo encontrado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const prestamo = await service.findById(req.params.id);
    if (!prestamo) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    if (req.user.role === 'TECNICO' || req.user.role === 'ADMIN' || String(prestamo.userId) === req.user.id) {
      res.json({
        status: 'success',
        message: 'Préstamo encontrado',
        content: prestamo
      });
    } else {
      res.status(403).json({
        status: 'error',
        message: 'No autorizado',
        content: null
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Actualizar préstamo (solo técnico)
/**
 * @swagger
 * /api/prestamos/{id}:
 *   put:
 *     summary: Actualizar préstamo
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 example: DEVUELTO
 *     responses:
 *       200:
 *         description: Préstamo actualizado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: No encontrado
 */
router.put('/:id', auth, authorize(['TECNICO', 'ADMIN']), async (req, res) => {
  try {
    const prestamo = await service.update(req.params.id, req.body);
    if (!prestamo) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    res.json({
      status: 'success',
      message: 'Préstamo actualizado',
      content: prestamo
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

// Anular préstamo (estudiante solo el suyo, técnico cualquiera)
/**
 * @swagger
 * /api/prestamos/{id}:
 *   delete:
 *     summary: Anular préstamo
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Préstamo anulado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: No encontrado
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const prestamo = await service.findById(req.params.id);
    if (!prestamo) {
      return res.status(404).json({
        status: 'error',
        message: 'No encontrado',
        content: null
      });
    }
    if (req.user.role === 'TECNICO' || req.user.role === 'ADMIN' || String(prestamo.userId) === req.user.id) {
      const anulado = await service.delete(req.params.id);
      res.json({
        status: 'success',
        message: 'Préstamo anulado',
        content: anulado
      });
    } else {
      res.status(403).json({
        status: 'error',
        message: 'No autorizado',
        content: null
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      content: null
    });
  }
});

module.exports = router;